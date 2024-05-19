/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { Power } from '../model/gameItem';
import { Player } from '../model/player';

const usePowerUpManager = () => {
  const [activePowerUps, setActivePowerUps] = useState<Record<string, Set<Power>>>({});
  const [flashingPowerUps, setFlashingPowerUps] = useState<Record<string, Set<Power>>>({});

  const addPowerUp = useCallback((playerId: string, powerUp: Power, duration: number) => {
    setActivePowerUps((prev) => ({
      ...prev,
      [playerId]: new Set([...(prev[playerId] || []), powerUp]),
    }));

    const timeout = setTimeout(() => {
      setFlashingPowerUps((prev) => ({
        ...prev,
        [playerId]: new Set([...(prev[playerId] || []), powerUp]),
      }));

      const expireTimeout = setTimeout(() => {
        setActivePowerUps((prev) => {
          const newSet = new Set(prev[playerId]);
          newSet.delete(powerUp);
          return { ...prev, [playerId]: newSet };
        });

        setFlashingPowerUps((prev) => {
          const newSet = new Set(prev[playerId]);
          newSet.delete(powerUp);
          return { ...prev, [playerId]: newSet };
        });
      }, 3000);

      return () => clearTimeout(expireTimeout);
    }, duration - 3000);

    return () => clearTimeout(timeout);
  }, []);

  const removePowerUp = useCallback((playerId: string, powerUp: Power) => {
    setActivePowerUps((prev) => {
      const newSet = new Set(prev[playerId]);
      newSet.delete(powerUp);
      return { ...prev, [playerId]: newSet };
    });

    setFlashingPowerUps((prev) => {
      const newSet = new Set(prev[playerId]);
      newSet.delete(powerUp);
      return { ...prev, [playerId]: newSet };
    });
  }, []);

  const isPowerUpActive = useCallback((playerId: string, powerUp: Power) => activePowerUps[playerId]?.has(powerUp) || false, [activePowerUps]);
  const isPowerUpFlashing = useCallback((playerId: string, powerUp: Power) => flashingPowerUps[playerId]?.has(powerUp) || false, [flashingPowerUps]);

  return {
    addPowerUp,
    removePowerUp,
    isPowerUpActive,
    isPowerUpFlashing,
  };
};

export default usePowerUpManager;
