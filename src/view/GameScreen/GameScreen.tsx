/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
import React, {
  useState, useEffect, useCallback, useRef
} from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useParams } from 'react-router-dom';
import {
  StyledSettingsButton,
} from './GameScreen.styles';
import { StyledBackground } from '../WelcomeScreen/WelcomeScreen.styles';
import { Player } from '../../model/player';
import SettingsScreen from './SettingsScreen/SettingsScreen';
import { GridCellComponent } from './GridCellComponent';
import { KeyBindings } from '../../constants/props';
import {
  GameMap,
  gameItem,
  randomPowerUpGenerator
} from '../../model/gameItem';

import { Monster } from '../../model/monster';
import { GhostMonster } from '../../model/ghostMonster';
import { SmartMonster } from '../../model/smartMonster';
import { ForkMonster } from '../../model/forkMonster';
import { RoundResultDialog } from './RoundResultDialog';

import player1Image from '../../assets/player1.png';
import player1GhostImage from '../../assets/player1ghost.png';
import player1InvincibleImage from '../../assets/player1armor.png';
import player2Image from '../../assets/player2.png';
import player2GhostImage from '../../assets/player2ghost.png';
import player2InvincibleImage from '../../assets/player2armor.png';
import player3Image from '../../assets/player3.png';
import player3GhostImage from '../../assets/player3ghost.png';
import player3InvincibleImage from '../../assets/player3armor.png';

import ModifyControlsDialog from './SettingsScreen/ModifyControlsDialog';

import { GameLayout } from './GameLayout';
import { useBombManager } from '../../hooks/useBombManager';
import usePowerUpManager from '../../hooks/usePowerUpManager';
import { usePlayerActions } from '../../hooks/usePlayerActions';
import { defaultMap } from '../../constants/contants';

const playerNames = ['Player One', 'Player Two', 'Player Three'];

const fetchMap = async (): Promise<GameMap> => {
  let mapData = JSON.parse(localStorage.getItem('selectedMap') || '[]');
  mapData = mapData.length > 0 ? mapData : defaultMap;
  // Convert the string data to GameMap format
  const initialMap: GameMap = mapData.map((row: Array<string>) => {
    const mapRow: gameItem[] = row.map((cell: string) => {
      switch (cell) {
        case ' ':
          return 'Empty';
        case 'W':
          return 'Wall';
        case 'B':
          return 'Box';
        case 'P':
          return randomPowerUpGenerator();
        default:
          throw new Error(`Invalid map data: unexpected character '${cell}'`);
      }
    });
    return mapRow;
  });

  return initialMap;
};

export const GameScreen = () => {
  const { numOfPlayers, numOfRounds, selectedMap } = useParams();

  const playerImages = [
    {
      original: player1Image,
      ghost: player1GhostImage,
      invincible: player1InvincibleImage,
    },
    {
      original: player2Image,
      ghost: player2GhostImage,
      invincible: player2InvincibleImage,
    },
    {
      original: player3Image,
      ghost: player3GhostImage,
      invincible: player3InvincibleImage,
    },
  ];

  const [player, setPlayer] = useState(new Player('1', 'player1', 1, 1, true, 4, 2, [], 0, playerImages[0].original, playerImages[0].ghost, playerImages[0].invincible));
  const [playerTwo, setPlayerTwo] = useState(new Player('2', 'player2', 13, 8, true, 4, 2, [], 0, playerImages[1].original, playerImages[1].ghost, playerImages[1].invincible));
  const [playerThree, setPlayerThree] = useState(numOfPlayers === '3' ? new Player('3', 'player3', 7, 7, true, 4, 2, [], 0, playerImages[2].original, playerImages[2].ghost, playerImages[2].invincible) : null);
  const [map, setMap] = useState<GameMap>([]);
  const mapRef = useRef(map);
  const playersRef = useRef([player, playerTwo, playerThree].filter((p): p is Player => p !== null));
  playersRef.current = [player, playerTwo, playerThree].filter((p): p is Player => p !== null);
  const setPlayers = [setPlayer, setPlayerTwo, setPlayerThree];
  const {
    dropBomb: dropPlayerOneBomb
  } = useBombManager(0, playersRef, setPlayers, mapRef, setMap);
  const {
    dropBomb: dropPlayerTwoBomb
  } = useBombManager(1, playersRef, setPlayers, mapRef, setMap);
  const {
    dropBomb: dropPlayerThreeBomb
  } = useBombManager(2, playersRef, setPlayers, mapRef, setMap);

  const {
    addPowerUp, removePowerUp, isPowerUpActive
  } = usePowerUpManager();

  const [keyBindings, setKeyBindings] = useState<KeyBindings>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModifyingControls, setIsModifyingControls] = useState(false);
  const [monsters, setMonsters] = useState([] as Monster[]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  useEffect(() => {
    switch (selectedMap) {
      case 'map1':
        if (numOfPlayers === '3') {
          setMonsters([
            new SmartMonster('monster1', 'Monster 1', 6, 5),
            new Monster('monster2', 'Monster 2', 10, 2),
          ]);
        } else {
          setMonsters([
            new SmartMonster('monster1', 'Monster 1', 6, 5),
            new Monster('monster2', 'Monster 2', 10, 2),
            new Monster('monster3', 'Monster 3', 4, 8),
          ]);
        }
        break;
      case 'map2':
        if (numOfPlayers === '3') {
          setMonsters([
            new GhostMonster('monster1', 'Monster 1', 6, 5),
            new SmartMonster('monster2', 'Monster 2', 10, 2),
          ]);
        } else {
          setMonsters([
            new GhostMonster('monster1', 'Monster 1', 7, 5),
            new SmartMonster('monster2', 'Monster 2', 4, 8),
            new Monster('monster3', 'Monster 3', 6, 1),
          ]);
        }
        break;
      case 'map3':
        if (numOfPlayers === '3') {
          setMonsters([
            new ForkMonster('monster1', 'Monster 1', 7, 4),
            new GhostMonster('monster2', 'Monster 2', 11, 1),
            new Monster('monster3', 'Monster 3', 5, 8),
          ]);
        } else {
          setMonsters([
            new ForkMonster('monster1', 'Monster 1', 9, 1),
            new SmartMonster('monster2', 'Monster 2', 6, 3),
            new Monster('monster3', 'Monster 3', 5, 8),
            new GhostMonster('monster4', 'Monster 4', 8, 6),
          ]);
        }
        break;
      default:
        setMonsters([]);
    }
  }, [selectedMap]);

  useEffect(() => {
    if (map.length === 0) {
      fetchMap().then(setMap);
      console.log(numOfRounds);
    }
    mapRef.current = map;
  }, []);

  const playerRef = useRef(player);
  const playerTwoRef = useRef(playerTwo);
  const playerThreeRef = useRef(playerThree);
  const smartMonstersRef = useRef<Monster[]>([]);
  const ghostMonstersRef = useRef<Monster[]>([]);
  const forkMonstersRef = useRef<Monster[]>([]);

  useEffect(() => {
    smartMonstersRef.current = monsters.filter((monster) => monster instanceof SmartMonster);
    ghostMonstersRef.current = monsters.filter((monster) => monster instanceof GhostMonster);
    forkMonstersRef.current = monsters.filter((monster) => monster instanceof ForkMonster);
  }, [monsters]);

  useEffect(() => {
    playerRef.current = player;
    playerTwoRef.current = playerTwo;
    playerThreeRef.current = playerThree;
  }, [player, playerTwo, playerThree]);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  const handleKeyDown = usePlayerActions([
    {
      player,
      setNewPlayer: setPlayer,
      dropBomb: dropPlayerOneBomb,
      keyBindings: keyBindings['1'],
      enemies: [playerTwo, playerThree].filter((p): p is Player => p !== null),
    },
    {
      player: playerTwo,
      setNewPlayer: setPlayerTwo,
      dropBomb: dropPlayerTwoBomb,
      keyBindings: keyBindings['2'],
      enemies: [player, playerThree].filter((p): p is Player => p !== null),
    },
    playerThree ? {
      player: playerThree,
      setNewPlayer: setPlayerThree,
      dropBomb: dropPlayerThreeBomb,
      keyBindings: keyBindings['3'],
      enemies: [player, playerTwo]
    } : null
  ], mapRef, setMap, addPowerUp, removePowerUp, isPowerUpActive);

  useEffect(() => {
    const storedBindings = localStorage.getItem('playerKeyBindings');
    if (storedBindings) {
      const parsedBindings = JSON.parse(storedBindings);
      setKeyBindings(parsedBindings);
    }
  }, []);

  const moveSmartMonsters = useCallback(() => {
    if (!isPaused) {
      setMonsters((smartMonsters) => smartMonsters.map((monster, idx, self) => {
        const players = [
          playerRef.current, playerTwoRef.current, playerThreeRef.current
        ].filter(Boolean) as Player[];
        const otherMonsters = self.filter((m, i) => i !== idx);
        if (monster instanceof SmartMonster) {
          return monster.move(map, players, otherMonsters);
        }
        return monster;
      }));
    }
  }, [isPaused, map]);

  const moveGhostMonsters = useCallback(() => {
    if (!isPaused) {
      setMonsters((ghostMonsters) => ghostMonsters.map((monster) => {
        if (monster instanceof GhostMonster) {
          return monster.move(map);
        }
        return monster;
      }));
    }
  }, [isPaused, map]);

  const moveForkMonsters = useCallback(() => {
    if (!isPaused) {
      setMonsters((basicForkMonsters) => basicForkMonsters.map((monster, idx, self) => {
        const players = [
          playerRef.current, playerTwoRef.current, playerThreeRef.current
        ].filter(Boolean) as Player[];
        const otherMonsters = self.filter((m, i) => i !== idx);
        if (monster instanceof ForkMonster || monster instanceof Monster) {
          return monster.move(map, players, otherMonsters);
        }
        return monster;
      }));
    }
  }, [isPaused, map]);

  const resetRound = () => {
    setPlayer(new Player('1', 'player1', 1, 1, true, 4, 2, [], 0, playerImages[0].original, playerImages[0].ghost, playerImages[0].invincible));
    setPlayerTwo(new Player('2', 'player2', 13, 8, true, 4, 2, [], 0, playerImages[1].original, playerImages[1].ghost, playerImages[1].invincible));
    setPlayerThree(numOfPlayers === '3' ? new Player('3', 'player3', 1, 8, true, 4, 2, [], 0, playerImages[2].original, playerImages[2].ghost, playerImages[2].invincible) : null);
    if (selectedMap === 'map1') {
      if (numOfPlayers === '3') {
        setMonsters([
          new SmartMonster('monster1', 'Monster 1', 6, 5),
          new Monster('monster2', 'Monster 2', 10, 2),
        ]);
      } else {
        setMonsters([
          new SmartMonster('monster1', 'Monster 1', 6, 5),
          new Monster('monster2', 'Monster 2', 10, 2),
          new Monster('monster3', 'Monster 3', 4, 8),
        ]);
      }
    } else if (selectedMap === 'map2') {
      if (numOfPlayers === '3') {
        setMonsters([
          new GhostMonster('monster1', 'Monster 1', 6, 5),
          new SmartMonster('monster2', 'Monster 2', 10, 2),
        ]);
      } else {
        setMonsters([
          new GhostMonster('monster1', 'Monster 1', 7, 5),
          new SmartMonster('monster2', 'Monster 2', 4, 8),
          new Monster('monster3', 'Monster 3', 6, 1),
        ]);
      }
    } else if (selectedMap === 'map3') {
      if (numOfPlayers === '3') {
        setMonsters([
          new ForkMonster('monster1', 'Monster 1', 7, 4),
          new GhostMonster('monster2', 'Monster 2', 11, 1),
          new Monster('monster3', 'Monster 3', 5, 8),
        ]);
      } else {
        setMonsters([
          new ForkMonster('monster1', 'Monster 1', 9, 1),
          new SmartMonster('monster2', 'Monster 2', 6, 3),
          new Monster('monster3', 'Monster 3', 5, 8),
          new GhostMonster('monster4', 'Monster 4', 8, 6),
        ]);
      }
    }
  };

  const checkEndOfRound = () => {
    const activePlayers = [player, playerTwo, playerThree].filter((p) => p && p.isAlive());

    if (activePlayers.length <= 1) {
      const recheckedActivePlayers = [player, playerTwo, playerThree].filter((p) => p && p.isAlive());
      if (recheckedActivePlayers.length === 1) {
        setResultMessage(`${recheckedActivePlayers[0]?.getName()} wins the round!`);
      } else if (recheckedActivePlayers.length === 0) {
        setResultMessage('No players left, draw!');
      }
      setDialogOpen(true);
      setIsPaused(true);
      resetRound();
      fetchMap().then(setMap);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setIsPaused(false);
  };

  const checkPlayerMonsterCollision = useCallback((
    currentPlayer: Player,
    currentPlayerTwo: Player,
    currentPlayerThree: Player | null,
    currentMonsters: Monster[]
  ) => {
    currentMonsters.forEach((monsterTemp) => {
      if (monsterTemp.getX() === currentPlayer.getX()
        && monsterTemp.getY() === currentPlayer.getY()
        && currentPlayer.isAlive()
        && !isPowerUpActive('Invincibility')) {
        currentPlayer.killPlayer();
        setPlayer(Player.fromPlayer(currentPlayer));
      }
      if (monsterTemp.getX() === currentPlayerTwo.getX()
        && monsterTemp.getY() === currentPlayerTwo.getY()
        && currentPlayerTwo.isAlive()
        && !isPowerUpActive('Invincibility')) {
        currentPlayerTwo.killPlayer();
        setPlayerTwo(Player.fromPlayer(currentPlayerTwo));
      }
      if (currentPlayerThree && monsterTemp.getX() === currentPlayerThree.getX()
        && monsterTemp.getY() === currentPlayerThree.getY()
        && currentPlayerThree.isAlive()
        && !isPowerUpActive('Invincibility')) {
        currentPlayerThree.killPlayer();
        setPlayerThree(Player.fromPlayer(currentPlayerThree));
      }
    });
    checkEndOfRound();
  }, [player, playerTwo, playerThree, monsters]);

  useEffect(() => {
    checkPlayerMonsterCollision(player, playerTwo, playerThree, monsters);
  }, [player, playerTwo, monsters, playerThree]);

  useEffect(() => {
    if (isPaused) return;
    window.addEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const smartInterval = setInterval(moveSmartMonsters, 600);
    const ghostInterval = setInterval(moveGhostMonsters, 1000);
    const forkInterval = setInterval(moveForkMonsters, 700);

    return () => {
      clearInterval(smartInterval);
      clearInterval(ghostInterval);
      clearInterval(forkInterval);
    };
  }, [moveSmartMonsters, moveGhostMonsters, moveForkMonsters]);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    setIsPaused(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    setIsPaused(false);
  };

  const handleRestartGame = () => {
    setPlayer(new Player('player1', playerNames[0], 1, 1, true, 4, 2, [], 0, playerImages[0].original, playerImages[0].ghost, playerImages[0].invincible));
    setPlayerTwo(new Player('player2', playerNames[1], 13, 8, true, 4, 2, [], 0, playerImages[1].original, playerImages[1].ghost, playerImages[1].invincible));

    setMonsters([
      new SmartMonster('monster1', 'Monster 1', 5, 5),
      new ForkMonster('monster2', 'Monster 2', 5, 8),
      new GhostMonster('monster2', 'Monster 2', 9, 7),
      new Monster('monster2', 'Monster 2', 10, 5),
    ]);
    setIsSettingsOpen(false);
    setIsPaused(false);
  };

  const saveAndCloseModifyControls = () => {
    setIsModifyingControls(false);
    setIsPaused(false);
  };

  const renderCellsAndPlayer = () => map.flatMap((row, rowIndex) => row.map((cell, colIndex) => (
    <GridCellComponent
      // eslint-disable-next-line react/no-array-index-key
      key={`${rowIndex}-${colIndex}`}
      row={rowIndex}
      column={colIndex}
      players={[player, playerTwo, playerThree].filter((p) => p?.isAlive()) as Player[]}
      monsters={monsters}
      map={map}
      isPowerUpActive={isPowerUpActive} // Pass this function to GridCellComponent
    />
  )));

  return (
    <StyledBackground>
      <RoundResultDialog open={dialogOpen} onClose={handleClose} resultMessage={resultMessage} />
      <StyledSettingsButton onClick={handleOpenSettings}>
        <SettingsIcon />
      </StyledSettingsButton>
      <GameLayout
        player={player}
        playerTwo={playerTwo}
        playerThree={playerThree}
        renderCellsAndPlayer={renderCellsAndPlayer}
      />
      <SettingsScreen
        open={isSettingsOpen}
        onClose={handleCloseSettings}
        onRestart={handleRestartGame}
        onModifyControls={() => {
          setIsModifyingControls(true);
          setIsPaused(true);
        }}
      />
      <ModifyControlsDialog
        isOpen={isModifyingControls}
        onClose={() => {
          setIsModifyingControls(false);
          setIsPaused(false);
        }}
        onSave={saveAndCloseModifyControls}
        keyBindings={keyBindings}
        numOfPlayers={String(numOfPlayers)}
      />
    </StyledBackground>
  );
};
