import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GameScreen } from './GameScreen';

describe('GameScreen', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/gamescreen/1']}>
        <GameScreen />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('initializes players correctly', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/gamescreen/1']}>
        <GameScreen />
      </MemoryRouter>
    );
    expect(getByText('player1')).toBeInTheDocument();
    expect(getByText('player2')).toBeInTheDocument();
  });

  it('loads map from local storage', async () => {
    localStorage.setItem('selectedMap', JSON.stringify([[' ', 'W', 'B']]));
    const { findByAltText } = render(
      <MemoryRouter initialEntries={['/gamescreen/1']}>
        <GameScreen />
      </MemoryRouter>
    );
    const wallImage = await findByAltText('Wall');
    const boxImage = await findByAltText('Box');
    expect(wallImage).toBeInTheDocument();
    expect(boxImage).toBeInTheDocument();
  });
});
