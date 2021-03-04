import { SocketIO } from "boardgame.io/multiplayer";
import { Client, LobbyClient } from "boardgame.io/client";
import { Game } from "./Game";
import {
  GAME_NAME,
  NUM_CARDS,
  CARD_WIDTH,
  CARD_HEIGHT,
  DECK_N_COLUMNS,
} from "./config";
import { SplashScreen } from "./SplashScreen";
import { Deck } from "./Deck";
import { HandView } from "./HandView";
import createPanZoom from "panzoom";
import { BoardView } from "./BoardView";
import { MessageView } from "./MessageView";

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
console.log(server);

class App {
  constructor(rootElement, playerId, matchId, credentials) {
    this.client = Client({
      game: Game,
      multiplayer: SocketIO({ server }),
      playerID: playerId,
      credentials: credentials,
      matchID: matchId,
    });
    this.client.start();
    this.client.subscribe((state) => this.update(state));

    this.rootElement = rootElement;

    this.deck = new Deck(
      document.getElementById("deck"),
      NUM_CARDS,
      CARD_WIDTH,
      CARD_HEIGHT,
      DECK_N_COLUMNS,
    );
    this.boardView = new BoardView(
      document.getElementById("app"),
      this.client,
      this.deck,
    );
    this.handView = new HandView(
      document.getElementById("hand"),
      this.client,
      this.deck,
      this.boardView.onCardSelect.bind(this.boardView),
    );
    this.messageView = new MessageView(
      document.getElementById("msg"),
      this.client,
    );
  }

  restart(playerId, matchId, credentials) {
    this.client.updateMatchID(matchId);
    this.client.updateCredentials(credentials);
    this.client.reset();
  }

  update(state) {
    if (state === null) return;

    this.messageView.appView = this;

    this.messageView.update(state);
    this.boardView.update(state);
    this.handView.update(state);
  }
}

///////////////////////////////

const appElement = document.getElementById("app");
SplashScreen(appElement).then(async (choice) => {
  let playerId, matchId, credentials;
  const lobbyClient = new LobbyClient({ server: server });

  if (choice.op == "create") {
    playerId = "0";
    console.log("numPlayers", choice.numPlayers);
    const res = await lobbyClient.createMatch(GAME_NAME, {
      numPlayers: choice.numPlayers,
    });
    console.log("res", res);
    matchId = res.matchID;
    console.log(matchId);
    const res2 = await lobbyClient.joinMatch(GAME_NAME, matchId, {
      playerID: playerId,
      playerName: playerId,
    });
    console.log("res2", res2);
    credentials = res2.playerCredentials;
  } else if (choice.op == "join") {
    matchId = choice.room;
    let match = await lobbyClient.getMatch(GAME_NAME, matchId);
    console.log("players", match.players);
    playerId = match.players
      .find((player) => player.isConnected === undefined)
      .id.toString();
    console.log("playerId", playerId);
    const res2 = await lobbyClient.joinMatch(GAME_NAME, matchId, {
      playerID: playerId,
      playerName: playerId,
    });
    credentials = res2.playerCredentials;
  } else {
    console.error("Invalid choice");
  }

  if (choice.op == "create" || choice.op == "join") {
    new App(appElement, playerId, matchId, credentials);
  }
});
