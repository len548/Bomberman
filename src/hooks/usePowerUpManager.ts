/* eslint-disable quote-props */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { Power } from '../model/gameItem';

const usePowerUpManager = () => {
  const [activePowerUps, setActivePowerUps] = useState<Record<string, Set<Power>>>({});
  const [flashingPowerUps, setFlashingPowerUps] = useState<Record<string, Set<Power>>>({});

  const addPowerUp = useCallback((playerId: string, powerUp: Power, duration: number) => {
    const mutuallyExclusivePowerUps: Record<Power, Power | null> = {
      'Ghost': 'Invincibility',
      'Invincibility': 'Ghost',
      'AddBomb': null,
      'BlastRangeUp': null,
      'Detonator': null,
      'RollerSkate': null,
      'Obstacle': null
    };

    const currentActivePowerUps = activePowerUps[playerId] || new Set();
    const exclusivePowerUp = mutuallyExclusivePowerUps[powerUp];
    if (exclusivePowerUp !== null && currentActivePowerUps.has(exclusivePowerUp)) {
      return;
    }
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
  }, [activePowerUps]);

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

  const clearPowerUps = useCallback((playerId: string) => {
    setActivePowerUps((prev) => {
      const newSet = new Set<Power>();
      return { ...prev, [playerId]: newSet };
    });

    setFlashingPowerUps((prev) => {
      const newSet = new Set<Power>();
      return { ...prev, [playerId]: newSet };
    });
  }, []);

  const isPowerUpActive = useCallback((playerId: string, powerUp: Power) => activePowerUps[playerId]?.has(powerUp) || false, [activePowerUps]);
  const isPowerUpFlashing = useCallback((playerId: string, powerUp: Power) => flashingPowerUps[playerId]?.has(powerUp) || false, [flashingPowerUps]);

  return {
    addPowerUp,
    removePowerUp,
    clearPowerUps,
    isPowerUpActive,
    isPowerUpFlashing,
  };
};

export default usePowerUpManager;
