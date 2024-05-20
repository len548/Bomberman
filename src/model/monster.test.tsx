/* eslint-disable max-len */
import { Monster } from './monster';
import { GameMap } from './gameItem';
import { Player } from './player';

describe('Monster', () => {
  let map: GameMap;
  let player: Player;
  let otherMonsters: Monster[];

  beforeEach(() => {
    map = [
      ['Empty', 'Empty', 'Empty', 'Empty'],
      ['Empty', 'Wall', 'Box', 'Empty'],
      ['Empty', 'Empty', 'Empty', 'Empty'],
      ['Empty', 'Empty', 'Empty', 'Empty']
    ];
    player = new Player('1', 'Player One', 2, 2, true, 4, 2, [], 0, 'original.png', 'ghost.png', 'invincible.png');
    otherMonsters = [new Monster('2', 'Other Monster', 0, 0)];
  });

  it('should move to a valid position', () => {
    const monster = new Monster('1', 'Monster', 2, 2);
    const newMonster = monster.move(map, [player], otherMonsters);
    const moved = newMonster.getX() !== 2 || newMonster.getY() !== 2;
    expect(moved).toBe(true);
    expect(map[newMonster.getY()][newMonster.getX()]).toBe('Empty');
  });

  it('should not move into walls or boxes', () => {
    map = [
      ['Empty', 'Wall', 'Empty'],
      ['Empty', 'Wall', 'Box'],
      ['Empty', 'Wall', 'Empty']
    ];
    const monster = new Monster('1', 'Monster', 1, 1);
    const newMonster = monster.move(map, [player], otherMonsters);
    expect(newMonster.getX()).toBe(1);
    expect(newMonster.getY()).toBe(1);
  });

  it('should not collide with other monsters', () => {
    const monster = new Monster('1', 'Monster', 0, 1);
    otherMonsters = [new Monster('2', 'Other Monster', 0, 0)];
    const newMonster = monster.move(map, [player], otherMonsters);
    const collided = newMonster.getX() === 0 && newMonster.getY() === 0;
    expect(collided).toBe(false);
  });

  it('should stay in bounds', () => {
    const monster = new Monster('1', 'Monster', 2, 2);
    const newMonster = monster.move(map, [player], otherMonsters);
    const inBounds = newMonster.getX() >= 0 && newMonster.getX() < map[0].length && newMonster.getY() >= 0 && newMonster.getY() < map.length;
    expect(inBounds).toBe(true);
  });

  it('should not move if surrounded by obstacles', () => {
    map = [
      ['Empty', 'Wall', 'Empty'],
      ['Wall', 'Empty', 'Wall'],
      ['Empty', 'Wall', 'Empty']
    ];
    const monster = new Monster('1', 'Monster', 1, 1);
    const newMonster = monster.move(map, [player], otherMonsters);
    expect(newMonster.getX()).toBe(1);
    expect(newMonster.getY()).toBe(1);
  });

  it('should prefer moving towards player if possible', () => {
    const monster = new Monster('1', 'Monster', 1, 1);
    player = new Player('1', 'Player One', 1, 2, true, 4, 2, [], 0, 'original.png', 'ghost.png', 'invincible.png');
    const newMonster = monster.move(map, [player], otherMonsters);
    const towardsPlayer = newMonster.getX() === 1 && newMonster.getY() === 2;
    expect(towardsPlayer).toBe(true);
  });
});
