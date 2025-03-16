// Importación de hooks y utilidades de React
import { useState, useEffect } from 'react';
// Hook para la navegación entre rutas
import { useNavigate } from 'react-router-dom';
// Importación de componentes y utilidades de Material UI para el diseño
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress,
  Alert,
} from '@mui/material';
// Importación para definir y aplicar un tema personalizado en Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Componente para normalizar estilos CSS de Material UI
import CssBaseline from '@mui/material/CssBaseline';
// Importación de iconos de Material UI para usar en botones y encabezados
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import PeopleIcon from '@mui/icons-material/People';
// Función para obtener el token de acceso de Spotify desde la API
import { getAccessToken } from '../../spotify/api';

// Importamos componentes reutilizables para diferentes secciones de la app
import SearchPodcasts from "../Podcasts/SearchPodcasts";
import Artists from "../Artistas/Artists";
import SearchTracks from "../Tracks/SearchTracks";

// Definición de un tema personalizado para la aplicación, inspirado en Spotify
const spotifyTheme = createTheme({
  palette: {
    mode: 'dark', // Modo oscuro
    primary: {
      main: '#1DB954', // Verde característico de Spotify
    },
    secondary: {
      main: '#1ED760', // Verde más claro para estados hover
    },
    background: {
      default: '#121212', // Fondo oscuro para la app
      paper: '#181818', // Fondo para componentes tipo "card"
    },
    text: {
      primary: '#FFFFFF', // Texto principal en blanco
      secondary: '#B3B3B3', // Texto secundario en gris claro
    },
  },
  typography: {
    fontFamily: '"Circular", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      fontSize: '3.5rem', // Tamaño para títulos principales
    },
    h4: {
      fontWeight: 700, // Peso para subtítulos o encabezados menores
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500, // Botones con bordes muy redondeados
          padding: '8px 20px', // Espaciado interno del botón
        },
      },
    },
  },
});

// Componente para renderizar el encabezado de cada sección con título, icono y botón "Ver todo"
const SectionHeader = ({ icon, title, viewAllPath, navigate }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 2,
    mt: 4
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {icon} {/* Renderizado del icono de la sección */}
      <Typography variant="h5" sx={{ ml: 1, fontWeight: 700 }}>
        {title} {/* Título de la sección */}
      </Typography>
    </Box>
    <Button 
      variant="text" 
      color="primary" 
      endIcon={<KeyboardArrowRightIcon />} // Icono de flecha para indicar navegación
      onClick={() => navigate(viewAllPath)} // Navega a la ruta completa de la sección
      sx={{ fontWeight: 600 }}
    >
      Ver todo {/* Texto del botón */}
    </Button>
  </Box>
);

// Componente para envolver cada sección, incluyendo encabezado y contenido
const Section = ({ title, icon, path, children }) => {
  // Hook para la navegación dentro del componente
  const navigate = useNavigate();
  
  return (
    <Box sx={{ mb: 6 }}>
      <SectionHeader 
        title={title} 
        icon={icon} 
        viewAllPath={path} 
        navigate={navigate} 
      />
      {children} {/* Contenido específico de cada sección */}
    </Box>
  );
};

// Componente principal Home que agrupa todas las secciones de la página principal
const Home = () => {
  // Estados para manejar el token, estado de carga y posibles errores
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Hook para navegar a otras rutas
  const navigate = useNavigate();

  // Debug: Imprime el token y la función de navegación en la consola
  console.log(token)
  console.log(navigate)
  
  // useEffect para obtener el token de acceso desde la API de Spotify
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Solicita el token de acceso y lo guarda en el estado
        const accessToken = await getAccessToken();
        setToken(accessToken);
        // Almacena el token en el almacenamiento local para uso futuro
        localStorage.setItem('spotify_access_token', accessToken);
        setLoading(false); // Finaliza el estado de carga
      } catch (err) {
        // Manejo de error si falla la obtención del token
        console.error('Error al obtener token:', err);
        setError('No se pudo conectar con Spotify. Por favor, intenta de nuevo más tarde.');
        setLoading(false); // Finaliza el estado de carga aun cuando haya error
      }
    };
    fetchToken();
  }, []);

  // useEffect para redirigir al usuario a la ruta de login si no se obtuvo el token
  useEffect(() => {
    if (!loading && !token) {
      navigate('/login');
    }
  }, [loading, token, navigate]);

  // Función para renderizar un mensaje de error en caso de ocurrir alguno
  const renderErrorMessage = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error} {/* Muestra el mensaje de error */}
        </Alert>
      );
    }
    return null;
  };

  // Renderizado principal del componente Home
  return (
    <ThemeProvider theme={spotifyTheme}>
      <CssBaseline /> {/* Aplica estilos globales y resetea el CSS */}
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #1a2a6c, #121212 30%)' // Fondo con degradado
      }}>
        <Container maxWidth="lg" sx={{ pt: 6, pb: 10 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mt: 3, 
              mb: 4, 
              color: '#FFFFFF',
              textAlign: 'center',
              background: 'linear-gradient(90deg, #1DB954, #1ED760)', // Degradado en el texto
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              textShadow: '0px 4px 8px rgba(0,0,0,0.4)' // Sombra en el texto para efecto de profundidad
            }}
          >
            Spotify Explorer {/* Título principal de la página */}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              mb: 6, 
              color: '#B3B3B3',
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            Explora tus artistas favoritos, descubre música nueva y sumérgete en el mundo de los podcasts. Todo en un solo lugar.
            {/* Descripción introductoria de la aplicación */}
          </Typography>

          {renderErrorMessage()}

          {loading ? (
            // Muestra un spinner de carga mientras se obtiene el token
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress size={60} color="primary" />
            </Box>
          ) : (
            <Box>
              {/* Sección de Artistas con propiedades para mostrar una vista previa */}
              <Section 
                title="Artistas Destacados" 
                icon={<PeopleIcon color="primary" fontSize="large" />}
                path="/artists"
              >
                <Box sx={{ maxHeight: '550px', overflow: 'hidden' }}>
                  <Artists 
                    isHomePreview={true} 
                    maxItems={4} 
                    searchTermOverride="pop"
                    hideSearchBar={true}
                  />
                </Box>
              </Section>

              {/* Sección de Podcasts con propiedades para mostrar una vista previa */}
              <Section 
                title="Podcasts Recomendados" 
                icon={<PodcastsIcon color="primary" fontSize="large" />}
                path="/podcasts"
              >
                <Box sx={{ maxHeight: '900px', overflow: 'hidden' }}>
                  <SearchPodcasts 
                    isHomePreview={true} 
                    maxItems={4}
                    searchTermOverride="clase libre"
                    hideSearchBar={true}
                  />
                </Box>
              </Section>

              {/* Sección de Tracks con propiedades para mostrar una vista previa */}
              <Section 
                title="Canciones Populares" 
                icon={<MusicNoteIcon color="primary" fontSize="large" />}
                path="/tracks"
              >
                <Box sx={{ maxHeight: '600px', overflow: 'hidden' }}>
                  <SearchTracks 
                    isHomePreview={true} 
                    maxItems={5}
                    searchTermOverride="pop hits"
                    hideSearchBar={true}
                  />
                </Box>
              </Section>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
