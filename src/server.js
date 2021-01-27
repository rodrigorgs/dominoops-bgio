const { Server } = require('boardgame.io/server');
const { Game } = require('./Game');

const server = Server({ games: [Game] });

server.run(process.env.PORT || 8000);
