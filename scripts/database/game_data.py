import csv

from pprint import pprint


class GameData:
    def __init__(self, data: object):
        self.match_id: str = data[0]
        self.game_name: str = data[1]

        self.initial_state = data[8]
        self.moves = data[9]

        self.timestamps = (data[10], data[11])

    @property
    def duration(self):
        return self.timestamps[1] - self.timestamps[0]

    def print_summary(self):
        print(f"Match Id: {self.match_id}")
        print(f"Game Name: {self.game_name}")

        # print('Initial State:')
        # pprint(self.initial_state, indent=4, depth=2)

        for i, move in enumerate(self.moves):
            print()
            print(f'    Move {i}: ',)
            pprint(move, indent=8, depth=5)
        else:
            print()

        print(f'Duration: {self.duration}')

        print()
        # input()
