/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-cycle

import {
  GameMap, Power, isBomb, isObstacle, isPower
} from './gameItem';

class Player {
  private id: string;

  private name: string;

  private x: number;

  private y: number;

  private isActive: boolean;// New attribute to track if the player is still active

  private bombs: number;

  private bombRange: number;

  private powerUps: Power[];

  private obstacles: number;

  constructor(
    id: string,
    name: string,
    x: number,
    y: number,
    isActive: boolean = true,
    bombs: number = 4,
    bombRange: number = 2,
    powerUps: Power[] = [],
    obstacles: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.isActive = isActive;
    this.bombs = bombs;
    this.bombRange = bombRange;
    this.powerUps = powerUps;
    this.obstacles = obstacles;
  }

  static fromPlayer(player: Player): Player {
    return new Player(
      player.id,
      player.name,
      player.x,
      player.y,
      player.isActive,
      player.bombs,
      player.bombRange,
      player.powerUps,
      player.obstacles
    );
  }

  move(
    direction: string,
    map: GameMap,
    otherPlayers: Player[],
    setMap: (m: GameMap) => void
  ): Player {
    let newX = this.x;
    let newY = this.y;

    switch (direction) {
      case 'up':
        newY -= this.y > 0 && this.isValidMove(newY - 1, this.x, map) ? 1 : 0;
        break;
      case 'down':
        newY += this.y < map.length - 1 && this.isValidMove(newY + 1, this.x, map) ? 1 : 0;
        break;
      case 'left':
        newX -= this.x > 0 && this.isValidMove(this.y, newX - 1, map) ? 1 : 0;
        break;
      case 'right':
        newX += (
          this.x < map[0].length - 1 && this.isValidMove(this.y, newX + 1, map)
        ) ? 1 : 0;
        break;
      default:
        break;
    }

    const collidesWithPlayer = otherPlayers.some((p) => p.getX() === newX && p.getY() === newY);

    if (!collidesWithPlayer) {
      this.x = newX;
      this.y = newY;
      this.checkCollisionWithPowerUp(map, setMap);
    }

    return this;
  }

  addPowerUp(powerUp: Power): void {
    switch (powerUp) {
      case 'AddBomb':
        this.bombs += 1;
        break;
      case 'BlastRangeUp':
        this.bombRange += 1;
        break;
      case 'RollerSkate':
        if (!this.powerUps.includes('RollerSkate')) {
          this.powerUps.push(powerUp);
        }
        break;
      case 'Invincibility':
        this.powerUps.push(powerUp);
        // TODO: Implement invincibility for a short time
        break;
      case 'Ghost':
        this.powerUps.push(powerUp);
        // TODO: Implement ghost mode for a short time
        break;
      case 'Obstacle':
        this.obstacles += 3;
        this.powerUps.push(powerUp);
        break;
      default:
        this.powerUps.push(powerUp);
        break;
    }
    console.log(`${this.name} has picked up a ${powerUp} power-up.`);
  }

  checkCollisionWithPowerUp(map: GameMap, setMap: (m: GameMap) => void): void {
    const cell = map[this.y][this.x];
    if (isPower(cell)) {
      this.addPowerUp(cell as Power);
      const newMap = [...map];
      newMap[this.y][this.x] = 'Empty';
      setMap(newMap);
    }
  }

  // eslint-disable-next-line no-unused-vars
  isValidMove(y: number, x: number, map: GameMap): boolean {
    if (this.isGhost()) return !isObstacle(map[y][x]);
    return map[y][x] !== 'Wall' && map[y][x] !== 'Box' && !isObstacle(map[y][x]) && !isBomb(map[y][x]) && (map[y][x] === 'Empty' || isPower(map[y][x]));
  }

  killPlayer(): void {
    console.log(`${this.name} has been killed.`);
    this.isActive = false;
  }

  resetPosition(startX: number, startY: number): void {
    this.x = startX;
    this.y = startY;
    this.isActive = true;
  }

  decrementBombs(): void {
    this.bombs -= 1;
  }

  removePowerUp(powerUp: Power): void {
    const index = this.powerUps.indexOf(powerUp);
    if (index > -1) {
      this.powerUps.splice(index, 1);
      console.log(`${this.name} has lost the ${powerUp} power-up.`);
      console.log(`player ${this.id} power-ups: ${this.powerUps}`);
    }
  }

  isDetonator(): boolean {
    return this.powerUps.includes('Detonator');
  }

  isInvincible(): boolean {
    return this.powerUps.includes('Invincibility');
  }

  isGhost(): boolean {
    return this.powerUps.includes('Ghost');
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

  getBombs(): number {
    return this.bombs;
  }

  getBombRange(): number {
    return this.bombRange;
  }

  getPowerUps(): Power[] {
    return this.powerUps;
  }

  getObstacles(): number {
    return this.obstacles;
  }

  isAlive(): boolean {
    return this.isActive;
  }
}

export { Player };
