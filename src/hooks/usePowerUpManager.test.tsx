/* eslint-disable max-len */
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook, act } from '@testing-library/react-hooks';
import usePowerUpManager from './usePowerUpManager';
import { Player } from '../model/player';
import { GameMap } from '../model/gameItem';

jest.mock('../model/player');
jest.mock('../model/gameItem', () => ({
  isObstacle: jest.fn().mockReturnValue(false),
}));

describe('usePowerUpManager', () => {
  let mockPlayersRef: React.MutableRefObject<Player[]>;
  let mockSetPlayers: jest.Mock[];
  let mockMapRef: React.MutableRefObject<GameMap>;

  beforeEach(() => {
    const mockPlayer = {
      getId: jest.fn().mockReturnValue('player1'),
      getY: jest.fn().mockReturnValue(1),
      getX: jest.fn().mockReturnValue(1),
      isAlive: jest.fn().mockReturnValue(true),
      killPlayer: jest.fn(),
    } as unknown as Player;

    mockPlayersRef = { current: [mockPlayer] };
    mockSetPlayers = [jest.fn()];
    mockMapRef = { current: [['Empty', 'Empty'], ['Empty', 'Empty']] };
  });

  it('should add a power-up to a player', () => {
    const { result } = renderHook(() => usePowerUpManager(mockMapRef, mockPlayersRef, mockSetPlayers));

    act(() => {
      result.current.addPowerUp('player1', 'Ghost', 5000);
    });

    expect(result.current.isPowerUpActive('player1', 'Ghost')).toBe(true);
  });

  it('should remove a power-up from a player', () => {
    const { result } = renderHook(() => usePowerUpManager(mockMapRef, mockPlayersRef, mockSetPlayers));

    act(() => {
      result.current.addPowerUp('player1', 'Ghost', 5000);
      result.current.removePowerUp('player1', 'Ghost');
    });

    expect(result.current.isPowerUpActive('player1', 'Ghost')).toBe(false);
  });

  it('should check if a power-up is flashing', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => usePowerUpManager(mockMapRef, mockPlayersRef, mockSetPlayers));

    act(() => {
      result.current.addPowerUp('player1', 'Ghost', 5000);
      jest.advanceTimersByTime(2000); // Fast-forward time
    });

    expect(result.current.isPowerUpFlashing('player1', 'Ghost')).toBe(true);

    jest.useRealTimers();
  });

  it('should clear all power-ups for a player', () => {
    const { result } = renderHook(() => usePowerUpManager(mockMapRef, mockPlayersRef, mockSetPlayers));

    act(() => {
      result.current.addPowerUp('player1', 'Ghost', 5000);
      result.current.addPowerUp('player1', 'Invincibility', 5000);
      result.current.clearPowerUps('player1');
    });

    expect(result.current.isPowerUpActive('player1', 'Ghost')).toBe(false);
    expect(result.current.isPowerUpActive('player1', 'Invincibility')).toBe(false);
  });
});
