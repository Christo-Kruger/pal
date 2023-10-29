import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';

const FindingBookingsLoadingScreen = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <FindInPageOutlinedIcon style={{ fontSize: 50 }} />
      <Typography variant="h6" gutterBottom>
        Finding Your Bookings...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default FindingBookingsLoadingScreen;
