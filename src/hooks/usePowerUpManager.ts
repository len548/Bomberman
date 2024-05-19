/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { Power } from '../model/gameItem';

const usePowerUpManager = () => {
  const [activePowerUps, setActivePowerUps] = useState<Set<Power>>(new Set());
  const [flashingPowerUps, setFlashingPowerUps] = useState<Set<Power>>(new Set());

  const addPowerUp = useCallback((powerUp: Power, duration: number) => {
    setActivePowerUps((prev) => new Set([...prev, powerUp]));

    const timeout = setTimeout(() => {
      setFlashingPowerUps((prev) => new Set([...prev, powerUp]));
      const expireTimeout = setTimeout(() => {
        setActivePowerUps((prev) => {
          const newSet = new Set(prev);
          newSet.delete(powerUp);
          return newSet;
        });
        setFlashingPowerUps((prev) => {
          const newSet = new Set(prev);
          newSet.delete(powerUp);
          return newSet;
        });
      }, 3000);

      return () => clearTimeout(expireTimeout);
    }, duration - 3000);

    return () => clearTimeout(timeout);
  }, []);

  const removePowerUp = useCallback((powerUp: Power) => {
    setActivePowerUps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(powerUp);
      return newSet;
    });
    setFlashingPowerUps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(powerUp);
      return newSet;
    });
  }, []);

  const isPowerUpActive = useCallback((powerUp: Power) => activePowerUps.has(powerUp), [activePowerUps]);
  const isPowerUpFlashing = useCallback((powerUp: Power) => flashingPowerUps.has(powerUp), [flashingPowerUps]);

  return {
    addPowerUp,
    removePowerUp,
    isPowerUpActive,
    isPowerUpFlashing,
  };
};

export default usePowerUpManager;
