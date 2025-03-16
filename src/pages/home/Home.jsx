import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import PeopleIcon from '@mui/icons-material/People';
import { getAccessToken } from '../../spotify/api';

// Importamos los componentes originales para reutilizarlos con props
import SearchPodcasts from "../Podcasts/SearchPodcasts";
import Artists from "../Artistas/Artists";
import SearchTracks from "../Tracks/SearchTracks";

// Tema personalizado para Spotify
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
    h1: {
      fontWeight: 900,
      fontSize: '3.5rem',
    },
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 500,
          padding: '8px 20px',
        },
      },
    },
  },
});

// Componente de sección para reutilizar en la página principal
const SectionHeader = ({ icon, title, viewAllPath, navigate }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    mb: 2,
    mt: 4
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <Typography variant="h5" sx={{ ml: 1, fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
    <Button 
      variant="text" 
      color="primary" 
      endIcon={<KeyboardArrowRightIcon />}
      onClick={() => navigate(viewAllPath)}
      sx={{ fontWeight: 600 }}
    >
      Ver todo
    </Button>
  </Box>
);

// Componente para envolver cada sección con su encabezado
const Section = ({ title, icon, path, children }) => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ mb: 6 }}>
      <SectionHeader 
        title={title} 
        icon={icon} 
        viewAllPath={path} 
        navigate={navigate} 
      />
      {children}
    </Box>
  );
};

// Componente principal Home
const Home = () => {
  // Estado de uso 🛠️
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log(token)
  console.log(navigate)
  // useEffect para obtener el token ⏳
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);
        localStorage.setItem('spotify_access_token', accessToken);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener token:', err);
        setError('No se pudo conectar con Spotify. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Renderizado condicional para mensajes de error ❓
  const renderErrorMessage = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={spotifyTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #1a2a6c, #121212 30%)'
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
              background: 'linear-gradient(90deg, #1DB954, #1ED760)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              textShadow: '0px 4px 8px rgba(0,0,0,0.4)'
            }}
          >
            Spotify Explorer
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
          </Typography>

          {renderErrorMessage()}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress size={60} color="primary" />
            </Box>
          ) : (
            <Box>
              {/* Sección de Artistas con props - Solo mostrar cards */}
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

              {/* Sección de Podcasts con props - Solo mostrar cards */}
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

              {/* Sección de Tracks con props - Solo mostrar cards */}
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