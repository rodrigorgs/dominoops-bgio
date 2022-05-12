import { Simulator } from './simulator';
import { FreeEdgePlayer, RandomPlayer } from './player';

import { parse } from 'ts-command-line-args';

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

for (let index = 0; index < args.matches!; index++) {
    const players = [];

    for (let playerIndex = 0; playerIndex < args.players!; playerIndex++) {
        const player = new FreeEdgePlayer(playerIndex.toString());
        players.push(player);
    }

    const simulator = new Simulator(players);

    simulators.push(simulator);
    simulator.run();
}
