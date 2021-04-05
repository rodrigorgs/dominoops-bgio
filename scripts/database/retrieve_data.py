from connect import Connect

if __name__ == "__main__":
    connection = Connect()

    connection.connect()

    data = connection.query('SELECT * FROM "Games"')

    for piece in data[0]:
        print(piece)
        print()
