/* eslint-disable @typescript-eslint/no-unused-vars */
import { Monster } from './monster';
import { GameMap, gameItem } from './gameItem';
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
    player = new Player(
      '1',
      'John',
      0,
      0,
      true,
      4,
      2,
      [],
      0,
      'originalImage.png',
      'ghostImage.png',
      'invincibleImage.png'
    );
    otherMonsters = [new Monster('2', 'Other Monster', 0, 0)];
  });

  it('should move to a valid position', () => {
    const monster = new Monster('1', 'Monster', 2, 2);
    const newMonster = monster.move(map, [player], otherMonsters);
    expect(newMonster.getX()).not.toBe(2);
    expect(newMonster.getY()).not.toBe(2);
  });

  it('should not move into walls or boxes', () => {
    const monster = new Monster('1', 'Monster', 1, 1);
    const newMonster = monster.move(map, [player], otherMonsters);
    expect(newMonster.getX()).toBe(1);
    expect(newMonster.getY()).toBe(1);
  });

  it('should not collide with other monsters', () => {
    const monster = new Monster('1', 'Monster', 0, 0);
    const newMonster = monster.move(map, [player], otherMonsters);
    expect(newMonster.getX()).not.toBe(0);
    expect(newMonster.getY()).not.toBe(0);
  });
});
