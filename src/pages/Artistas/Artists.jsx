import React, { useState, useEffect } from 'react';
// Importa Link para la navegación interna
import { Link } from 'react-router-dom';
// Importa componentes de Material UI para estructurar la interfaz
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  TextField, 
  CircularProgress, 
  Alert,
  Container,
  InputAdornment,
  Grid
} from '@mui/material';
// Importa iconos para mejorar la experiencia visual
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
// Importa función alpha para ajustar opacidades
import { alpha } from '@mui/material/styles';
// Importa funciones de la API de Spotify para buscar artistas y obtener el token
import { searchArtists, getAccessToken } from '../../spotify/api';

function Artists({ isHomePreview = false, maxItems, searchTermOverride, hideSearchBar }) {
  // Determina si se debe ocultar la barra de búsqueda basado en las propiedades recibidas
  const shouldHideSearchBar = hideSearchBar || isHomePreview;

  // Estados para gestionar el término de búsqueda, la lista de artistas, carga, errores y token
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Efecto para obtener el token de acceso al montar el componente
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);
      } catch (error) {
        setError('Error al obtener el token de acceso');
        console.error('Error al obtener token:', error);
      }
    };
    fetchToken();
  }, []);

  // Efecto para cargar artistas por defecto cuando no hay término de búsqueda ingresado
  useEffect(() => {
    const fetchDefaultArtists = async () => {
      if (token && !searchTerm) {
        try {
          setLoading(true);
          // Usa searchTermOverride o 'a' como término por defecto
          const defaultQuery = searchTermOverride || 'a';
          const results = await searchArtists(token, defaultQuery);
          // Ordena los resultados según el número de seguidores (de mayor a menor)
          const sorted = results.sort((a, b) => b.followers.total - a.followers.total);
          // Limita la cantidad de artistas mostrados según maxItems o 12 si no se especifica
          setArtists(maxItems ? sorted.slice(0, maxItems) : sorted.slice(0, 12));
        } catch (error) {
          console.error('Error al cargar artistas por defecto:', error);
          setError('No se pudieron cargar los artistas populares.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDefaultArtists();
  }, [token, searchTerm, searchTermOverride, maxItems]);

  // Función que se ejecuta al enviar el formulario de búsqueda
  const handleSearch = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    if (!searchTerm.trim()) return; // No realiza búsqueda si el campo está vacío
    setLoading(true);
    setError(null);
    try {
      const results = await searchArtists(token, searchTerm);
      setArtists(results);
    } catch (error) {
      setError('Error al buscar artistas. Intenta de nuevo.');
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)',
        color: '#fff',
        pt: 6,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Título principal de la página */}
        <Typography 
          variant="h2" 
          align="center" 
          sx={{ 
            mb: 6, 
            fontWeight: 900,
            letterSpacing: -1,
            background: 'linear-gradient(90deg, #1DB954, #1ED760)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '0px 4px 8px rgba(0,0,0,0.4)'
          }}
        >
          Descubre Tus Artistas
        </Typography>

        {/* Renderiza la barra de búsqueda solo si no se debe ocultar */}
        {!shouldHideSearchBar && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            <TextField
              fullWidth
              placeholder="Buscar un artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#b3b3b3' }} />
                  </InputAdornment>
                ),
                // Se añade un botón de búsqueda al final del campo
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disableElevation
                      sx={{ 
                        bgcolor: '#1DB954', 
                        borderRadius: 5,
                        px: 3,
                        py: 1,
                        '&:hover': {
                          bgcolor: '#1ED760',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
                    </Button>
                  </InputAdornment>
                ),
                sx: { 
                  bgcolor: alpha('#2a2a2a', 0.8),
                  borderRadius: 5,
                  color: '#fff',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                  height: 56
                }
              }}
            />
          </Box>
        )}

        {/* Si ocurre algún error, se muestra un Alert con el mensaje */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, color: '#ff5252', maxWidth: 600, mx: 'auto' }}>
            {error}
          </Alert>
        )}

        {/* Si el contenido está cargando, se muestra un indicador de carga */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 8 }}>
            <CircularProgress sx={{ color: '#1DB954' }} size={60} />
          </Box>
        ) : (
          // Si la carga ha finalizado, se muestran los artistas en un grid
          <Grid container spacing={3}>
            {artists.map((artist) => (
              <Grid item key={artist.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    bgcolor: alpha('#282828', 0.7),
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      bgcolor: '#282828',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.4)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Muestra la imagen del artista; si no existe, se muestra una imagen por defecto */}
                  <CardMedia
                    component="img"
                    image={artist.images?.[0]?.url || 'https://via.placeholder.com/150'}
                    alt={artist.name}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <CardContent>
                    {/* Nombre del artista */}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                      {artist.name}
                    </Typography>
                    {/* Muestra el número de seguidores con un icono */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: '#b3b3b3', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                        {artist.followers.total.toLocaleString()} seguidores
                      </Typography>
                    </Box>
                    {/* Botón para navegar al perfil del artista */}
                    <Button
                      component={Link}
                      to={`/artists/${artist.id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        bgcolor: alpha('#1DB954', 0.8),
                        color: 'white',
                        borderRadius: 6,
                        textTransform: 'none',
                        fontWeight: 700,
                        marginTop: "23px",
                        py: 1,
                        '&:hover': {
                          bgcolor: '#1DB954',
                          transform: 'scale(1.03)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Artists;
