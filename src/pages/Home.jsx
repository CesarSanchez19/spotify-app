// pages/Home.jsx
import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MusicCard from '../components/MusicCard';
import { mockData } from '../data/mockData';

const Home = ({ onPlayTrack }) => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Bienvenido a Spotify Clone
        </Typography>
      </Box>

      {/* Playlists destacadas */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Playlists destacadas
          </Typography>
          <Button component={Link} to="/playlists" color="primary">
            Ver todas
          </Button>
        </Box>
        <Grid container spacing={2}>
          {mockData.playlists.slice(0, 4).map((playlist) => (
            <Grid item key={playlist.id} xs={12} sm={6} md={3}>
              <MusicCard item={playlist} onPlay={onPlayTrack} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Artistas populares */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Artistas populares
          </Typography>
          <Button component={Link} to="/artists" color="primary">
            Ver todos
          </Button>
        </Box>
        <Grid container spacing={2}>
          {mockData.artists.slice(0, 4).map((artist) => (
            <Grid item key={artist.id} xs={12} sm={6} md={3}>
              <MusicCard item={artist} onPlay={() => {}} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Audiolibros recomendados */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Audiolibros recomendados
          </Typography>
          <Button component={Link} to="/audiobooks" color="primary">
            Ver todos
          </Button>
        </Box>
        <Grid container spacing={2}>
          {mockData.audiobooks.slice(0, 4).map((audiobook) => (
            <Grid item key={audiobook.id} xs={12} sm={6} md={3}>
              <MusicCard item={audiobook} onPlay={onPlayTrack} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;