// src/pages/Login.jsx
import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { redirectToSpotifyAuth } from '../spotify/auth';

function Login() {
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #121212 0%, #000000 100%)',
      }}
    >
      <img 
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
        alt="Spotify" 
        style={{ width: '70%', marginBottom: '2rem' }}
      />
      
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          color: 'white', 
          marginBottom: '2rem',
          fontWeight: 'bold'
        }}
      >
        Bienvenido a tu Aplicación de Spotify
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={redirectToSpotifyAuth}
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
        Iniciar sesión con Spotify
      </Button>
    </Container>
  );
}

export default Login;
