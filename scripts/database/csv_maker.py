import os
import csv

from game_data import GameData

FOLDER_NAME = 'csv'

FIELD_NAMES = [
    'player_id',
    'event_name',
    'move_name',
    'card_id',
    'card_zindex',
    'card_rotation',
    'x_position',
    'y_position']


class CSVMaker:

    def __init__(self):
        ...

    def get_csv_path(self, file_name=''):
        return os.path.join(os.getcwd(), __file__.rsplit('/', 1)[0], FOLDER_NAME, file_name)

    def generate_csv(self, game_data: GameData):
        file_name = f'{game_data.match_id}.csv'
        file_path = self.get_csv_path(file_name)

        with open(file_path, 'w') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

            csv_writer.writerow(FIELD_NAMES)

            for move in game_data.moves:
                data = [
                    move['action']['payload']['playerID'] if ('playerID' in move['action']['payload']) else '-1',
                    move['action']['type'],
                    move['action']['payload']['type'] if (move['action']['type'] == 'MAKE_MOVE') else '',
                    move['action']['payload']['args'][2]['id'] if (
                        move['action']['payload']['type'] == 'clickCell') else '',
                    move['action']['payload']['args'][2]['zIndex'] if (
                        move['action']['payload']['type'] == 'clickCell') else '',
                    move['action']['payload']['args'][2]['rotation'] if (
                        move['action']['payload']['type'] == 'clickCell') else '',
                    move['action']['payload']['args'][0] if (
                        move['action']['payload']['type'] == 'clickCell') else '',
                    move['action']['payload']['args'][1] if (
                        move['action']['payload']['type'] == 'clickCell') else ''
                ]

                csv_writer.writerow(data)
