/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-constant-condition */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import { Monster } from './monster';
import { Player } from './player';
import monsterImg from '../assets/smartmonster.png';
import { Point } from '../constants/props';
import { GameMap } from './gameItem';

class SmartMonster extends Monster {
  constructor(id: string, name: string, x: number = 0, y: number = 0) {
    super(id, name, x, y);
  }

  getImg(): string {
    return monsterImg;
  }

  move(map: GameMap, players: Player[], otherMonsters: Monster[]): Monster {
    let newX = this.x;
    let newY = this.y;
    const possibleDirections: Point[] = [];

    const up = { x: this.x, y: this.y - 1 };
    const right = { x: this.x + 1, y: this.y };
    const down = { x: this.x, y: this.y + 1 };
    const left = { x: this.x - 1, y: this.y };

    [up, right, down, left].forEach((dir) => {
      if (this.isValidMove(dir.x, dir.y, map, otherMonsters) && this.isInBounds(dir)) {
        possibleDirections.push(dir);
      }
    });

    if (possibleDirections.length) {
      const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
      newX = randomDirection.x;
      newY = randomDirection.y;
    } else {
      const path = this.findPathToNearestPlayer(players, map);
      if (path.length > 1) {
        newX = path[1].x;
        newY = path[1].y;
      } else {
        return new SmartMonster(this.id, this.name, newX, newY);
      }
    }
    return new SmartMonster(this.id, this.name, newX, newY);
  }

  private findPathToNearestPlayer(players: Player[], map: GameMap): Point[] {
    const closestPlayer = players.reduce((closest, player) => {
      const closestDistance = (closest.getX() - this.x) ** 2 + (closest.getY() - this.y) ** 2;
      const playerDistance = (player.getX() - this.x) ** 2 + (player.getY() - this.y) ** 2;
      return playerDistance < closestDistance ? player : closest;
    });

    return this.aStarSearch(
      map,
      { x: this.x, y: this.y },
      { x: closestPlayer.getX(), y: closestPlayer.getY() }
    );
  }

  private aStarSearch(map: GameMap, start: Point, goal: Point): Point[] {
    let openSet: Point[] = [start];
    const cameFrom: Map<string, Point> = new Map();

    const gScore: Map<string, number> = new Map();
    gScore.set(`${start.x},${start.y}`, 0);

    const fScore: Map<string, number> = new Map();
    fScore.set(`${start.x},${start.y}`, this.heuristic(start, goal));

    while (openSet.length > 0) {
      const current = openSet.reduce((a, b) => {
        const scoreA = fScore.get(`${a.x},${a.y}`) ?? Infinity;
        const scoreB = fScore.get(`${b.x},${b.y}`) ?? Infinity;
        return scoreA < scoreB ? a : b;
      });

      if (current.x === goal.x && current.y === goal.y) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet = openSet.filter((pt) => pt.x !== current.x || pt.y !== current.y);
      for (const neighbor of this.getNeighbors(current, map)) {
        const tentativeGScore = (gScore.get(`${current.x},${current.y}`) ?? Infinity) + 1;
        if (tentativeGScore < (gScore.get(`${neighbor.x},${neighbor.y}`) ?? Infinity)) {
          cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
          gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
          fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + this.heuristic(neighbor, goal));
          if (!openSet.some((pt) => pt.x === neighbor.x && pt.y === neighbor.y)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return [];
  }

  private getNeighbors(point: Point, map: GameMap): Point[] {
    const neighbors: Point[] = [];
    const directions = [
      [0, 1], // Down
      [1, 0], // Right
      [0, -1], // Up
      [-1, 0] // Left
    ];
    directions.forEach(([dx, dy]) => {
      const newX = point.x + dx;
      const newY = point.y + dy;
      if (map[newX][newY] === 'Empty' && this.isInBounds({ x: newX, y: newY })) {
        neighbors.push({ x: newX, y: newY });
      }
    });
    return neighbors;
  }

  private heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private reconstructPath(cameFrom: Map<string, Point>, current: Point): Point[] {
    const path = [];
    while (current) {
      path.unshift(current);
      current = cameFrom.get(`${current.x},${current.y}`) as Point;
    }
    return path;
  }
}

export { SmartMonster };
