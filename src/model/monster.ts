/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import { GameMap } from './gameItem';

import { Player } from './player';
import monsterImg from '../assets/monster.png';
import { Point } from '../constants/props';
/* eslint-disable no-plusplus */
class Monster {
  id: string;

  name: string;

  x: number;

  y: number;

  constructor(id: string, name: string, x: number = 0, y: number = 0) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getImg(): string {
    return monsterImg;
  }

  move(map: GameMap, players: Player[], otherMonsters: Monster[]): Monster {
    let newX = this.x;
    let newY = this.y;
    const possibleDirections: Point[] = [];
    const up: Point = { x: this.x, y: this.y - 1 };
    const right: Point = { x: this.x + 1, y: this.y };
    const down: Point = { x: this.x, y: this.y + 1 };
    const left: Point = { x: this.x - 1, y: this.y };

    [up, right, down, left].forEach((dir) => {
      if (this.isValidMove(dir.x, dir.y, map, otherMonsters) && this.isInBounds(dir)) {
        possibleDirections.push(dir);
      }
    });

    if (possibleDirections.length > 0) {
      const index = Math.floor(Math.random() * possibleDirections.length);
      const selectedDirection = possibleDirections[index];
      newX = selectedDirection.x;
      newY = selectedDirection.y;
    }

    return new Monster(this.id, this.name, newX, newY);
  }

  isInBounds(point: Point): boolean {
    return point.x >= 1 && point.x < 14 && point.y >= 1 && point.y < 9;
  }

  isValidMove(
    x: number,
    y: number,
    map: GameMap,
    otherMonsters: Monster[]
  ): boolean {
    const isCellFree = map[y][x] === 'Empty';
    const isMonsterCollision = otherMonsters.some((monster) => monster.getX() === x && monster.getY() === y);
    return isCellFree && !isMonsterCollision;
  }
}

export { Monster };
