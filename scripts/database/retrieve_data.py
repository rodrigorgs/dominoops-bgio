from connect import Connect
from game_data import GameData
from csv_maker import CSVMaker

if __name__ == "__main__":
    connection = Connect()

    connection.connect()

    data = connection.query('SELECT * FROM "Games" ORDER BY id DESC LIMIT 5')
    # data = connection.query('SELECT * FROM "Games" WHERE id= \'22P7Erfe2Li\' LIMIT 1')

    csv_maker: CSVMaker = CSVMaker()

    for d in data:
        g_data = GameData(d)
        g_data.print_summary()

        csv_maker.generate_csv(g_data)
