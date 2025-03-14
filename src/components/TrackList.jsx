// components/TrackList.jsx
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const TrackList = ({ tracks, onPlayTrack }) => {
  // Formatear duración de MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="lista de canciones">
        <TableHead>
          <TableRow>
            <TableCell width={50}>#</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Artista</TableCell>
            <TableCell>Álbum</TableCell>
            <TableCell align="right">
              <AccessTimeIcon fontSize="small" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track, index) => (
            <TableRow
              key={track.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .play-button': {
                    opacity: 1,
                  }
                }
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ display: 'block', mr: 1 }}>
                    {index + 1}
                  </Typography>
                  <IconButton
                    className="play-button"
                    size="small"
                    onClick={() => onPlayTrack(track)}
                    sx={{
                      opacity: 0,
                      color: 'white',
                    }}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={track.image} 
                    alt={track.title} 
                    style={{ width: 40, height: 40, marginRight: 10 }}
                  />
                  <Typography>
                    {track.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{track.artist}</TableCell>
              <TableCell>{track.album}</TableCell>
              <TableCell align="right">{formatDuration(track.duration)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TrackList;