// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function NotFound() {

  return (
    <Container 
      maxWidth={false}
      disableGutters={true}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #121212 0%, #000000 100%)',
        m: 0,
        p: 0,
        overflow: 'hidden'
      }}
    >
      <Box 
        component="img"
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
        alt="Spotify"
        sx={{
          width: '50%',
          maxWidth: '300px',
          mb: 4,
          opacity: 0.8
        }}
      />
      
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          color: '#1DB954',
          mb: 2,
          fontWeight: 'bold'
        }}
      >
        404
      </Typography>
      
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          color: 'white', 
          mb: 1,
          fontWeight: 'bold'
        }}
      >
        Página no encontrada
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#B3B3B3', 
          mb: 4,
          maxWidth: '600px'
        }}
      >
        Parece que te has perdido en el ritmo. La página que buscas no existe o ha sido movida a otro lugar.
      </Typography>
      
      <Button
        component={Link}
        to="/"
        variant="contained" 
        startIcon={<HomeIcon />}
        sx={{ 
          backgroundColor: '#1DB954',
          '&:hover': {
            backgroundColor: '#1ED760',
          },
          padding: '12px 32px',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        Volver al inicio
      </Button>
    </Container>
  );
}

export default NotFound;