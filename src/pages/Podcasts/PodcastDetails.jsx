import React, { useState, useEffect } from 'react';
// Importa hooks de React y funciones de React Router para la gestión de parámetros y navegación
import { useParams, useNavigate } from 'react-router-dom';
// Importa funciones de la API de Spotify para obtener datos de podcast y token de acceso
import { getPodcast, getPodcastEpisodes, getAccessToken } from '../../spotify/api';
// Importa componentes y utilidades de Material UI para la construcción de la interfaz
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card, 
  CardMedia, 
  Divider, 
  CircularProgress, 
  Chip,
  IconButton,
  Paper
} from '@mui/material';
// Importa el componente Grid desde Material UI para el layout
import Grid from "@mui/material/Grid2";
// Importa iconos de Material UI para mejorar la experiencia visual
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LaunchIcon from '@mui/icons-material/Launch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// Importa utilidades para el manejo de temas en Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Importa CssBaseline para normalizar estilos CSS
import CssBaseline from '@mui/material/CssBaseline';

// Definición del tema personalizado inspirado en Spotify para aplicar a la app
const spotifyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Verde característico de Spotify
    },
    secondary: {
      main: '#1ED760', // Verde más claro para estados hover
    },
    background: {
      default: '#121212', // Fondo oscuro
      paper: '#181818', // Fondo para componentes tipo card
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  typography: {
    fontFamily: '"Circular", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500, // Botones con forma de píldora (muy redondeados)
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1ED760', // Color de fondo más claro al hacer hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease', // Transición suave para efectos hover
          backgroundColor: '#232323', // Fondo para las cards
          '&:hover': {
            transform: 'translateY(-4px)', // Efecto de elevación al pasar el mouse
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)', // Sombra para resaltar la card
          },
        },
      },
    },
  },
});

// Función auxiliar para formatear la fecha de lanzamiento de los episodios
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Retorna la fecha formateada en español, con día, mes y año
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Función auxiliar para formatear la duración (ms a minutos:segundos)
const formatDuration = (ms) => {
  if (!ms) return '';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  // Asegura que los segundos tengan dos dígitos
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PodcastDetail = () => {
  // Obtiene el parámetro "id" de la URL para identificar el podcast
  const { id } = useParams();
  // Estados para manejar el token, datos del podcast, episodios, carga, error y reproducción de episodio
  const [token, setToken] = useState('');
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  // Hook para la navegación entre rutas
  const navigate = useNavigate();
  
  // Debug: Imprime el token en la consola para verificar su valor
  console.log(token);

  // useEffect para cargar los datos del podcast y sus episodios al montar el componente
  useEffect(() => {
    // Verifica que se haya recibido un ID de podcast, de lo contrario muestra error
    if (!id) {
      console.error('No se recibió ID del podcast');
      setError('ID del podcast no encontrado');
      setLoading(false);
      return;
    }

    // Función asíncrona para obtener el token, datos del podcast y episodios
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtiene el token de acceso a Spotify
        const accessToken = await getAccessToken();
        setToken(accessToken);

        // Obtiene la información del podcast usando el token y el ID
        const podcastData = await getPodcast(accessToken, id);
        // Obtiene los episodios del podcast
        const episodesData = await getPodcastEpisodes(accessToken, id);
        
        // Actualiza los estados con los datos obtenidos
        setPodcast(podcastData);
        // Se asegura que episodesData sea un arreglo, de lo contrario asigna un arreglo vacío
        setEpisodes(Array.isArray(episodesData) ? episodesData : []);
      } catch (error) {
        // Manejo de error si ocurre algún problema al obtener la información
        console.error("Error al cargar el podcast", error);
        setError("No se pudo cargar la información del podcast. Por favor, intenta de nuevo más tarde.");
      } finally {
        // Finaliza el estado de carga sin importar si ocurrió un error o no
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Se ejecuta cada vez que el parámetro "id" cambia

  // Función para alternar el estado de reproducción de un episodio
  const togglePlay = (episodeId) => {
    if (playingEpisode === episodeId) {
      // Si el episodio ya se está reproduciendo, se detiene
      setPlayingEpisode(null);
    } else {
      // Si no se está reproduciendo, se inicia la reproducción del episodio seleccionado
      setPlayingEpisode(episodeId);
    }
  };

  // Función para abrir el episodio en Spotify en una nueva pestaña
  const openInSpotify = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Función para renderizar un mensaje de error en caso de que ocurra alguno
  const renderErrorMessage = () => {
    if (error) {
      return (
        <Box sx={{ 
          bgcolor: 'error.dark', 
          color: 'error.contrastText', 
          p: 2, 
          borderRadius: 2,
          mb: 3 
        }}>
          <Typography>{error}</Typography>
        </Box>
      );
    }
    return null;
  };

  // Renderizado principal del componente
  return (
    <ThemeProvider theme={spotifyTheme}>
      <CssBaseline /> {/* Resetea y normaliza estilos CSS */}
      <Box sx={{ 
        minHeight: '100vh',
        // Si se dispone de una imagen del podcast, se utiliza en el fondo con un degradado; de lo contrario, se utiliza un degradado fijo
        background: podcast?.images?.[0]?.url 
          ? `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212 400px), url(${podcast.images[0].url}) no-repeat top center/cover`
          : 'linear-gradient(to bottom, #3366CC, #121212 30%)'
      }}>
        <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
          {/* Botón para volver a la página anterior */}
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'white', 
              mb: 4,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Volver
          </Button>

          {/* Indicador de carga mientras se obtienen los datos */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            // Si existe un error, se muestra el mensaje correspondiente
            renderErrorMessage()
          ) : podcast ? (
            // Si se han cargado los datos correctamente, se muestra la información del podcast y sus episodios
            <>
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {/* Sección para la imagen del podcast */}
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      mb: { xs: 2, md: 0 }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={podcast.images?.[0]?.url || '/default-podcast.jpg'} // Muestra la imagen del podcast o una imagen por defecto
                      alt={podcast.name}
                      sx={{ 
                        aspectRatio: '1/1',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>
                {/* Sección para la información detallada del podcast */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ pt: { md: 4 } }}>
                    {/* Etiqueta para identificar que es un podcast */}
                    <Chip 
                      label="PODCAST" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.1)', 
                        color: 'white',
                        mb: 1
                      }} 
                    />
                    {/* Título del podcast */}
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{ 
                        mb: 2, 
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 800
                      }}
                    >
                      {podcast.name}
                    </Typography>
                    
                    {/* Información del editor o publicador del podcast */}
                    <Typography 
                      variant="subtitle1" 
                      sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}
                    >
                      {podcast.publisher}
                    </Typography>
                    
                    {/* Botones para reproducir el podcast o abrirlo en Spotify */}
                    <Box sx={{ mb: 4 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => window.open(podcast.external_urls?.spotify, '_blank')}
                        sx={{ mr: 2 }}
                      >
                        Reproducir
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<LaunchIcon />}
                        onClick={() => window.open(podcast.external_urls?.spotify, '_blank')}
                        sx={{ 
                          color: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        Abrir en Spotify
                      </Button>
                    </Box>
                    
                    {/* Descripción del podcast */}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        lineHeight: 1.6,
                        maxWidth: '90%'
                      }}
                    >
                      {podcast.description}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              
              {/* Encabezado para la sección de episodios con un contador si hay episodios */}
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                Episodios
                {episodes.length > 0 && (
                  <Chip 
                    label={episodes.length}
                    size="small"
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  />
                )}
              </Typography>

              {/* Recorre el arreglo de episodios y renderiza cada uno */}
              {episodes.length > 0 ? (
                <Box>
                  {episodes.map((episode, index) => {
                    if (!episode) return null; // Verifica que el episodio exista
                    return (
                      <Card 
                        key={episode.id} 
                        sx={{ 
                          mb: 2, 
                          p: 0,
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'center',
                          transition: 'background-color 0.3s',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'none'
                          }
                        }}
                      >
                        {/* Sección para el número de episodio y botón para reproducir/pausar */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            width: { xs: '100%', sm: '80px' },
                            justifyContent: { xs: 'space-between', sm: 'center' }, 
                            p: 2
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                          >
                            {index + 1}
                          </Typography>
                          <IconButton 
                            onClick={() => togglePlay(episode.id)} 
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
                          >
                            {playingEpisode === episode.id ? <PauseIcon /> : <PlayArrowIcon />}
                          </IconButton>
                        </Box>
                        
                        {/* Sección que muestra la información del episodio */}
                        <Box sx={{ flexGrow: 1, p: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                            {episode.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {episode.description}
                          </Typography>
                          
                          {/* Información adicional del episodio: fecha de lanzamiento y duración */}
                          <Box sx={{ display: 'flex', mt: 2, alignItems: 'center', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(episode.release_date)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {formatDuration(episode.duration_ms)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Botón para abrir el episodio en Spotify, visible en dispositivos medianos o mayores */}
                        <Box sx={{ p: 2, display: { xs: 'none', md: 'block' } }}>
                          <Button
                            size="small"
                            variant="text"
                            endIcon={<LaunchIcon />}
                            onClick={() => openInSpotify(episode.external_urls?.spotify)}
                            sx={{ color: 'text.secondary' }}
                          >
                            Abrir
                          </Button>
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              ) : (
                // Si no hay episodios disponibles, se muestra un mensaje informativo
                <Paper 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2
                  }}
                >
                  <Typography>No hay episodios disponibles</Typography>
                </Paper>
              )}
            </>
          ) : (
            // En caso de error en la carga de datos del podcast, se muestra una interfaz de error
            <Box sx={{ textAlign: 'center', my: 8 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Error al cargar el podcast
              </Typography>
              <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
              >
                Volver al inicio
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PodcastDetail;
