import React from 'react';
import { Box, Typography } from '@mui/material';
import AnimatedCircle from '../../media/AnimatedCircle';
import Logo from './Logo';

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
      <Logo 
        sx={{
          width: 400,
          height: 400,
          marginBottom: 2,
        }}
      
      />
  
      <AnimatedCircle />
      <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 1 }}>
        Welcome to J Lee Preparatory
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
