/* eslint-disable no-shadow */
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
import {
  GameMap, isPower, isBomb, Power
} from '../../model/gameItem';

import player1Image from '../../assets/player1.png';
import player1GhostImage from '../../assets/player1ghost.png';
import player1InvincibleImage from '../../assets/player1armor.png';
import player2Image from '../../assets/player2.png';
import player2GhostImage from '../../assets/player2ghost.png';
import player2InvincibleImage from '../../assets/player2armor.png';
import player3Image from '../../assets/player3.png';
import player3GhostImage from '../../assets/player3ghost.png';
import player3InvincibleImage from '../../assets/player3armor.png';

const powerUpImgs = {
  AddBomb: addBombImage,
  BlastRangeUp: blastRangeUpImage,
  Detonator: detonatorImage,
  RollerSkate: rollerSkateImage,
  Invincibility: invincibilityImage,
  Ghost: ghostImage,
  Obstacle: obstacleImage,
};

const playerImages: Record<string, { normal: string; ghost: string; invincible: string }> = {
  player1: {
    normal: player1Image,
    ghost: player1GhostImage,
    invincible: player1InvincibleImage
  },
  player2: {
    normal: player2Image,
    ghost: player2GhostImage,
    invincible: player2InvincibleImage
  },
  player3: {
    normal: player3Image,
    ghost: player3GhostImage,
    invincible: player3InvincibleImage
  }
};

type GridCellComponentProps = {
  row: number;
  column: number;
  players: Player[];
  monsters: Monster[];
  map: GameMap;
  isPowerUpActive: (powerUp: Power) => boolean;
}

export const GridCellComponent = ({
  row,
  column,
  players,
  monsters,
  map,
  isPowerUpActive
}: GridCellComponentProps) => {
  const cellContent = map[row][column];
  const isWallCell = cellContent === 'Wall';
  const isBoxCell = cellContent === 'Box';
  const isPowerUpCell = isPower(cellContent);
  const isBombCell = isBomb(cellContent);
  const player = players.find((p) => p.getX() === column && p.getY() === row);
  const monster = monsters.find((m) => m.getX() === column && m.getY() === row);
  const isEmptyCell = !isWallCell && !isBoxCell;

  const getPlayerImage = (player: Player) => {
    const name = player.getName();
    if (playerImages[name]) {
      if (isPowerUpActive('Ghost')) return playerImages[name].ghost;
      if (isPowerUpActive('Invincibility')) return playerImages[name].invincible;
      return playerImages[name].normal;
    }
    // Fallback in case the name doesn't match any key
    return playerImages.player1.normal;
  };

  return (
    <GridCell isWall={isWallCell} style={{ backgroundColor: isEmptyCell ? 'green' : 'transparent' }}>
      {isWallCell && <img src={wallImage} alt="Wall" style={{ width: '100%', height: '100%' }} />}
      {isBoxCell && <img src={boxImage} alt="Box" style={{ width: '100%', height: '100%' }} />}
      {isPowerUpCell && <img src={powerUpImgs[cellContent]} alt="PowerUp" style={{ width: '100%', height: '100%' }} />}
      {player && player.isAlive() && (
        <CharacterContainer>
          <img
            src={getPlayerImage(player)}
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
