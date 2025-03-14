// pages/Artists.jsx
import React, { useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box,
  TextField,
  InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MusicCard from '../components/MusicCard';
import { mockData } from '../data/mockData';

const Artists = ({ onPlayTrack }) => {
  const [search, setSearch] = useState('');
  
  const filteredArtists = mockData.artists.filter(artist => 
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    artist.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        Artistas
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar artistas"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Grid container spacing={2}>
        {filteredArtists.map((artist) => (
          <Grid item key={artist.id} xs={12} sm={6} md={3} lg={2.4}>
            <MusicCard 
              item={{
                ...artist,
                title: artist.name,
                description: artist.genre
              }} 
              onPlay={() => onPlayTrack(artist.topSong)} 
            />
          </Grid>
        ))}
        
        {filteredArtists.length === 0 && (
          <Box sx={{ width: '100%', mt: 4, textAlign: 'center' }}>
            <Typography variant="h6">
              No se encontraron artistas que coincidan con tu búsqueda.
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default Artists;