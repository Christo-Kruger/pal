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
      minHeight="300px"
    >
      <FindInPageOutlinedIcon style={{ fontSize: 50, color:"364150" }} />
      <Typography variant="h6" gutterBottom>
        Finding Your Bookings...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default FindingBookingsLoadingScreen;
