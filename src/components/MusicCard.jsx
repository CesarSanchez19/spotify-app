// components/MusicCard.jsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton,
  Box
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const MusicCard = ({ item, onPlay }) => {
  return (
    <Card 
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        '&:hover .play-button': {
          opacity: 1,
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="170"
          image={item.image}
          alt={item.title}
        />
        <IconButton
          className="play-button"
          onClick={() => onPlay(item)}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: '#1DB954',
            color: 'white',
            opacity: 0,
            transition: 'opacity 0.3s',
            '&:hover': {
              backgroundColor: '#1DB954',
              transform: 'scale(1.1)',
            }
          }}
        >
          <PlayArrowIcon />
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1, bgcolor: '#181818' }}>
        <Typography variant="h6" component="div" noWrap>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description || item.artist}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MusicCard;