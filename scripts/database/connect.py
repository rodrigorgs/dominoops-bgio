import psycopg2

from config import config


class Connect:
    def __init__(self):
        self.connection = None
        self.credentials = None

        try:
            self.credentials = config()

        except (Exception) as error:
            print("Error acquiring credentials. {0}".format(error.args))

    def __del__(self):
        self.close()

    def connect(self):
        try:
            self.connection = psycopg2.connect(**self.credentials)
        except (psycopg2.DatabaseError) as error:
            print("Error connecting to database. {0}".format(error.args))

    def close(self):
        if self.connection != None:
            self.connection.close()

    def query(self, query):
        cur = self.connection.cursor()

        cur.execute(query)
        result = cur.fetchall()
        cur.close()

        return result


if __name__ == "__main__":
    conn = Connect()
    conn.connect()

    print(conn.query('select * from "Games"'))

    conn.close()
