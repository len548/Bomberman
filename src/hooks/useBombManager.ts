/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import { useCallback } from 'react';
import { Player } from '../model/player';
import {
  Bomb, GameMap, isObstacle, isBomb, randomPowerUpGenerator
} from '../model/gameItem';

export const useBombManager = (
  playerID: number,
  playersRef: React.MutableRefObject<Player[]>,
  setPlayers: ((player: Player) => void)[],
  mapRef: React.MutableRefObject<GameMap>,
  setMap: (m: GameMap) => void,
  setExplosions: (explosions: { x: number, y: number }[]) => void,
  setDestroyedBoxes: (destroyedBoxes: { x: number, y: number }[]) => void
) => {
  const bombExplosionCheck = useCallback((
    bomb: Bomb,
    positionsToCheck: { newY: number; newX: number }[],
    currentMap: GameMap
  ): void => {
    const { x, y } = bomb.coords;
    const blastRange = bomb.range;
    const map = currentMap;
    const mapHeight = map.length;
    const mapWidth = map[0].length;
    // Include the bomb's own location
    positionsToCheck.push({ newY: y, newX: x });

    // Vertical - up and down from the bomb
    for (let dy = -1; dy >= -blastRange; dy -= 1) {
      const tempY = y + dy;
      if (tempY >= 0 && tempY < mapHeight) {
        if (!positionsToCheck.some((pos) => pos.newY === tempY && pos.newX === x)) {
          positionsToCheck.push({ newY: tempY, newX: x });
        }
        if (map[tempY][x] === 'Wall' || map[tempY][x] === 'Box' || isObstacle(map[tempY][x])) break;
      } else break;
    }
    for (let dy = 1; dy <= blastRange; dy += 1) {
      const tempY = y + dy;
      if (tempY >= 0 && tempY < mapHeight) {
        if (!positionsToCheck.some((pos) => pos.newY === tempY && pos.newX === x)) {
          positionsToCheck.push({ newY: tempY, newX: x });
        }
        if (map[tempY][x] === 'Wall' || map[tempY][x] === 'Box' || isObstacle(map[tempY][x])) break;
      } else break;
    }

    // Horizontal - left and right from the bomb
    for (let dx = -1; dx >= -blastRange; dx -= 1) {
      const tempX = x + dx;
      if (tempX >= 0 && tempX < mapWidth) {
        if (!positionsToCheck.some((pos) => pos.newY === y && pos.newX === tempX)) {
          positionsToCheck.push({ newY: y, newX: tempX });
        }
        if (map[y][tempX] === 'Wall' || map[y][tempX] === 'Box' || isObstacle(map[y][tempX])) break;
      } else break;
    }

    for (let dx = 1; dx <= blastRange; dx += 1) {
      const tempX = x + dx;
      if (tempX >= 0 && tempX < mapWidth) {
        if (!positionsToCheck.some((pos) => pos.newY === y && pos.newX === tempX)) {
          positionsToCheck.push({ newY: y, newX: tempX });
        }
        if (map[y][tempX] === 'Wall' || map[y][tempX] === 'Box' || isObstacle(map[y][tempX])) break;
      } else break;
    }
  }, [mapRef, setMap, playersRef, setPlayers]);

  const explodeBombs = useCallback((bombs: Bomb[]): void => {
    const positionsToCheck: { newY: number; newX: number; }[] = [];
    const map = mapRef.current;
    const newMap: GameMap = map.map((row) => [...row]);

    bombs.forEach((bomb) => {
      bombExplosionCheck(bomb, positionsToCheck, map);
      newMap[bomb.coords.y][bomb.coords.x] = 'Empty'; // Remove the bomb from the map
      const owner = playersRef.current.find((player) => player.getId() === bomb.ownerId);
      if (owner) {
        owner.decrementActiveBombs(); // Decrement active bombs for the owner
        setPlayers[playersRef.current.indexOf(owner)](Player.fromPlayer(owner));
      }
    });

    // eslint-disable-next-line max-len
    const explosionPositions: { x: number, y: number }[] = positionsToCheck.map(({ newX, newY }) => ({ x: newX, y: newY }));

    // Display explosion image
    setExplosions(explosionPositions);

    const newDestroyedBoxes: { x: number, y: number }[] = [];

    positionsToCheck.forEach(({ newY, newX }) => {
      const affectedItem = map[newY][newX];

      // TODO: Trigger other bombs
      // if (typeof affectedItem !== 'string' && 'range' in affectedItem) {
      //   explodeBomb(newY, newX, affectedItem);
      // }

      // Destroy boxes and potentially drop power-ups
      if (affectedItem === 'Box') {
        newDestroyedBoxes.push({ x: newX, y: newY });
        newMap[newY][newX] = 'Empty'; // Initially set to empty, will be shown as destroyed first
        setTimeout(() => {
          // eslint-disable-next-line max-len
          newMap[newY][newX] = randomPowerUpGenerator(); // Replace with a power-up or empty after delay
          setMap([...newMap]);
        }, 500); // Delay to show the destroyed box image
      }

      playersRef.current.forEach((player, index) => {
        if (player.getX() === newX && player.getY() === newY && player.isAlive()) {
          if (player.isInvincible()) return; // Skip invincible players
          player.killPlayer();
          setPlayers[index](Player.fromPlayer(player));
        }
      });
    });

    // Trigger chain reaction for other bombs in the explosion range
    const triggeredBombs = positionsToCheck
      .map(({ newX, newY }) => map[newY][newX])
      .filter(isBomb) as Bomb[];
    if (triggeredBombs.length > 0) {
      setTimeout(() => explodeBombs(triggeredBombs), 0);
    }

    setDestroyedBoxes(newDestroyedBoxes);

    setTimeout(() => {
      setExplosions([]); // Clear explosions after a short duration
      setDestroyedBoxes([]);
    }, 500); // Explosion image duration in milliseconds

    // Update the map with changes
    setMap(newMap);
  }, [mapRef, setMap, playersRef, setPlayers, setExplosions]);

  const dropBomb = useCallback((y: number, x: number): void => {
    const player = playersRef.current[playerID];
    const map = mapRef.current;

    if (player.getBombs() <= 0) {
      if (!player.isDetonator()) return;
      console.log('Detonator power activated!');
      // Handling detonator power
      const bombs: Bomb[] = [];
      map.forEach((row) => {
        row.forEach((cell) => {
          if (isBomb(cell) && cell.ownerId === player.getId()) {
            bombs.push(cell);
          }
        });
      });
      explodeBombs(bombs);
      player.removePowerUp('Detonator');
      setPlayers[playerID](Player.fromPlayer(player));
      return;
    }

    if (!player.canPlaceBomb()) return; // Ensure the player can place a bomb

    if (map[y][x] !== 'Empty') return; // Ensure the cell is empty before placing a bomb

    player.incrementActiveBombs();
    const bomb: Bomb = {
      ownerId: player.getId(),
      coords: { x, y },
      range: player.getBombRange(), // Assuming getBombRange is a method of Player
    };
    // Place the bomb in the map
    const newMap = map.map((row) => [...row]);
    newMap[y][x] = bomb;
    setMap(newMap);

    setPlayers[playerID](Player.fromPlayer(player));

    // Set a timer for the bomb to explode
    if (player.isDetonator()) return; // Skip if the player has Detonator power
    setTimeout(() => {
      explodeBombs([bomb]);
    }, 3000); // Explodes after 3 seconds
  }, [mapRef, setMap, playersRef, explodeBombs]);

  return { dropBomb };
};
