import path from 'path';
import serve from 'koa-static';

require('dotenv').config();

const { Server } = require('boardgame.io/server');
const { Game } = require('./src/Game');

const { database } = require('./database');

const server = Server({ games: [Game] });
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './dist');
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT, () => {
  server.app.use(async (ctx, next) => await serve(frontEndAppBuildPath)(Object.assign(ctx, { path: 'index.html' }), next));
});
