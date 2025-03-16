// Importamos hooks de React para gestionar estado y efectos secundarios
import { useState, useEffect } from 'react';
// Importamos funciones de la API de Spotify para obtener el token y realizar búsquedas de podcasts
import { getAccessToken, searchPodcasts } from '../../spotify/api';
// Importamos Link de react-router-dom para navegación interna
import { Link } from 'react-router-dom';
// Importamos componentes de Material UI para construir la interfaz
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
// Importamos el componente Grid para estructurar el layout de los resultados
import Grid from "@mui/material/Grid2";
// Importamos iconos de Material UI para mejorar la experiencia visual del usuario
import SearchIcon from '@mui/icons-material/Search';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoIcon from '@mui/icons-material/Info';
// Importamos utilidades para la gestión de temas en Material UI y normalización de estilos CSS
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Definición de un tema personalizado inspirado en Spotify para la aplicación
const spotifyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Color verde característico de Spotify
    },
    secondary: {
      main: '#1ED760', // Verde más claro para estados hover
    },
    background: {
      default: '#121212', // Fondo oscuro de Spotify
      paper: '#181818', // Fondo para componentes tipo "card"
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
      fontSize: '1.1rem', // Tamaño mayor para títulos de las cards
    },
    body2: {
      fontSize: '0.95rem', // Tamaño mayor para descripciones
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.85rem', // Tamaño mayor para el texto de los botones
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500, // Botones con forma de píldora (muy redondeados)
          padding: '6px 16px', // Padding estándar para botones
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1ED760', // Verde más claro al hacer hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease', // Transición suave para efectos hover
          '&:hover': {
            transform: 'translateY(-4px)', // Efecto de elevación al pasar el mouse
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)', // Sombra para resaltar la card
          },
          width: '100%', // Asegura que la card ocupe todo el ancho disponible
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 500, // Bordes redondeados en el campo de texto
            backgroundColor: '#2A2A2A', // Fondo oscuro para el TextField
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1DB954', // Cambio de color en el borde al hacer hover
            },
          },
        },
      },
    },
  },
});

// Componente funcional SearchPodcasts para buscar y mostrar podcasts
const SearchPodcasts = (props) => {
  // Recibimos props adicionales para configurar la vista del componente
  const { isHomePreview, maxItems, searchTermOverride, hideSearchBar } = props;
  // Determina si se debe ocultar la barra de búsqueda, ya sea por configuración o vista previa en la home
  const shouldHideSearchBar = hideSearchBar || isHomePreview;
  
  // Estados para gestionar token, término de búsqueda, resultados, carga y errores
  const [token, setToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1) OBTENCIÓN DEL TOKEN: se ejecuta al montar el componente
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Solicita el token de acceso a Spotify
        const accessToken = await getAccessToken();
        setToken(accessToken);
        // Guarda el token en el almacenamiento local para uso futuro
        localStorage.setItem('spotify_access_token', accessToken);
      } catch (err) {
        // En caso de error, lo muestra en consola y actualiza el estado de error
        console.error('Error al obtener token:', err);
        setError('No se pudo conectar con Spotify. Por favor, intenta de nuevo más tarde.');
      }
    };
    fetchToken();
  }, []);

  // 2) BÚSQUEDA AUTOMÁTICA: se ejecuta cuando ya se dispone del token
  useEffect(() => {
    const fetchDefaultPodcasts = async () => {
      if (token) {
        setLoading(true);
        setError(null);
        try {
          // Usa searchTermOverride o "clase libre" como término predeterminado para la búsqueda
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

  // Función para realizar búsquedas manuales utilizando el término ingresado
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

  // Manejador del evento de búsqueda manual, evitando búsquedas vacías
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return; // No realizar búsqueda si el campo está vacío
    await performSearch(searchTerm);
  };

  // Función para renderizar un mensaje de error en caso de que ocurra algún problema
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
        background: 'linear-gradient(to bottom, #3366CC, #121212 30%)'
      }}>
        <Container maxWidth="lg" sx={{ pt: 3, pb: 10 }}>
          {/* Título principal de la sección */}
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
          
          {/* Se muestra la barra de búsqueda solo si no se debe ocultar */}
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

          {/* Renderiza un mensaje de error si existe */}
          {renderErrorMessage()}

          {/* Indicador de carga para mostrar mientras se obtienen resultados */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          )}

          {/* Renderiza los resultados en un layout de tres tarjetas por fila */}
          <Grid container spacing={3} sx={{ width: '100%' }}>
            {(maxItems ? results.slice(0, maxItems) : results).map((podcast) => (
              <Grid item xs={12} sm={6} md={4} key={podcast.id} sx={{ width: '100%' }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  width: '100%', // Asegura que la card ocupe todo el ancho disponible
                }}>
                  {/* Imagen representativa del podcast */}
                  <CardMedia
                    component="img"
                    image={podcast.images?.[0]?.url || 'default-podcast.jpg'}
                    alt={podcast.name}
                    sx={{ 
                      height: 180, // Imagen con altura definida
                      objectFit: 'cover',
                      width: '100%', // Imagen a ancho completo
                    }}
                  />
                  {/* Contenido principal de la card: título y descripción */}
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
                  {/* Acciones disponibles para cada podcast: ver detalles o abrir en Spotify */}
                  <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button 
                      size="medium"
                      startIcon={<InfoIcon />}
                      component={Link}
                      to={`/podcasts/${podcast.id}`}
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
          
          {/* Renderizado condicional en caso de no haber resultados y no estar en estado de carga ni error */}
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
