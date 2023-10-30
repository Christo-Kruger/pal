import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';

const FindingBookingsLoadingScreen = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
    >
      <AutoDeleteIcon style={{ fontSize: 50, color:"364150"}} />
      <Typography variant="h6" gutterBottom>
        Deleting
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default FindingBookingsLoadingScreen;