// components/Player.jsx
import React, { useState, useEffect } from 'react';
import { Box, Slider, IconButton, Typography, Avatar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const Player = ({ currentTrack, isPlaying, onPlayPause }) => {
  const [volume, setVolume] = useState(50);
  const [position, setPosition] = useState(0);
  
  // Reiniciar posición cuando cambia la canción
  useEffect(() => {
    setPosition(0);
  }, [currentTrack]);

  // Simular progreso de la canción
  useEffect(() => {
    let timer;
    if (isPlaying && currentTrack) {
      timer = setInterval(() => {
        setPosition((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack]);

  // Formatear tiempo como MM:SS
  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      bgcolor: '#181818', 
      borderTop: '1px solid #282828',
      padding: 2,
      height: '90px',
    }}>
      {/* Información de la canción */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
        {currentTrack ? (
          <>
            <Avatar 
              src={currentTrack.image} 
              alt={currentTrack.title}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" color="white">
                {currentTrack.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTrack.artist}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay canción reproduciendo
          </Typography>
        )}
      </Box>

      {/* Controles de reproducción */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton size="small" color="white">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton 
            onClick={onPlayPause} 
            disabled={!currentTrack}
            sx={{ 
              bgcolor: 'white', 
              color: 'black', 
              '&:hover': { bgcolor: 'white' }, 
              mx: 1,
              '&.Mui-disabled': { bgcolor: '#333', color: '#666' }
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton size="small" color="white">
            <SkipNextIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            {formatTime(position)}
          </Typography>
          <Slider
            size="small"
            value={position}
            max={100}
            sx={{ color: '#1DB954' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {formatTime(100)}
          </Typography>
        </Box>
      </Box>

      {/* Control de volumen */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '20%', justifyContent: 'flex-end' }}>
        <IconButton size="small" color="white">
          <VolumeUpIcon />
        </IconButton>
        <Slider
          size="small"
          value={volume}
          onChange={(e, newValue) => setVolume(newValue)}
          sx={{ width: 100, mx: 2, color: '#1DB954' }}
        />
      </Box>
    </Box>
  );
};

export default Player;