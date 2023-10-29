import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block';

const CannotBookCard = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="200"
        image="https://www.example.com/path/to/image.jpg" // Replace with your image URL
        alt="Cannot book"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Cannot Book
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You currently do not have the ability to make a booking.
        </Typography>
      </CardContent>
      <CardContent>
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={<BlockIcon />}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default CannotBookCard;
