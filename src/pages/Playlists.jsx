// pages/Playlists.jsx
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

const Playlists = ({ onPlayTrack }) => {
  const [search, setSearch] = useState('');
  
  const filteredPlaylists = mockData.playlists.filter(playlist => 
    playlist.title.toLowerCase().includes(search.toLowerCase()) ||
    playlist.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        Playlists
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar playlists"
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
        {filteredPlaylists.map((playlist) => (
          <Grid item key={playlist.id} xs={12} sm={6} md={3} lg={2.4}>
            <MusicCard item={playlist} onPlay={onPlayTrack} />
          </Grid>
        ))}
        
        {filteredPlaylists.length === 0 && (
          <Box sx={{ width: '100%', mt: 4, textAlign: 'center' }}>
            <Typography variant="h6">
              No se encontraron playlists que coincidan con tu búsqueda.
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default Playlists;