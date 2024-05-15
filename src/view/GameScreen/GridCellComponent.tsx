/* eslint-disable no-lone-blocks */
/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  CharacterContainer,
  GridCell
} from './GameScreen.styles';
import wallImage from '../../assets/wall.jpeg';
import boxImage from '../../assets/box.png';
import bombImage from '../../assets/bomb.png';
import addBombImage from '../../assets/addbomb.png';
import blastRangeUpImage from '../../assets/blastrange.png';
import detonatorImage from '../../assets/detonator.png';
import rollerSkateImage from '../../assets/rollerskate.png';
import invincibilityImage from '../../assets/invincibility.png';
import ghostImage from '../../assets/ghost.png';
import obstacleImage from '../../assets/obstacle.png';
import { Player } from '../../model/player';
import { Monster } from '../../model/monster';
import { GameMap, isPower, isBomb } from '../../model/gameItem';

type GridCellComponentProps = {
  row: number;
  column: number;
  players: Player[];
  monsters: Monster[];
  map: GameMap;
}

const powerUpImgs = {
  AddBomb: addBombImage,
  BlastRangeUp: blastRangeUpImage,
  Detonator: detonatorImage,
  RollerSkate: rollerSkateImage,
  Invincibility: invincibilityImage,
  Ghost: ghostImage,
  Obstacle: obstacleImage,
};

export const GridCellComponent = ({
  row,
  column,
  players,
  monsters,
  map,
}: GridCellComponentProps) => {
  const cellContent = map[row][column];
  const isWallCell = cellContent === 'Wall';
  const isBoxCell = cellContent === 'Box';
  const isPowerUpCell = isPower(cellContent);
  const isBombCell = isBomb(cellContent);
  const player = players.find((p) => p.getX() === column && p.getY() === row);
  const monster = monsters.find((m) => m.getX() === column && m.getY() === row);
  const isEmptyCell = !isWallCell && !isBoxCell;

  return (
    <GridCell isWall={isWallCell} style={{ backgroundColor: isEmptyCell ? 'green' : 'transparent' }}>
      {isWallCell && <img src={wallImage} alt="Wall" style={{ width: '100%', height: '100%' }} />}
      {isBoxCell && <img src={boxImage} alt="Box" style={{ width: '100%', height: '100%' }} />}
      {isPowerUpCell && <img src={powerUpImgs[cellContent]} alt="PowerUp" style={{ width: '100%', height: '100%' }} />}
      {player && player.isAlive() && (
        <CharacterContainer>
          <img
            src={player.getImg()}
            alt="Player"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </CharacterContainer>
      )}
      {monster && (
        <CharacterContainer>
          <img src={monster.getImg()} alt="Monster" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </CharacterContainer>
      )}
      {isBombCell && <img src={bombImage} alt="Bomb" style={{ width: '100%', height: '100%' }} />}
    </GridCell>
  );
};
