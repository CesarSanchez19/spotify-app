import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccessToken, getTrack } from '../../spotify/api';
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
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LaunchIcon from '@mui/icons-material/Launch';

const TrackDetail = () => {
  // Use React Router params to get track ID 🗺️
  const { id } = useParams();
  
  // UseState hooks for component state 🛠️
  const [token, setToken] = useState('');
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(null);
  
  const navigate = useNavigate();

  console.log(token)

// Fetch token and track data on component mount ⏳
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      setToken(accessToken);

      const trackData = await getTrack(accessToken, id);
      setTrack(trackData);
    } catch (err) {
      setError(`Error al cargar los detalles de la canción: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  // Cleanup function to handle audio player
  return () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
      setProgress(0);
      audioPlayer.src = '';
    }
  };
}, [id, audioPlayer]); // Agregamos las dependencias correctas


// Set up audio player and progress updates ⏳
useEffect(() => {
  if (!track?.preview_url) return;

  const audio = new Audio(track.preview_url);
  setAudioPlayer(audio);

  const handleTimeUpdate = () => {
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // Add event listeners for audio
  audio.addEventListener('timeupdate', handleTimeUpdate);
  audio.addEventListener('ended', handleEnded);

  // Cleanup function
  return () => {
    audio.pause();
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleEnded);
  };
}, [track]); // Se ejecuta solo cuando cambia la pista cargada


  // Function to update progress bar
  const updateProgress = () => {
    if (audioPlayer) {
      const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      setProgress(percentage);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioPlayer) return;
    
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

    
  console.log(updateProgress)
  // Format milliseconds to minutes:seconds
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Conditional rendering for error state ❓
  if (error) return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Box sx={{ 
      bgcolor: '#121212', 
      backgroundImage: track ? `linear-gradient(180deg, rgba(29,185,84,0.8) 0%, rgba(18,18,18,1) 25%)` : 'none',
      minHeight: '100vh', 
      color: 'white',
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 4 }}>
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
            // Loading skeleton
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
            // Track detail content
            <Grid container spacing={4}>
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
                    image={track?.album.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={track?.name}
                    sx={{ width: '100%' }}
                  />
                  {track?.preview_url && (
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
              
              <Grid xs={12} md={8}>
                <Box>
                  <Chip 
                    label="CANCIÓN" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      color: 'white',
                      mb: 1
                    }} 
                  />
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {track?.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#b3b3b3', mb: 3 }}>
                    {track?.artists.map((artist) => artist.name).join(', ')}
                  </Typography>
                  
                  {track?.preview_url && (
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
                  
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 3 }} />
                  
                  <Grid container spacing={3}>
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