import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';

import { Persistence } from './persistance';
import { TurnData, ResultData } from './persistance-data';
import { GameResult, MoveData } from './game-data';

import { Mcts } from './mcts';
import { retrieveAllPossibleMoves } from './moves';

const { Rules } = require('../src/rules/RulesExporter');

const { getCurrentPlayerCards, getSideIndexes } = require('../src/utils');

const moveNames = {
    draw: 'drawCard',
    playCard: 'clickCell',
    endTurn: 'endTurn',
};

export abstract class Player {
    id: string;
    matchKey?: string;
    type: string = '';

    client: _ClientImpl | null = null;

    turnData?: TurnData;

    constructor(id: string) {
        this.id = id;
    }

    protected abstract selectMove(moves: MoveData[]): MoveData | null;

    play(turn: number, sideCards: number[]): number[] {
        if (!this.client) {
            return sideCards;
        }

        if (!this.matchKey) {
            throw new Error('Match key not available on player');
        }

        const { G, ctx } = this.client.getState()!;
        const { moves } = this.client;

        const turnData: TurnData = {
            playerId: this.id,
            playerType: this.type,
            pickedCard: false,
            played: false,
            possiblePlaysAmount: 0,
        };

        const zIndex = turn + 2;

        let cards = getCurrentPlayerCards(G, ctx);
        const possibleMoves = this.getMoves(G, cards, sideCards, zIndex, ctx.currentPlayer)
        if (possibleMoves.length == 0) {
            moves[moveNames.draw]();

            const { G, ctx } = this.client.getState()!;

            cards = getCurrentPlayerCards(G, ctx);
            const index = cards.length - 1;
            const card = cards[index];

            possibleMoves.push(
                ...this.getMoves(G, [card], sideCards, zIndex, ctx.currentPlayer),
            );

            turnData.pickedCard = true;
            turnData.cardsInHandAmount = cards.length;
        }

        const selectedMove = this.selectMove(possibleMoves);

        let newSideCards = [...sideCards];

        if (selectedMove) {
            turnData.played = true;

            turnData.playedCardId = selectedMove.cardId;
            turnData.playedRotation = selectedMove.rotation;
            turnData.playedZIndex = selectedMove.zIndex;
            turnData.playedCellIndex = selectedMove.cellIndex;

            turnData.possiblePlaysAmount = possibleMoves.length;
            turnData.cardsInHandAmount = cards.length - 1;

            moves[moveNames.playCard](
                selectedMove.cellIndex,
                selectedMove.zIndex,
                selectedMove.card,
            );

            newSideCards[selectedMove.sideCardIndex] = selectedMove.cellIndex;
        } else {
            moves[moveNames.endTurn]();
        }

        Persistence.saveTurnData(this.matchKey, turnData);

        return newSideCards;
    }

    getMoves(G: any, cards: any, sideCards: any, zIndex: any, currentPlayer: any): MoveData[] {
        return retrieveAllPossibleMoves(
            G.cells,
            cards,
            sideCards,
            zIndex,
        );
    }

    gameFinished(): GameResult {
        const client = this.client;

        if (!client) {
            return {
                draw: false,
                finished: true,
                message: 'error',
            };
        }

        const { G, ctx } = client.getState()!;
        const { deck } = G!;

        const cards = getCurrentPlayerCards(G, ctx);

        if (deck.length == 0) {
            return {
                draw: true,
                finished: true,
                message: 'deck out of cards',
            };
        }

        if (cards.length == 0) {
            return {
                winner: this.id,
                draw: false,
                finished: true,
                message: 'won game',
            };
        }

        return {
            draw: false,
            finished: false,
            message: 'game continues',
        };
    }

    setClient(client: _ClientImpl): void {
        this.client = client;
    }

    setMatchKey(key: string): void {
        this.matchKey = key;
    }
}

export class RandomPlayer extends Player {
    type: string = 'RANDOM';

    protected selectMove(moves: MoveData[]): MoveData | null {
        if (!this.client) {
            return null;
        }

        if (moves.length == 0) {
            return null;
        }

        const { ctx } = this.client.getState()!;

        // if (!ctx || !ctx.random) {
        //     return null;
        // }

        // TODO: check if this really does work
        // const index = ctx.random.Die(moves.length);

        const index = Math.floor(Math.random() * moves.length);

        return moves[index];
    }
}

export class FreeEdgePlayer extends Player {
    type: string = 'FREE_EDGE';

    protected selectMove(moves: MoveData[]): MoveData | null {
        if (!this.client) {
            return null;
        }

        if (moves.length == 0) {
            return null;
        }

        const { G } = this.client.getState()!;

        let maxSideIndex = 0;
        let selectedMove = null;

        for (const move of moves) {
            const sideIndexes = getSideIndexes(move.cellIndex);
            let availableSides = 0;

            for (const sideIndex of sideIndexes) {
                if (
                    Rules.verifyPosition(G.cells, sideIndex) &&
                    Rules.verifySideCards(G.cells, sideIndex) &&
                Rules.verifyCardConnections(G.cells, sideIndex)
                ) {
                    availableSides++;
                }
            }

            if (availableSides > maxSideIndex) {
                maxSideIndex = availableSides;
                selectedMove = move;
            }
        }

        return selectedMove;
    }
}

export class MctsPlayer extends Player {
    type: string = 'MCTS';

    getMoves(G: any, cards: any, sideCards: any, zIndex: any, currentPlayer: any): MoveData[] {
        const mcts = new Mcts(G, currentPlayer, sideCards, zIndex, currentPlayer);
        return mcts.getBestMove();
    }

    protected selectMove(moves: MoveData[]): MoveData | null {
        if (!this.client) return null;
        if (moves.length == 0) return null;

        const { G } = this.client.getState()!;

        let maxSideIndex = 0;
        let selectedMove = null;

        for (const move of moves) {
            const sideIndexes = getSideIndexes(move.cellIndex);
            let availableSides = 0;

            for (const sideIndex of sideIndexes) {
                if (
                    Rules.verifyPosition(G.cells, sideIndex) &&
                    Rules.verifySideCards(G.cells, sideIndex) &&
                Rules.verifyCardConnections(G.cells, sideIndex)
                ) {
                    availableSides++;
                }
            }

            if (availableSides > maxSideIndex) {
                maxSideIndex = availableSides;
                selectedMove = move;
            }
        }

        return selectedMove;
    }
}
