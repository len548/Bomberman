import React from 'react';
import { Grid, Paper } from '@mui/material';
import { MapContainer, MyGrid, StyledGameDialog } from './GameScreen.styles';
import { PlayerStatus } from './PlayerStatusScreen/PlayerStatusScreen';
import { Player } from '../../model/player';

type GameLayoutProps = {
  player: Player,
  playerTwo: Player,
  playerThree: Player | null,
  renderCellsAndPlayer: () => React.ReactNode;
};

export const GameLayout = ({
  player,
  playerTwo,
  playerThree,
  renderCellsAndPlayer
}: GameLayoutProps) => (
  <StyledGameDialog open>
    <Grid container spacing={2}>
      <Grid item xs={2} sx={{ mt: 5 }}>
        <PlayerStatus player={player} index={1} />
        {playerThree && (
          <>
            <br />
            <PlayerStatus player={playerThree} index={3} />
          </>
        )}
      </Grid>
      <Grid item xs={8}>
        <Paper>
          <MapContainer>
            <MyGrid>
              {renderCellsAndPlayer()}
            </MyGrid>
          </MapContainer>
        </Paper>
      </Grid>
      <Grid item xs={2} sx={{ mt: playerThree ? 15 : 5 }}>
        <PlayerStatus player={playerTwo} index={2} />
      </Grid>
    </Grid>
  </StyledGameDialog>
);
