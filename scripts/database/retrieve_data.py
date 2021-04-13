from connect import Connect
from game_data import GameData

if __name__ == "__main__":
    connection = Connect()

    connection.connect()

    data = connection.query('SELECT * FROM "Games"')
    # data = connection.query("SELECT * FROM pg_tables")

    for d in data:
        g_data = GameData(d)
        g_data.print_summary()
