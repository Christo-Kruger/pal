import React from 'react';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const CannotBook = () => {
  return (
    <Paper elevation={3}>
      <Box display="flex" flexDirection="column" alignItems="center" p={3}>
        <EventBusyIcon color="error" style={{ fontSize: 60 }} />
        <Typography variant="h6" color="textSecondary">
          Cannot Book At This Time
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please try again later or contact support for more information.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CannotBook;
