import { useState, useEffect } from 'react';
import { getAccessToken, searchPodcasts } from '../../spotify/api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import SearchIcon from '@mui/icons-material/Search';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoIcon from '@mui/icons-material/Info';
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
      fontSize: '1.1rem', // Larger heading for card titles
    },
    body2: {
      fontSize: '0.95rem', // Larger text for descriptions
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.85rem', // Larger text for buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500, // Pill-shaped buttons
          padding: '6px 16px', // Standard padding for buttons
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
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          },
          width: '100%', // Make sure card takes full width
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 500,
            backgroundColor: '#2A2A2A',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1DB954',
            },
          },
        },
      },
    },
  },
});

const SearchPodcasts = (props) => {
  // Recibir los props adicionales
  const { isHomePreview, maxItems, searchTermOverride, hideSearchBar } = props;
  const shouldHideSearchBar = hideSearchBar || isHomePreview;
  
  const [token, setToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1) OBTENCIÓN DEL TOKEN (efecto separado)
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);
        localStorage.setItem('spotify_access_token', accessToken);
      } catch (err) {
        console.error('Error al obtener token:', err);
        setError('No se pudo conectar con Spotify. Por favor, intenta de nuevo más tarde.');
      }
    };
    fetchToken();
  }, []);

  // 2) BÚSQUEDA AUTOMÁTICA CUANDO YA TENEMOS TOKEN
  useEffect(() => {
    const fetchDefaultPodcasts = async () => {
      if (token) {
        setLoading(true);
        setError(null);
        try {
          // Uso de searchTermOverride o "clase libre" como término predeterminado
          const defaultTerm = searchTermOverride || 'clase libre';
          const podcasts = await searchPodcasts(token, defaultTerm);
          setResults(podcasts);
        } catch (err) {
          console.error('Error al buscar podcasts:', err);
          setError('Ocurrió un error al buscar podcasts. Por favor, intenta de nuevo.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDefaultPodcasts();
  }, [token, searchTermOverride]);

  // Reutilizamos la misma función para búsquedas manuales
  const performSearch = async (term) => {
    if (term && token) {
      setLoading(true);
      setError(null);
      try {
        const podcasts = await searchPodcasts(token, term);
        setResults(podcasts);
      } catch (err) {
        console.error('Error al buscar podcasts:', err);
        setError('Ocurrió un error al buscar podcasts. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Event handler de búsqueda manual
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return; // No buscar si el campo está vacío
    await performSearch(searchTerm);
  };

  // Navigation handler
  const viewPodcastDetails = (podcastId) => {
    if (!podcastId) {
      console.error('ID del podcast no encontrado');
      return;
    }
    navigate(`${podcastId}`);
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
        background: 'linear-gradient(to bottom, #3366CC, #121212 30%)'
      }}>
        <Container maxWidth="lg" sx={{ pt: 3, pb: 10 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mt: 3, 
              mb: 4, 
              color: '#FFFFFF',
              textAlign: 'center'
            }}
          >
            Descubre Podcasts en Spotify
          </Typography>
          
          {/* Mostrar la barra de búsqueda solo si no se debe ocultar */}
          {!shouldHideSearchBar && (
            <Box 
              component="form" 
              onSubmit={handleSearch} 
              sx={{ 
                mb: 5, 
                display: 'flex', 
                gap: 1,
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              <TextField
                fullWidth
                placeholder="¿Qué quieres escuchar hoy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#B3B3B3' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  input: { color: '#FFFFFF' },
                  label: { color: '#B3B3B3' }
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={!token || loading}
                sx={{ px: 4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
              </Button>
            </Box>
          )}

          {renderErrorMessage()}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          )}

          {/* Three cards in a row with full width */}
          <Grid container spacing={3} sx={{ width: '100%' }}>
            {(maxItems ? results.slice(0, maxItems) : results).map((podcast) => (
              <Grid item xs={12} sm={6} md={4} key={podcast.id} sx={{ width: '100%' }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  width: '100%', // Ensure full width
                }}>
                  <CardMedia
                    component="img"
                    image={podcast.images?.[0]?.url || 'default-podcast.jpg'}
                    alt={podcast.name}
                    sx={{ 
                      height: 180, // Slightly taller image
                      objectFit: 'cover',
                      width: '100%', // Full width image
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        color: 'text.primary',
                        mb: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        lineHeight: 1.3,
                      }}
                    >
                      {podcast.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.95rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {podcast.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button 
                      size="medium"
                      startIcon={<InfoIcon />}
                      onClick={() => viewPodcastDetails(`/podcasts/${podcast.id}`)}
                      sx={{ 
                        color: 'text.primary',
                        fontSize: '0.85rem',
                      }}
                    >
                      Ver detalles
                    </Button>
                    <Button 
                      size="medium"
                      variant="outlined"
                      color="primary"
                      startIcon={<LaunchIcon />}
                      onClick={() => window.open(podcast.external_urls.spotify, '_blank')}
                      sx={{
                        fontSize: '0.85rem',
                      }}
                    >
                      Abrir en Spotify
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Render conditional when no results */}
          {results.length === 0 && !loading && !error && (
            <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No se encontraron resultados
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Intenta con otra búsqueda o revisa tu conexión
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SearchPodcasts;
