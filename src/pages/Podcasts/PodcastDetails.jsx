import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPodcast, getPodcastEpisodes, getAccessToken } from '../../spotify/api';
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
  Avatar,
  IconButton,
  Paper
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LaunchIcon from '@mui/icons-material/Launch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const spotifyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify green
    },
    secondary: {
      main: '#1ED760', // Lighter green for hover states
    },
    background: {
      default: '#121212', // Spotify dark background
      paper: '#181818', // Spotify card background
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
          borderRadius: 500, // Pill-shaped buttons
          padding: '8px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1ED760', // Lighter green on hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease',
          backgroundColor: '#232323',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          },
        },
      },
    },
  },
});

// Helper function to format release date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Helper function to format duration
const formatDuration = (ms) => {
  if (!ms) return '';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PodcastDetail = () => {
  // State management using useState 🛠️
  const { id } = useParams();
  const [token, setToken] = useState('');
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const navigate = useNavigate();
  
  console.log(token)

  // Side effect handling with useEffect ⏳
  useEffect(() => {
    if (!id) {
      console.error('No se recibió ID del podcast');
      setError('ID del podcast no encontrado');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);

        const podcastData = await getPodcast(accessToken, id);
        const episodesData = await getPodcastEpisodes(accessToken, id);
        
        setPodcast(podcastData);
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Error al cargar el podcast", error);
        setError("No se pudo cargar la información del podcast. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
}, [id]); // Dependencia corregida


  // Toggle playing state for episodes
  const togglePlay = (episodeId) => {
    if (playingEpisode === episodeId) {
      setPlayingEpisode(null);
    } else {
      setPlayingEpisode(episodeId);
    }
  };

  // Handler to open episode in Spotify
  const openInSpotify = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Conditional rendering for error messages ❓
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

  return (
    <ThemeProvider theme={spotifyTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: podcast?.images?.[0]?.url 
          ? `linear-gradient(to bottom, rgba(0,0,0,0.8), #121212 400px), url(${podcast.images[0].url}) no-repeat top center/cover`
          : 'linear-gradient(to bottom, #3366CC, #121212 30%)'
      }}>
        <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
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

          {/* Conditional loading indicator ❓ */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            renderErrorMessage()
          ) : podcast ? (
            <>
              <Grid container spacing={4} sx={{ mb: 6 }}>
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
                      image={podcast.images?.[0]?.url || '/default-podcast.jpg'}
                      alt={podcast.name}
                      sx={{ 
                        aspectRatio: '1/1',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ pt: { md: 4 } }}>
                    <Chip 
                      label="PODCAST" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.1)', 
                        color: 'white',
                        mb: 1
                      }} 
                    />
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
                    
                    <Typography 
                      variant="subtitle1" 
                      sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}
                    >
                      {podcast.publisher}
                    </Typography>
                    
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

              {/* Map through episodes array 🗺️ 📊 */}
              {episodes.length > 0 ? (
                <Box>
                  {episodes.map((episode, index) => (
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
                  ))}
                </Box>
              ) : (
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