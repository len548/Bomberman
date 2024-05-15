/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { Power } from '../model/gameItem';

const usePowerUpManager = () => {
  const [powerUps, setPowerUps] = useState<Set<Power>>(new Set());
  const [timeouts, setTimeouts] = useState<Map<Power, NodeJS.Timeout>>(new Map());

  const removePowerUp = useCallback((powerUp: Power) => {
    setPowerUps((prev) => {
      const newSet = new Set(prev);
      newSet.delete(powerUp);
      return newSet;
    });
    setTimeouts((prev) => {
      const newTimeouts = new Map(prev);
      const timeout = newTimeouts.get(powerUp);
      if (timeout) clearTimeout(timeout);
      newTimeouts.delete(powerUp);
      return newTimeouts;
    });
  }, []);

  const addPowerUp = useCallback((powerUp: Power, duration: number) => {
    setPowerUps((prev) => new Set(prev).add(powerUp));
    const timeout = setTimeout(() => {
      removePowerUp(powerUp);
    }, duration);
    setTimeouts((prev) => {
      const newTimeouts = new Map(prev);
      newTimeouts.set(powerUp, timeout);
      return newTimeouts;
    });
  }, [removePowerUp]);

  const isPowerUpActive = useCallback((powerUp: Power) => powerUps.has(powerUp), [powerUps]);

  return { addPowerUp, removePowerUp, isPowerUpActive };
};

export default usePowerUpManager;
