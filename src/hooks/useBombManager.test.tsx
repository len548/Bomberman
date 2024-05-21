// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useBombManager } from './useBombManager';
import { Player } from '../model/player';
import { GameMap } from '../model/gameItem';

jest.mock('../model/player');
jest.mock('../model/gameItem', () => ({
  isObstacle: jest.fn(),
  isBomb: jest.fn(),
  randomPowerUpGenerator: jest.fn().mockReturnValue('Empty'),
}));

describe('useBombManager', () => {
  let mockPlayersRef: React.MutableRefObject<Player[]>;
  let mockSetPlayers: jest.Mock[];
  let mockMapRef: React.MutableRefObject<GameMap>;
  let mockSetMap: jest.Mock;
  let mockSetExplosions: jest.Mock;
  let mockSetDestroyedBoxes: jest.Mock;

  beforeEach(() => {
    const mockPlayer = {
      getId: jest.fn().mockReturnValue('player1'),
      getY: jest.fn().mockReturnValue(1),
      getX: jest.fn().mockReturnValue(1),
      getBombs: jest.fn().mockReturnValue(1),
      getBombRange: jest.fn().mockReturnValue(1),
      canPlaceBomb: jest.fn().mockReturnValue(true),
      incrementActiveBombs: jest.fn(),
      decrementActiveBombs: jest.fn(),
      isAlive: jest.fn().mockReturnValue(true),
      isDetonator: jest.fn().mockReturnValue(false),
      isInvincible: jest.fn().mockReturnValue(false),
      killPlayer: jest.fn(),
      removePowerUp: jest.fn(),
    } as unknown as Player;

    mockPlayersRef = { current: [mockPlayer] };
    mockSetPlayers = [jest.fn()];
    mockMapRef = { current: [['Empty', 'Empty'], ['Empty', 'Empty']] };
    mockSetMap = jest.fn();
    mockSetExplosions = jest.fn();
    mockSetDestroyedBoxes = jest.fn();
  });

  it('should drop a bomb on the map', () => {
    const { result } = renderHook(() => useBombManager(
      0,
      mockPlayersRef,
      mockSetPlayers,
      mockMapRef,
      mockSetMap,
      mockSetExplosions,
      mockSetDestroyedBoxes
    ));

    act(() => {
      result.current.dropBomb(1, 1);
    });

    expect(mockPlayersRef.current[0].incrementActiveBombs).toHaveBeenCalled();
    expect(mockSetMap).toHaveBeenCalledWith([
      ['Empty', 'Empty'],
      ['Empty', expect.any(Object)],
    ]);
    expect(mockSetPlayers[0]).toHaveBeenCalled();
  });

  it('should explode a bomb after a delay', () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useBombManager(
      0,
      mockPlayersRef,
      mockSetPlayers,
      mockMapRef,
      mockSetMap,
      mockSetExplosions,
      mockSetDestroyedBoxes
    ));

    act(() => {
      result.current.dropBomb(1, 1);
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockSetExplosions).toHaveBeenCalled();
    expect(mockSetMap).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should not drop a bomb if the cell is not empty', () => {
    mockMapRef.current[1][1] = 'Wall';

    const { result } = renderHook(() => useBombManager(
      0,
      mockPlayersRef,
      mockSetPlayers,
      mockMapRef,
      mockSetMap,
      mockSetExplosions,
      mockSetDestroyedBoxes
    ));

    act(() => {
      result.current.dropBomb(1, 1);
    });

    expect(mockPlayersRef.current[0].incrementActiveBombs).not.toHaveBeenCalled();
    expect(mockSetMap).not.toHaveBeenCalled();
    expect(mockSetPlayers[0]).not.toHaveBeenCalled();
  });
});
