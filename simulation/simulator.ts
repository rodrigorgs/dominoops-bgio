import { Client } from 'boardgame.io/client';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Local } from 'boardgame.io/multiplayer';

import crypto from 'crypto';

import { Persistence } from './persistance';
import { Player } from './player';

const { Game } = require('../src/Game');

export class Simulator {
    seed: string;
    matchKey: string;

    players: Player[] = [];
    clients: _ClientImpl[] = [];

    turn: number = 0;
    sideCards: number[] = [];

    constructor(
        players: Player[] = [],
        seed: string = crypto.randomBytes(16).toString('hex'),
        matchKey: string = crypto.randomBytes(16).toString('hex'),
    ) {
        this.players = players;
        this.seed = seed;
        this.matchKey = matchKey;

        this.setup();
    }

    setup(): void {
        this.createClients();
        this.fillSideCards();
    }

    async run(): Promise<void> {
        Persistence.saveMatchData(this.matchKey, { seed: this.seed });

        let currentPlayer: Player = this.getCurrentPlayer();
        let gameResult = currentPlayer.gameFinished();

        while (!gameResult.finished) {
            this.sideCards = currentPlayer.play(this.turn, this.sideCards);
            this.startNextTurn();

            gameResult = currentPlayer.gameFinished();
            currentPlayer = this.getCurrentPlayer();
        }

        Persistence.saveResultData(
            this.matchKey,
            gameResult.winner,
            gameResult.draw,
        );

        // this.print();
        // Persistence.printCsv(this.matchKey);
        // Persistence.print(this.matchKey);
        // console.log(gameResult.message);
    }

    print(): void {
        console.log(`Match ${this.matchKey} finished.`);
    }

    private createClients(): void {
        const spec = {
            game: {
                seed: this.seed,
                ...Game,
            },
            numPlayers: this.players.length,
            multiplayer: Local(),
        };

        for (const playerIndex in this.players) {
            const player = this.players[playerIndex];
            const client = Client({ ...spec, playerID: playerIndex });

            client.start();
            player.setClient(client);
            player.setMatchKey(this.matchKey);

            this.clients.push(client);
        }
    }

    private fillSideCards(): void {
        const client = this.clients[0];

        const { G } = client.getState()!;
        const { cells } = G!;

        for (let index = 0; index < cells.length; index++) {
            if (cells[index]) {
                this.sideCards.push(index);
                this.sideCards.push(index);
                break;
            }
        }
    }

    private getCurrentPlayer(): Player {
        return this.players[this.turn % this.players.length];
    }

    private startNextTurn(): void {
        this.turn++;
    }
}
