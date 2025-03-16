// src/pages/Login.jsx
import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { redirectToSpotifyAuth } from '../spotify/auth'; // Importa la función para iniciar el proceso de autenticación con Spotify

function Login() {
  return (
    <Container 
      maxWidth={false} // Permite que el contenedor ocupe todo el ancho de la pantalla
      disableGutters={true} // Elimina los márgenes internos predeterminados del contenedor
      sx={{ 
        display: 'flex', // Usa flexbox para la disposición del contenido
        flexDirection: 'column', // Alinea los elementos en columna (uno debajo del otro)
        justifyContent: 'center', // Centra los elementos verticalmente en la pantalla
        alignItems: 'center', // Centra los elementos horizontalmente
        height: '100vh', // Hace que el contenedor ocupe toda la altura de la pantalla
        width: '100vw', // Hace que el contenedor ocupe todo el ancho de la pantalla
        textAlign: 'center', // Centra el texto dentro del contenedor
        background: 'linear-gradient(180deg, #121212 0%, #000000 100%)', // Aplica un fondo degradado de negro a gris oscuro
        m: 0, // Elimina márgenes exteriores
        p: 0, // Elimina el padding interno
        overflow: 'hidden' // Previene el desplazamiento si el contenido sobrepasa la pantalla
      }}
    >
      {/* Logo de Spotify, con un ancho máximo de 400px y un margen inferior para separación */}
      <img 
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
        alt="Spotify" 
        style={{ width: '70%', maxWidth: '400px', marginBottom: '2rem' }}
      />
      
      {/* Título de bienvenida con estilo en negrita y color blanco */}
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
      
      {/* Botón para iniciar sesión con Spotify */}
      <Button 
        variant="contained" // Usa el estilo de botón "contenido" de Material UI
        onClick={redirectToSpotifyAuth} // Llama a la función que redirige a la autenticación de Spotify
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

export default Login; // Exporta el componente para que pueda ser usado en otras partes de la aplicación
