/* eslint-disable no-plusplus */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate, NavigateFunction } from 'react-router-dom';
import { ConfigScreen } from './ConfigScreen';

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ConfigScreen', () => {
  let mockNavigate: jest.Mock<NavigateFunction>;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const setup = (step = 0) => {
    render(
      <BrowserRouter>
        <ConfigScreen />
      </BrowserRouter>
    );
    if (step > 0) {
      const nextButton = screen.getByText('Next');
      for (let i = 0; i < step; i++) {
        fireEvent.click(nextButton);
      }
    }
  };

  it('should initialize with the game configuration step', () => {
    setup();
    const title = screen.getByText('Game Configuration');
    expect(title).toBeInTheDocument();
  });

  it('should navigate to the home page when the cancel button is clicked', () => {
    setup();
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should proceed to the next step when the next button is clicked', () => {
    setup();
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    const keyboardConfigTitle = screen.getByText('Keyboard Configuration');
    expect(keyboardConfigTitle).toBeInTheDocument();
  });

  it('should handle key configuration without errors', () => {
    setup(1);
    const playerInput = screen.getByDisplayValue('W');
    fireEvent.keyDown(playerInput, { key: 'E' });
    const noErrorMessages = screen.queryByText('Please correct the highlighted key conflicts before proceeding.');
    expect(noErrorMessages).not.toBeInTheDocument();
  });

  it('should display an error when there is a key conflict', () => {
    setup(1);
    const player1Input = screen.getAllByRole('textbox')[0];
    const player2Input = screen.getAllByRole('textbox')[1];
    fireEvent.keyDown(player1Input, { key: 'A' });
    fireEvent.keyDown(player2Input, { key: 'A' });
    const errorMessage = screen.getByText('Please correct the highlighted key conflicts before proceeding.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should render map selection buttons', () => {
    setup();
    const map1Button = screen.getByLabelText('map1');
    const map2Button = screen.getByLabelText('map2');
    const map3Button = screen.getByLabelText('map3');
    expect(map1Button).toBeInTheDocument();
    expect(map2Button).toBeInTheDocument();
    expect(map3Button).toBeInTheDocument();
  });

  it('should select a map when a map button is clicked', () => {
    setup();
    const map1Button = screen.getByLabelText('map1');
    fireEvent.click(map1Button);
    expect(map1Button).toHaveAttribute('aria-pressed', 'true');
  });

  it('should save configuration and navigate to game screen on play', () => {
    setup(1);
    const playButton = screen.getByText('Play');
    fireEvent.click(playButton);
    expect(localStorage.getItem('playerKeyBindings')).not.toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringMatching(/\/game\/\d+\/\d+\/map\d+/));
  });
});
