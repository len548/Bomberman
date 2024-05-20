/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import { Monster } from './monster';
import monsterImg from '../assets/ghostmonster.png';
import { Point } from '../constants/props';
import { GameMap, isBomb } from './gameItem';

/* eslint-disable no-plusplus */
class GhostMonster extends Monster {
  getImg(): string {
    return monsterImg;
  }

  move(map: GameMap): Monster {
    let newX = this.x;
    let newY = this.y;
    const possibleDirections: Point[] = [];
    const up = { x: this.x, y: this.y - 1 };
    const right = { x: this.x + 1, y: this.y };
    const down = { x: this.x, y: this.y + 1 };
    const left = { x: this.x - 1, y: this.y };

    [up, right, down, left].forEach((dir) => {
      if (this.isValidMove(dir.x, dir.y, map) && this.isInBounds(dir)) {
        possibleDirections.push(dir);
      }
    });

    if (possibleDirections.length > 0) {
      const selectedDirection = possibleDirections[Math.floor(
        Math.random() * possibleDirections.length
      )];
      newX = selectedDirection.x;
      newY = selectedDirection.y;
    }
    return new GhostMonster(this.id, this.name, newX, newY);
  }

  protected isValidMove(
    y: number,
    x: number,
    map: GameMap
  ): boolean {
    return (!(isBomb(map[y][x])) && map[y][x] !== 'Wall');
  }
}

export { GhostMonster };
