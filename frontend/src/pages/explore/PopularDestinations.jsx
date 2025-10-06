import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { Star, LocationOn } from '@mui/icons-material';

const DestinationCard = ({ destination, onSelect }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={() => onSelect(destination)}
    >
      <CardMedia
        component="img"
        height="200"
        image={destination.image}
        alt={destination.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {destination.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: '40px' }}
        >
          {destination.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Star sx={{ color: '#ffd700', fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {destination.rating}
          </Typography>
          <Chip
            size="small"
            label={`${destination.recommendationCount} recommendations`}
            sx={{ ml: 'auto' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const PopularDestinations = ({ destinations, onDestinationSelect }) => {
  return (
    <Grid container spacing={3}>
      {destinations.map((destination, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <DestinationCard 
            destination={destination} 
            onSelect={onDestinationSelect}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PopularDestinations;