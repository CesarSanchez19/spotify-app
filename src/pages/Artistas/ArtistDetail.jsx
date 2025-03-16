import React, { useState, useEffect } from 'react';
// Importamos useParams para extraer el ID del artista desde la URL y Link para la navegación interna
import { useParams, Link } from 'react-router-dom';
// Importamos componentes de Material UI para construir la interfaz de usuario
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Container,
  Paper,
  Stack,
  Grid,
  IconButton
} from '@mui/material';
// Importamos alpha para aplicar transparencias a los colores
import { alpha } from '@mui/material/styles';
// Importamos iconos para mejorar la experiencia visual y la interacción del usuario
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LaunchIcon from '@mui/icons-material/Launch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// Importamos funciones de la API de Spotify para obtener datos del artista, sus canciones más populares y el token de acceso
import { getArtist, getArtistTopTracks, getAccessToken } from '../../spotify/api';

function ArtistDetail() {
  // Estados para almacenar datos del artista, sus top tracks, y manejar la carga, errores y la reproducción de pistas
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para saber qué pista se está reproduciendo actualmente (por su ID)
  const [playingTrack, setPlayingTrack] = useState(null);
  // Extraemos el ID del artista desde la URL mediante useParams
  const { id } = useParams();

  // Efecto para cargar datos del artista y sus canciones más populares al montar el componente o cuando cambia el ID
  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true); // Inicia el estado de carga
      try {
        // Se obtiene el token de acceso necesario para las peticiones a la API de Spotify
        const token = await getAccessToken();
        // Se realizan dos peticiones en paralelo para obtener la información del artista y sus top tracks
        const [artistData, tracksData] = await Promise.all([
          getArtist(token, id),
          getArtistTopTracks(token, id),
        ]);
        // Se actualizan los estados con los datos obtenidos
        setArtist(artistData);
        setTopTracks(tracksData);
      } catch (error) {
        // En caso de error, se actualiza el estado y se muestra un mensaje en consola
        setError('Error al cargar los datos del artista');
        console.error('Error al cargar datos:', error);
      } finally {
        // Finaliza el estado de carga
        setLoading(false);
      }
    };
    fetchArtistData();
  }, [id]);

  // Función para manejar la reproducción y pausa de una pista de vista previa
  const handlePlayPause = (trackId) => {
    // Si la pista que se intenta reproducir ya está en reproducción
    if (playingTrack === trackId) {
      const audioElement = document.getElementById(`audio-${trackId}`);
      audioElement.pause(); // Se pausa la reproducción
      setPlayingTrack(null);
    } else {
      // Si hay alguna pista ya reproduciéndose, se pausa primero
      if (playingTrack) {
        const currentAudio = document.getElementById(`audio-${playingTrack}`);
        if (currentAudio) currentAudio.pause();
      }
      // Se obtiene el elemento de audio correspondiente al track y se inicia la reproducción
      const audioElement = document.getElementById(`audio-${trackId}`);
      if (audioElement) {
        audioElement.play();
        setPlayingTrack(trackId);
        // Al finalizar la reproducción, se reinicia el estado de reproducción
        audioElement.onended = () => {
          setPlayingTrack(null);
        };
      }
    }
  };

  // Función auxiliar para formatear la duración de una pista en minutos y segundos
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Renderizado mientras se cargan los datos: se muestra un indicador de carga centrado
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)'
        }}
      >
        <CircularProgress sx={{ color: '#1DB954' }} size={60} />
      </Box>
    );
  }

  // Si ocurre algún error, se muestra un mensaje de error dentro de un Alert
  if (error) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)'
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            m: 4, 
            maxWidth: 600,
            bgcolor: alpha('#ff5252', 0.15),
            color: '#ff5252',
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Si no se encontró el artista, se muestra un mensaje de artista no encontrado junto con un botón para volver a la búsqueda
  if (!artist) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          p: 8,
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)',
          color: '#b3b3b3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LibraryMusicIcon sx={{ fontSize: 80, mb: 3, opacity: 0.6 }} />
        <Typography variant="h4">Artista no encontrado</Typography>
        <Button
          component={Link}
          to="/artists"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mt: 4,
            color: '#1DB954',
            borderColor: '#1DB954',
            '&:hover': {
              borderColor: '#1ED760',
              bgcolor: alpha('#1DB954', 0.1)
            }
          }}
        >
          Volver a la búsqueda
        </Button>
      </Box>
    );
  }

  // Se definen las imágenes para el banner y la foto de perfil basándose en el arreglo de imágenes del artista
  const bannerImage = artist.images && artist.images.length > 0 
    ? artist.images[0].url 
    : null;

  const profileImage = artist.images && artist.images.length > 0 
    ? (artist.images.length > 1 ? artist.images[1].url : artist.images[0].url)
    : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)',
        color: '#fff',
        pb: 8
      }}
    >
      {/* Sección del Hero Banner con overlay y elementos posicionados */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '280px', md: '360px' },
          // Se establece overflow visible para permitir elementos posicionados fuera del contenedor
          overflow: 'visible',
          mb: { xs: 10, md: 12 }
        }}
      >
        {bannerImage ? (
          // Muestra el banner con la imagen del artista, aplicando un filtro de brillo para mejorar la legibilidad del overlay
          <Box
            component="img"
            src={bannerImage}
            alt={artist.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.7)',
              position: 'absolute',
              zIndex: 1
            }}
          />
        ) : (
          // Si no hay imagen, se muestra un fondo degradado alternativo
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #181818 0%, #000000 100%)',
              position: 'absolute',
              zIndex: 1
            }}
          />
        )}
        
        {/* Overlay que oscurece el banner para mejorar la visibilidad del texto */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 80%)',
            zIndex: 2
          }}
        />
        
        {/* Contenedor que aloja el botón de volver y otros elementos superpuestos */}
        <Container maxWidth="lg" sx={{ position: 'relative', height: '100%' }}>
          {/* Botón para volver a la lista de artistas */}
          <Button
            component={Link}
            to="/artists"
            startIcon={<ArrowBackIcon />}
            sx={{
              position: 'absolute',
              top: 24,
              left: 24,
              color: '#fff',
              bgcolor: alpha('#000', 0.5),
              backdropFilter: 'blur(10px)',
              borderRadius: 8,
              px: 2,
              py: 1,
              fontWeight: 600,
              zIndex: 3, // Se posiciona por encima del overlay
              '&:hover': {
                bgcolor: alpha('#000', 0.7),
                transform: 'translateX(-5px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Volver
          </Button>
          
          {/* Imagen de perfil del artista, posicionada para sobresalir del banner */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: -80, md: -100 },
              left: { xs: 24, md: 40 },
              width: { xs: 160, md: 200 },
              height: { xs: 160, md: 200 },
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              border: '4px solid #121212',
              zIndex: 4 // Se posiciona por encima del banner y overlay
            }}
          >
            {profileImage ? (
              <Box
                component="img"
                src={profileImage}
                alt={artist.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              // Si no hay imagen de perfil, se muestra un ícono alternativo
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #333, #222)'
                }}
              >
                <LibraryMusicIcon sx={{ fontSize: 80, color: '#b3b3b3' }} />
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Sección de información del artista */}
        <Box
          sx={{
            mt: { xs: 12, md: 14 }, // Se agrega margen superior para compensar la imagen de perfil
            mb: 8
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              color:"#fff"
            }}
          >
            {artist.name}
          </Typography>
          
          {/* Muestra información de seguidores y popularidad */}
          <Stack direction="row" spacing={4} sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ color: '#b3b3b3', mr: 1 }} />
              <Typography color="#b3b3b3" fontWeight={500}>
                {artist.followers.total.toLocaleString()} seguidores
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WhatshotIcon sx={{ color: artist.popularity > 70 ? '#1DB954' : '#b3b3b3', mr: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography color="#b3b3b3" fontWeight={500}>
                  Popularidad: 
                </Typography>
                <Box 
                  sx={{ 
                    ml: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: alpha('#1DB954', artist.popularity / 100),
                    px: 2,
                    py: 0.5,
                    borderRadius: 4
                  }}
                >
                  <Typography fontWeight={700}>
                    {artist.popularity}
                    <Typography component="span" color="#b3b3b3">/100</Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
          
          {/* Sección de géneros musicales */}
          {artist.genres.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#dddddd' }}>
                Géneros
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {artist.genres.map((genre) => (
                  <Chip 
                    key={genre} 
                    label={genre}
                    sx={{
                      bgcolor: alpha('#333', 0.5),
                      color: '#fff',
                      borderRadius: 3,
                      px: 1,
                      '&:hover': {
                        bgcolor: alpha('#1DB954', 0.2),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Botón que redirige al usuario a Spotify para escuchar al artista */}
          {artist.external_urls && artist.external_urls.spotify && (
            <Button
              variant="contained"
              color="success"
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<LaunchIcon />}
              sx={{ 
                mt: 2,
                bgcolor: '#1DB954',
                borderRadius: 6,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 8px 16px rgba(29, 185, 84, 0.3)',
                '&:hover': {
                  bgcolor: '#1ED760',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(29, 185, 84, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Escuchar en Spotify
            </Button>
          )}
        </Box>

        {/* Sección de Top Tracks del artista */}
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: alpha('#282828', 0.3), 
            borderRadius: 4,
            mb: 4,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 4 }}>
            {/* Encabezado de la sección de canciones más populares */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <LocalFireDepartmentIcon sx={{ color: '#1DB954', mr: 2, fontSize: 28 }} />
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{
                  color:"#ffff",
                  fontWeight: 800,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 4,
                    bgcolor: '#1DB954',
                    borderRadius: 2,
                  }
                }}
              >
                Canciones más populares
              </Typography>
            </Box>
            
            {/* Renderiza los top tracks en un grid; si no hay tracks, muestra un mensaje informativo */}
            {topTracks.length > 0 ? (
              <Grid container spacing={2}>
                {topTracks.map((track, index) => (
                  <Grid item xs={12} md={6} key={track.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        display: 'flex',
                        p: 2,
                        bgcolor: alpha('#fff', 0.03),
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: alpha('#fff', 0.07),
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {/* Sección de reproducción: si la pista tiene vista previa, muestra botón Play/Pause; de lo contrario, muestra el número de pista */}
                      {track.preview_url && (
                        <audio
                          id={`audio-${track.id}`}
                          src={track.preview_url}
                        />
                      )}
                      
                      <Box 
                        sx={{ 
                          width: 50, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        {track.preview_url ? (
                          <IconButton
                            onClick={() => handlePlayPause(track.id, track.preview_url)}
                            disabled={!track.preview_url}
                            sx={{
                              color: playingTrack === track.id ? '#1DB954' : '#fff',
                              '&:hover': {
                                color: '#1DB954',
                              }
                            }}
                          >
                            {playingTrack === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                          </IconButton>
                        ) : (
                          <Typography 
                            sx={{ 
                              color: '#b3b3b3', 
                              fontWeight: 500, 
                              width: 24, 
                              textAlign: 'center' 
                            }}
                          >
                            {index + 1}
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Sección de la carátula del álbum */}
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          borderRadius: 1,
                          overflow: 'hidden',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                        }}
                      >
                        {track.album?.images && track.album.images.length > 0 ? (
                          <Box
                            component="img"
                            src={track.album.images[track.album.images.length > 2 ? 2 : 0].url}
                            alt={track.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <LibraryMusicIcon sx={{ color: '#666' }} />
                          </Box>
                        )}
                      </Box>
                      
                      {/* Información de la pista: nombre y álbum */}
                      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography 
                          noWrap 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: '1rem',
                            color:"white"
                          }}
                        >
                          {track.name}
                        </Typography>
                        {track.album && (
                          <Typography 
                            noWrap 
                            sx={{ 
                              color: '#b3b3b3',
                              fontSize: '0.85rem' 
                            }}
                          >
                            {track.album.name}
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Muestra la duración de la pista en minutos y segundos */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: '#b3b3b3',
                          minWidth: 75,
                          justifyContent: 'flex-end'
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {formatDuration(track.duration_ms)}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // Si no hay canciones disponibles, se muestra un mensaje centrado
              <Box 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  color: '#b3b3b3'
                }}
              >
                <Typography variant="body1">No hay canciones disponibles para mostrar</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ArtistDetail;
