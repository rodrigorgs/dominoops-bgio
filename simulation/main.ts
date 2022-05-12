import { Simulator } from './simulator';
import { RandomPlayer } from './player';

const simulators = [];

for (let index = 0; index < 1; index++) {
    const simulator = new Simulator([
        new RandomPlayer('0'),
        new RandomPlayer('1'),
        new RandomPlayer('2'),
    ]);

    simulators.push(simulator);
}

for (const simulator of simulators) {
    simulator.run();
}
