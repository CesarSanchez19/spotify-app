import React, { useState, useEffect } from 'react';
// Importa hooks para obtener parámetros de la URL y manejar la navegación
import { useParams, useNavigate } from 'react-router-dom';
// Importa funciones de la API de Spotify para obtener el token y los detalles de la canción
import { getAccessToken, getTrack } from '../../spotify/api';
// Importa componentes de Material UI para construir la interfaz de usuario
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardMedia, 
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Skeleton,
  Alert,
  Paper
} from '@mui/material';
// Importa el componente Grid para estructurar el layout en columnas
import Grid from "@mui/material/Grid2";
// Importa iconos para mejorar la experiencia visual
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LaunchIcon from '@mui/icons-material/Launch';

const TrackDetail = () => {
  // Obtiene el parámetro 'id' de la URL para identificar la pista a mostrar
  const { id } = useParams();
  
  // Estados del componente para manejar token, datos de la pista, errores, carga, reproducción y progreso
  const [token, setToken] = useState('');
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(null);
  
  // Hook para la navegación (por ejemplo, volver a la página anterior)
  const navigate = useNavigate();

  // Debug: Imprime el token en la consola para verificar su valor
  console.log(token)

  // useEffect para obtener el token de Spotify y los detalles de la pista al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Activa el estado de carga
      try {
        // Solicita el token de acceso a Spotify
        const accessToken = await getAccessToken();
        setToken(accessToken);

        // Solicita los detalles de la pista utilizando el token y el id obtenido de la URL
        const trackData = await getTrack(accessToken, id);
        setTrack(trackData);
      } catch (err) {
        // Si ocurre un error, actualiza el estado de error con un mensaje descriptivo
        setError(`Error al cargar los detalles de la canción: ${err.message}`);
      } finally {
        // Finaliza el estado de carga
        setLoading(false);
      }
    };

    fetchData();

    // Función de limpieza para detener la reproducción y limpiar el audioPlayer
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        setIsPlaying(false);
        setProgress(0);
        audioPlayer.src = '';
      }
    };
  }, [id, audioPlayer]); // Se vuelve a ejecutar cuando cambia el 'id' o el 'audioPlayer'

  // useEffect para configurar el reproductor de audio y actualizar la barra de progreso
  useEffect(() => {
    // Si no hay URL de vista previa, no se configura el reproductor
    if (!track?.preview_url) return;

    // Crea un nuevo objeto Audio con la URL de vista previa de la pista
    const audio = new Audio(track.preview_url);
    setAudioPlayer(audio);

    // Función para actualizar el progreso basado en el tiempo actual de reproducción
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    // Función para manejar el fin de la reproducción, reiniciando el estado
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    // Agrega los event listeners al objeto Audio
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Función de limpieza: pausa el audio y elimina los event listeners
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [track]); // Se ejecuta solo cuando cambia la pista cargada

  // Función para actualizar la barra de progreso (no se usa directamente, pero está disponible)
  const updateProgress = () => {
    if (audioPlayer) {
      const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      setProgress(percentage);
    }
  };

  // Función para alternar la reproducción (play/pause) de la vista previa de la pista
  const togglePlay = () => {
    if (!audioPlayer) return;
    
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Debug: Imprime la función updateProgress para verificar que esté definida
  console.log(updateProgress)

  // Función auxiliar para formatear la duración de la pista (de milisegundos a minutos:segundos)
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Renderizado condicional: si hay un error, se muestra un mensaje de error
  if (error) return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Box sx={{ 
      bgcolor: '#121212', 
      // Si se cargó la pista, se aplica un fondo con degradado; de lo contrario, no se aplica imagen de fondo
      backgroundImage: track ? `linear-gradient(180deg, rgba(29,185,84,0.8) 0%, rgba(18,18,18,1) 25%)` : 'none',
      minHeight: '100vh', 
      color: 'white',
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 4 }}>
          {/* Botón para volver a la página anterior */}
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'white', 
              mb: 4,
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)' 
              }
            }}
          >
            Volver
          </Button>
          
          {loading ? (
            // Muestra un conjunto de Skeletons como indicador de carga
            <Grid container spacing={4}>
              <Grid xs={12} md={4}>
                <Skeleton variant="rectangular" height={300} width="100%" animation="wave" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Grid>
              <Grid xs={12} md={8}>
                <Skeleton variant="text" height={60} width="80%" animation="wave" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" height={30} width="50%" animation="wave" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 2 }} />
                <Skeleton variant="text" height={30} width="40%" animation="wave" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }} />
                <Skeleton variant="rectangular" height={80} width="100%" animation="wave" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 4 }} />
              </Grid>
            </Grid>
          ) : (
            // Contenido principal de los detalles de la pista
            <Grid container spacing={4}>
              {/* Sección de la imagen de la pista */}
              <Grid xs={12} md={4}>
                <Card elevation={6} sx={{ 
                  position: 'relative',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="auto"
                    // Muestra la imagen del álbum o una imagen de placeholder si no existe
                    image={track?.album.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={track?.name}
                    sx={{ width: '100%' }}
                  />
                  {track?.preview_url && (
                    // Botón flotante para reproducir/pausar la vista previa, ubicado en la esquina inferior derecha
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 16, 
                      right: 16, 
                      bgcolor: '#1DB954',
                      borderRadius: '50%',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                    }}>
                      <IconButton 
                        size="large"
                        onClick={togglePlay}
                        sx={{ color: 'white' }}
                      >
                        {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                      </IconButton>
                    </Box>
                  )}
                </Card>
              </Grid>
              
              {/* Sección con información detallada de la pista */}
              <Grid xs={12} md={8}>
                <Box>
                  {/* Etiqueta que indica que es una canción */}
                  <Chip 
                    label="CANCIÓN" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      color: 'white',
                      mb: 1
                    }} 
                  />
                  {/* Título principal de la pista */}
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {track?.name}
                  </Typography>
                  {/* Muestra los nombres de los artistas asociados a la pista */}
                  <Typography variant="subtitle1" sx={{ color: '#b3b3b3', mb: 3 }}>
                    {track?.artists.map((artist) => artist.name).join(', ')}
                  </Typography>
                  
                  {track?.preview_url && (
                    // Sección para la vista previa de la pista, incluye barra de progreso
                    <Box sx={{ mb: 4 }}>
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Vista previa ({formatDuration(track.duration_ms)})
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            mb: 1,
                            height: 4,
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#1DB954'
                            }
                          }} 
                        />
                      </Paper>
                    </Box>
                  )}
                  
                  {/* Separador visual */}
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 3 }} />
                  
                  {/* Información adicional de la pista, organizada en un grid */}
                  <Grid container spacing={3}>
                    {/* Información del álbum */}
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AlbumIcon sx={{ mr: 1, color: '#b3b3b3' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Álbum
                          </Typography>
                          <Typography variant="subtitle2">
                            {track?.album.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Fecha de lanzamiento del álbum */}
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon sx={{ mr: 1, color: '#b3b3b3' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Fecha de lanzamiento
                          </Typography>
                          <Typography variant="subtitle2">
                            {track?.album.release_date}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Duración de la pista */}
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccessTimeIcon sx={{ mr: 1, color: '#b3b3b3' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Duración
                          </Typography>
                          <Typography variant="subtitle2">
                            {formatDuration(track?.duration_ms)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Popularidad de la pista representada con una barra de progreso */}
                    <Grid xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EqualizerIcon sx={{ mr: 1, color: '#b3b3b3' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                            Popularidad
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={track?.popularity} 
                              sx={{ 
                                width: 100,
                                height: 8,
                                borderRadius: 2,
                                mr: 2,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#1DB954'
                                }
                              }} 
                            />
                            <Typography variant="subtitle2">
                              {track?.popularity}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {/* Botón para abrir la pista en Spotify en una nueva pestaña */}
                  {track?.external_urls && track?.external_urls.spotify && (
                    <Button
                      variant="contained"
                      startIcon={<LaunchIcon />}
                      onClick={() => window.open(track.external_urls.spotify, '_blank')}
                      sx={{ 
                        mt: 4, 
                        bgcolor: '#1DB954', 
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: 8,
                        px: 4,
                        py: 1,
                        '&:hover': {
                          bgcolor: '#1ed760'
                        }
                      }}
                    >
                      Escuchar en Spotify
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default TrackDetail;
