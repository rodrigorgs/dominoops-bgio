import os

from configparser import ConfigParser


def config(filename='database.ini', section='postgresql'):
    parser = ConfigParser()

    filepath = os.path.join(os.getcwd(), __file__.rsplit('/', 1)[0], filename)

    files_read = parser.read(filepath)

    db_credentials = {}

    if (parser.has_section(section)):
        params = parser.items(section)

        for param in params:
            db_credentials[param[0]] = param[1]
    else:
        raise Exception(
            'Section {0} not found in the {1} file'.format(section, filename))

    return db_credentials
