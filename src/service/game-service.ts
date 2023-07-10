import { Game } from '../model/game.js';
import { GameState, Player } from '../types/game-types.js';
import { LoginPayload } from '../types/message-types.js';

export class GameService {
  private _players = new Map<Player['id'], Player>();
  private _games = new Map<Game['id'], Game>();

  // ----------------------------------------------------------------
  // Public Methods
  // ----------------------------------------------------------------
  public login(playerId: Player['id'], loginPayload: LoginPayload) {
    let player = this.findPlayerByName(loginPayload.name);
    if (player) {
      this._players.delete(player.id);
      player.id = playerId;
    } else {
      player = { id: playerId, ...loginPayload, wins: 0 };
    }
    this._players.set(playerId, player);
    return player;
  }

  // ----------------------------------------------------------------
  public logout(playerId: Player['id']) {
    return playerId;
  }

  // ----------------------------------------------------------------
  public getPlayerById(playerId: Player['id']) {
    return this._players.get(playerId);
  }

  // ----------------------------------------------------------------
  public setWinner(playerId: Player['id']) {
    const player = this._players.get(playerId);
    if (!player) return;
    player.wins += 1;
  }

  // ----------------------------------------------------------------
  public getWinners() {
    return Array.from(this._players.values()).sort((a, b) => a.wins - b.wins);
  }

  // ----------------------------------------------------------------
  public getOpenedRooms() {
    const games: Game[] = [];
    this._games.forEach((game) => {
      if (game.state === GameState.RoomOpened) {
        games.push(game);
      }
    });
    return games;
  }

  // ----------------------------------------------------------------
  public getGames() {
    return this._games.values();
  }

  // ----------------------------------------------------------------
  public getGame(gameId: Game['id']) {
    return this._games.get(gameId);
  }

  // ----------------------------------------------------------------
  public createGame(playerId: Player['id']) {
    if (!this._players.get(playerId)) {
      return null;
    }
    for (const game of this._games.values()) {
      if (game.validPlayer(playerId)) return null;
    }
    const game = new Game(playerId);
    this._games.set(game.id, game);
    return game;
  }

  // ----------------------------------------------------------------
  public closeGame(gameId: Game['id']) {
    this._games.delete(gameId);
  }

  // ----------------------------------------------------------------
  // Private Methods
  // ----------------------------------------------------------------
  private findPlayerByName(name: string) {
    return Array.from(this._players.values()).find((player) => player.name === name);
  }
}
