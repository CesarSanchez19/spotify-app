import React, { useState, useEffect } from 'react';
// Importa funciones de la API de Spotify para obtener el token y realizar búsquedas de canciones
import { getAccessToken, searchTracks } from '../../spotify/api';
// Importa useNavigate para manejar la navegación entre rutas
import { useNavigate } from 'react-router-dom';
// Importa componentes de Material UI para construir la interfaz
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  List,
  ListItem,
  Container, 
  Alert,
  Skeleton,
  Paper,
  Tooltip
} from '@mui/material';
// Importa iconos para mejorar la experiencia visual
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import InfoIcon from '@mui/icons-material/Info';
import DoneIcon from '@mui/icons-material/Done';

const SearchTracks = (props) => {
  // Recibimos props adicionales, incluyendo si es vista previa en la Home, límite de ítems, término de búsqueda por defecto y opción para ocultar la barra de búsqueda
  const { isHomePreview, maxItems, searchTermOverride, hideSearchBar } = props;
  // Determina si se debe ocultar la barra de búsqueda según los props recibidos
  const shouldHideSearchBar = hideSearchBar || isHomePreview;

  // Estados para manejar token, consulta de búsqueda, resultados, error, carga y la canción que se está reproduciendo
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  // useNavigate para redirigir a la página de detalles de la canción
  const navigate = useNavigate();

  // useEffect para obtener el token de acceso al montar el componente
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);
      } catch (err) {
        setError(`Error al obtener token: ${err}`);
      }
    };
    fetchToken();
  }, []);

  // useEffect para realizar una búsqueda automática con un término por defecto
  // Se usa searchTermOverride o "Dragon Ball" como término predeterminado
  useEffect(() => {
    const fetchTracks = async () => {
      if (token) {
        setLoading(true);
        try {
          const defaultTerm = searchTermOverride || 'Dragon Ball';
          const results = await searchTracks(token, defaultTerm);
          setTracks(results);
        } catch (err) {
          setError(`Error al buscar canciones: ${err}`);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTracks();
  }, [token, searchTermOverride]);

  // Función para realizar una búsqueda manual cuando se ingresa un término
  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // No busca si la consulta está vacía
    setLoading(true);
    try {
      const results = await searchTracks(token, searchQuery);
      setTracks(results);
    } catch (err) {
      setError(`Error al buscar canciones: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar la reproducción de la vista previa de una canción
  const togglePlay = (trackId, previewUrl) => {
    if (!previewUrl) return; // Si no hay URL de vista previa, no hace nada

    if (playing === trackId) {
      // Si la canción ya se está reproduciendo, la pausa
      document.getElementById('audio-player').pause();
      setPlaying(null);
    } else {
      // Si otra canción está reproduciéndose, se pausa primero
      if (playing) {
        document.getElementById('audio-player').pause();
      }
      // Se asigna la URL de la vista previa al reproductor y se inicia la reproducción
      const audioPlayer = document.getElementById('audio-player');
      audioPlayer.src = previewUrl;
      audioPlayer.play();
      setPlaying(trackId);
    }
  };

  // Maneja el evento de presionar Enter en el campo de búsqueda
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Función para navegar a la página de detalles de una canción
  const navigateToTrackDetails = (trackId) => {
    navigate(`/tracks/${trackId}`);
  };

  // Función auxiliar para formatear la duración de la canción de milisegundos a minutos:segundos
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Si ocurre un error, se muestra un mensaje de error en un Alert
  if (error) return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Box sx={{ 
      bgcolor: '#121212', 
      minHeight: '100vh', 
      color: 'white',
      pb: 8
    }}>
      {/* Elemento audio oculto para reproducir la vista previa */}
      <audio id="audio-player" onEnded={() => setPlaying(null)} />
      
      <Container maxWidth="lg">
        <Box sx={{ pt: 4, pb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
            Buscar en Spotify
          </Typography>
          
          {/* Mostrar la barra de búsqueda solo si no se debe ocultar */}
          {!shouldHideSearchBar && (
            <Paper 
              sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: '#282828',
                mb: 4,
                borderRadius: 2
              }}
            >
              <TextField
                fullWidth
                placeholder="¿Qué quieres escuchar?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  style: { color: 'white', padding: '8px' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ ml: 1 }}
              />
              <IconButton 
                color="primary" 
                sx={{ p: '10px' }} 
                onClick={handleSearch}
              >
                <SearchIcon sx={{ color: '#1DB954' }} />
              </IconButton>
            </Paper>
          )}

          {/* Si está cargando, se muestran Skeletons para indicar carga */}
          {loading ? (
            <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <ListItem 
                  key={item}
                  sx={{ 
                    p: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" sx={{ width: '24px', textAlign: 'center', mr: 2, color: '#b3b3b3' }}>
                    {item}
                  </Typography>
                  <Skeleton variant="rectangular" width={50} height={50} sx={{ mr: 2 }} />
                  <Box sx={{ width: '100%' }}>
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="25%" height={20} />
                  </Box>
                  <Skeleton variant="text" width="60px" />
                </ListItem>
              ))}
            </List>
          ) : (
            // Si no está cargando, se muestran los resultados en una lista
            <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
              {(maxItems ? tracks.slice(0, maxItems) : tracks).map((track, index) => (
                <ListItem 
                  key={track.id}
                  sx={{ 
                    p: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {/* Muestra el número de la canción en la lista */}
                  <Typography variant="body2" sx={{ 
                    width: '24px', 
                    textAlign: 'center', 
                    mr: 2, 
                    color: '#b3b3b3',
                    fontWeight: 'medium'
                  }}>
                    {index + 1}
                  </Typography>
                  
                  {/* Imagen del álbum de la canción */}
                  <Box 
                    component="img"
                    src={track.album.images[0]?.url || 'https://via.placeholder.com/50'}
                    alt={track.album.name}
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      mr: 2,
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Información principal de la canción: título y artistas */}
                  <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'medium',
                      color: 'white',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {track.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#b3b3b3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {track.artists.map(artist => artist.name).join(', ')}
                    </Typography>
                  </Box>
                  
                  {/* Sección de información adicional y acciones */}
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                    {/* Muestra el nombre del álbum en pantallas medianas o mayores */}
                    <Typography variant="body2" sx={{ 
                      color: '#b3b3b3',
                      mr: 4,
                      display: { xs: 'none', sm: 'block' }
                    }}>
                      {track.album.name}
                    </Typography>
                    
                    {/* Icono que indica que la canción está verificada */}
                    <Tooltip title="Canción verificada">
                      <DoneIcon sx={{ color: '#1DB954', fontSize: '1.2rem', mr: 2 }} />
                    </Tooltip>
                    
                    {/* Botón para navegar a los detalles de la canción */}
                    <Tooltip title="Ver más detalles">
                      <IconButton
                        onClick={() => navigateToTrackDetails(`${track.id}`)}
                        size="small"
                        sx={{ 
                          color: '#b3b3b3',
                          '&:hover': { color: '#1DB954' },
                          mr: 2
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {/* Botón para reproducir o pausar la vista previa */}
                    <IconButton
                      onClick={() => togglePlay(track.id, track.preview_url)}
                      disabled={!track.preview_url}
                      size="small"
                      sx={{ color: track.preview_url ? '#1DB954' : 'grey', mr: 2 }}
                    >
                      {playing === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    
                    {/* Muestra la duración formateada de la canción */}
                    <Typography variant="body2" sx={{ 
                      color: '#b3b3b3',
                      minWidth: '40px',
                      textAlign: 'right'
                    }}>
                      {formatDuration(track.duration_ms)}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SearchTracks;
