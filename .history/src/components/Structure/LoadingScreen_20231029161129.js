import React from 'react';
import { Box, Typography } from '@mui/material';
import AnimatedCircle from '../../media/AnimatedCircle';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <AnimatedCircle />
      <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 1 }}>
        Booking Your Experience
      </Typography>
      <Typography variant="h6">Logging you in...</Typography>
    </Box>
  );
};

export default LoadingScreen;
