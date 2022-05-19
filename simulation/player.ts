import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';

import { Persistence } from './persistance';
import { TurnData, ResultData } from './persistance-data';

const { Rules } = require('../src/Rules');

const { getCurrentPlayerCards, getSideIndexes } = require('../src/utils');

const moveNames = {
    draw: 'drawCard',
    playCard: 'clickCell',
    endTurn: 'endTurn',
};

type MoveData = {
    card: any;
    cardId: number;
    rotation: number;
    zIndex: number;
    cellIndex: number;
    sideCardIndex: number;
};

type GameResult = ResultData & {
    finished: boolean;
    message?: string;
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
        const possibleMoves = this.retrieveAllPossibleMoves(
            cards,
            sideCards,
            zIndex,
        );

        if (possibleMoves.length == 0) {
            moves[moveNames.draw]();

            const { G, ctx } = this.client.getState()!;

            cards = getCurrentPlayerCards(G, ctx);
            const index = cards.length - 1;
            const card = cards[index];

            possibleMoves.push(
                ...this.retrieveAllPossibleMoves([card], sideCards, zIndex),
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

    private retrieveAllPossibleMoves(
        cards: any[],
        sideCards: any[],
        zIndex: number,
    ) {
        const possibleMoves: MoveData[] = [];

        for (const card of cards) {
            for (
                let sideCardIndex = 0;
                sideCardIndex < sideCards.length;
                sideCardIndex++
            ) {
                const sideCard = sideCards[sideCardIndex];
                possibleMoves.push(
                    ...this.retrieveCardPossibleMoves(
                        card,
                        sideCard,
                        sideCardIndex,
                        zIndex,
                    ),
                );
            }
        }

        return possibleMoves;
    }

    private retrieveCardPossibleMoves(
        card: any,
        sideCard: any,
        sideCardIndex: number,
        zIndex: number,
    ): MoveData[] {
        const possibleMoves: MoveData[] = [];

        for (const cell of getSideIndexes(sideCard)) {
            possibleMoves.push(
                ...this.retrieveCardPossibleMoveRotations(
                    cell,
                    zIndex,
                    card,
                    sideCardIndex,
                ),
            );

            possibleMoves.push(
                ...this.retrieveCardPossibleMoveRotations(
                    cell,
                    -zIndex,
                    card,
                    sideCardIndex,
                ),
            );
        }

        return possibleMoves;
    }

    private retrieveCardPossibleMoveRotations(
        cell: any,
        zIndex: any,
        card: any,
        sideCardIndex: number,
    ): MoveData[] {
        if (!this.client) {
            return [];
        }

        const possibleMoves: MoveData[] = [];
        const { G, ctx } = this.client.getState()!;

        for (let rotation = 1; rotation <= 4; rotation++) {
            const simulatedCard = { ...card, rotation };
            const result = Rules.validateMove(
                G,
                ctx,
                cell.position,
                zIndex,
                simulatedCard,
            );

            if (result.success == true) {
                possibleMoves.push({
                    card: simulatedCard,
                    cardId: simulatedCard.id,
                    rotation,
                    zIndex,
                    cellIndex: cell.position,
                    sideCardIndex,
                });
            }
        }

        return possibleMoves;
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
                    Rules.verifyPosition(G, sideIndex) &&
                    Rules.verifySideCards(G, sideIndex) &&
                    Rules.verifyCardConnections(G, sideIndex)
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
