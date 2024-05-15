import { GameMap } from './gameItem';
import { Player } from './player';

describe('Player', () => {
  let player: Player;
  let map: GameMap;
  let otherPlayers: Player[];
  let setMap: jest.Mock;

  const addPowerUp = jest.fn();
  const removePowerUp = jest.fn();
  const isPowerUpActive = jest.fn();

  beforeEach(() => {
    // Initialize map with empty spaces
    map = Array.from({ length: 10 }, () => Array(10).fill('Empty'));

    // Mock function for setting the map
    setMap = jest.fn();

    // Other players in the game
    otherPlayers = [new Player('2', 'Player Two', 5, 5)];

    // Create a player with initial position (1,1)
    player = new Player('1', 'Player One', 1, 1);
  });

  it('should move up correctly', () => {
    player.move('up', map, otherPlayers, setMap, addPowerUp, removePowerUp, isPowerUpActive);
    expect(player.getY()).toBe(0); // Expect the player to have moved up
  });

  it('should move down correctly', () => {
    player.move('down', map, otherPlayers, setMap, addPowerUp, removePowerUp, isPowerUpActive);
    expect(player.getY()).toBe(2); // Expect the player to have moved down
  });

  it('should not move into a wall', () => {
    map[2][1] = 'Wall';
    player.move('down', map, otherPlayers, setMap, addPowerUp, removePowerUp, isPowerUpActive);
    expect(player.getY()).toBe(1); // Y should not change because there's a wall
  });

  it('should not move into a bomb', () => {
    map[2][1] = { range: 2, coords: { x: 2, y: 1 }, ownerId: '3' };
    player.move('down', map, otherPlayers, setMap, addPowerUp, removePowerUp, isPowerUpActive);
    expect(player.getY()).toBe(1); // Y should not change because there's a bomb
  });

  it('should not collide with another player', () => {
    player = new Player('1', 'Player One', 4, 5);
    player.move('right', map, otherPlayers, setMap, addPowerUp, removePowerUp, isPowerUpActive);
    expect(player.getX()).toBe(4); // X should not change because another player is at (5, 5)
  });

  it('can move freely in open space', () => {
    player = new Player('1', 'Player One', 3, 3);
    player.move('right', map, otherPlayers, setMap, addPowerUp, removePowerUp, isPowerUpActive);
    expect(player.getX()).toBe(4); // X should change to 4
  });
});
