import { Simulator } from './simulator';
import { FreeEdgePlayer, RandomPlayer } from './player';

import { parse } from 'ts-command-line-args';
import crypto from 'crypto';

interface ISimulatorArguments {
    players?: number;
    matches?: number;
}

const args = parse<ISimulatorArguments>({
    players: {
        type: Number,
        optional: true,
        defaultValue: 5,
    },
    matches: {
        type: Number,
        optional: true,
        defaultValue: 1,
    },
});

const simulators = [];

let seed;
let players;
let simulator;

for (let index = 0; index < args.matches!; index++) {
    seed = crypto.randomBytes(16).toString('hex');
    players = [];

    for (let playerIndex = 0; playerIndex < args.players!; playerIndex++) {
        const player = new RandomPlayer(playerIndex.toString());
        players.push(player);
    }

    simulator = new Simulator(players, seed);
    simulators.push(simulator);
    simulator.run();

    players = [];

    for (let playerIndex = 0; playerIndex < args.players!; playerIndex++) {
        const player = new FreeEdgePlayer(playerIndex.toString());
        players.push(player);
    }

    simulator = new Simulator(players, seed);
    simulators.push(simulator);
    simulator.run();
}
