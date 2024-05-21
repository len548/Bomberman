/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { usePlayerActions } from './usePlayerActions';
import { Player } from '../model/player';

jest.mock('../model/player');

describe('usePlayerActions', () => {
  let mockPlayersInfo: Array<any>;
  let mockSetMap: jest.Mock;
  let mockAddPowerUp: jest.Mock;
  let mockRemovePowerUp: jest.Mock;
  let mockIsPowerUpActive: jest.Mock;

  beforeEach(() => {
    mockSetMap = jest.fn();
    mockAddPowerUp = jest.fn();
    mockRemovePowerUp = jest.fn();
    mockIsPowerUpActive = jest.fn();

    const mockPlayer = {
      isAlive: jest.fn().mockReturnValue(true),
      move: jest.fn(),
      getId: jest.fn().mockReturnValue('player1'),
      getY: jest.fn().mockReturnValue(1),
      getX: jest.fn().mockReturnValue(1),
    } as unknown as Player;

    mockPlayersInfo = [{
      player: mockPlayer,
      setNewPlayer: jest.fn(),
      dropBomb: jest.fn(),
      keyBindings: ['w', 'a', 's', 'd', ' '],
      enemies: [],
    }];
  });

  it('should not perform any action if player is not alive', () => {
    mockPlayersInfo[0].player.isAlive.mockReturnValue(false);

    const { result } = renderHook(() => usePlayerActions(
      mockPlayersInfo,
      { current: [] as unknown as any },
      mockSetMap,
      mockAddPowerUp,
      mockRemovePowerUp,
      mockIsPowerUpActive
    ));

    act(() => {
      result.current({ key: 'w' } as KeyboardEvent);
    });

    expect(mockPlayersInfo[0].player.move).not.toHaveBeenCalled();
  });
});
