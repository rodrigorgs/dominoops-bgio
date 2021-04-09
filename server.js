import path from 'path';
import serve from 'koa-static';

require('dotenv').config();

const { Server, FlatFile } = require('boardgame.io/server');
const { Game } = require('./src/Game');
const { connectToDatabase } = require('./database');

const PORT = process.env.PORT || 8000;

connectToDatabase().then((database) => {
  if (database !== undefined) {
    console.log('Connected to database');
  }
  const server = Server({ games: [Game], db: database });
  
  // Build path relative to the server.js file
  const frontEndAppBuildPath = path.resolve(__dirname, './dist');
  server.app.use(serve(frontEndAppBuildPath));
  
  server.run(PORT, () => {
    server.app.use(async (ctx, next) => await serve(frontEndAppBuildPath)(Object.assign(ctx, { path: 'index.html' }), next));
  });
});
