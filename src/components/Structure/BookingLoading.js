import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';

const FindingBookingsLoadingScreen = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
    >
      <ScheduleIcon style={{ fontSize: 50 }} />
      <Typography variant="h6" gutterBottom>
        Bookings...
      </Typography>
      <CircularProgress />
    </Box>
  );
};

export default FindingBookingsLoadingScreen;