/* eslint-disable no-unused-vars */
import { useCallback } from 'react';
import { Player } from '../model/player';
import { GameMap, Power } from '../model/gameItem';

type PlayerInfo = {
  player: Player,
  setNewPlayer: (player: Player) => void,
  dropBomb: (y: number, x: number) => void,
  keyBindings: string[],
  enemies: Player[]
};

export const usePlayerActions = (
  playersInfo: Array<PlayerInfo | null>,
  mapRef: React.MutableRefObject<GameMap>,
  setMap: (m: GameMap) => void,
  addPowerUp: (powerUp: Power, duration: number) => void,
  removePowerUp: (powerUp: Power) => void,
  isPowerUpActive: (powerUp: Power) => boolean
) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const map = mapRef.current;
    playersInfo.forEach((info) => {
      if (info && info.player.isAlive()) {
        const actions = {
          [info.keyBindings[0]]: () => info.player.move('up', map, info.enemies, setMap, addPowerUp, removePowerUp, isPowerUpActive),
          [info.keyBindings[1]]: () => info.player.move('left', map, info.enemies, setMap, addPowerUp, removePowerUp, isPowerUpActive),
          [info.keyBindings[2]]: () => info.player.move('down', map, info.enemies, setMap, addPowerUp, removePowerUp, isPowerUpActive),
          [info.keyBindings[3]]: () => info.player.move('right', map, info.enemies, setMap, addPowerUp, removePowerUp, isPowerUpActive),
          [info.keyBindings[4]]: () => {
            info.dropBomb(info.player.getY(), info.player.getX());
            return info.player;
          },
        };

        const action = actions[event.key];
        if (action) {
          requestAnimationFrame(() => {
            const updatedPlayer = action();
            if (updatedPlayer) {
              info.setNewPlayer(Player.fromPlayer(updatedPlayer));
            }
          });
        }
      }
    });
  }, [playersInfo, mapRef, setMap, addPowerUp, removePowerUp, isPowerUpActive]);

  return handleKeyDown;
};
