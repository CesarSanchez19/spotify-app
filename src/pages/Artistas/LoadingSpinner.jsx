import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <CircularProgress color="inherit" />
      <Typography sx={{ mt: 2 }}>Cargando...</Typography>
    </Box>
  );
}

export default LoadingSpinner;
