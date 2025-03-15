import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PeopleIcon from '@mui/icons-material/People';
import { alpha } from '@mui/material/styles';
import { searchArtists, getAccessToken } from '../../spotify/api';

function Artists() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Obtención del token al montar el componente
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

  // Efecto para cargar por defecto artistas famosos si no hay búsqueda
  useEffect(() => {
    const fetchDefaultArtists = async () => {
      if (token && !searchTerm) {
        try {
          setLoading(true);
          // Usamos "a" como término base para obtener muchos artistas
          const results = await searchArtists(token, 'a');
          // Ordenamos por seguidores de mayor a menor
          const sorted = results.sort(
            (a, b) => b.followers.total - a.followers.total
          );
          setArtists(sorted.slice(0, 12)); // Limit to top 12 for better display
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar artistas por defecto:', error);
          setLoading(false);
        }
      }
    };
    fetchDefaultArtists();
  }, [token, searchTerm]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await searchArtists(token, searchTerm);
      setArtists(results);
    } catch (error) {
      setError('Error al buscar artistas. Por favor, intenta de nuevo.');
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
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1DB954',
                },
                boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                height: 56
              }
            }}
          />
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              bgcolor: alpha('#ff5252', 0.15),
              color: '#ff5252',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 8 }}>
            <CircularProgress sx={{ color: '#1DB954' }} size={60} />
          </Box>
        ) : (
          <>
            {!searchTerm && artists.length > 0 && (
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 700,
                  color: '#dddddd', 
                  pl: 1
                }}
              >
                Artistas populares
              </Typography>
            )}
            
            {searchTerm && artists.length > 0 && (
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 700,
                  color: '#fff', 
                  pl: 1
                }}
              >
                Resultados para "{searchTerm}"
              </Typography>
            )}
            
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
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '100%' }}>
                      {artist.images && artist.images.length > 0 ? (
                        <CardMedia
                          component="img"
                          image={artist.images[0].url}
                          alt={artist.name}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s ease',
                            '.MuiCard-root:hover &': {
                              transform: 'scale(1.08)'
                            }
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'linear-gradient(45deg, #333, #222)',
                          }}
                        >
                          <LibraryMusicIcon sx={{ fontSize: 80, color: '#fff' }} />
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                          height: '50%'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color:"#fff",
                        }}
                      >
                        {artist.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon sx={{ fontSize: 16, color: '#ffff', mr: 0.7 }} />
                        <Typography variant="body2" color="text.secondary" style={{color:"white"}}>
                          {artist.followers.total.toLocaleString()} seguidores
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to={`/artist/${artist.id}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          mt: 'auto',
                          bgcolor: alpha('#1DB954', 0.8),
                          color: 'white',
                          borderRadius: 6,
                          textTransform: 'none',
                          fontWeight: 700,
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

              {artists.length === 0 && searchTerm && (
                <Box 
                  sx={{ 
                    width: '100%', 
                    mt: 4, 
                    textAlign: 'center',
                    bgcolor: alpha('#282828', 0.4),
                    borderRadius: 4,
                    p: 8,
                    mx: 4
                  }}
                >
                  <LibraryMusicIcon sx={{ fontSize: 70, color: '#b3b3b3', mb: 3, opacity: 0.6 }} />
                  <Typography variant="h5" sx={{ color: '#b3b3b3' }}>
                    No se encontraron artistas con "{searchTerm}"
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#909090', mt: 1 }}>
                    Intenta con otro nombre o verifica la ortografía
                  </Typography>
                </Box>
              )}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

export default Artists;