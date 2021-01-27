const { Server } = require('boardgame.io/server');
const { Game } = require('./Game');

const server = Server({ games: [Game] });

server.run(8000);
