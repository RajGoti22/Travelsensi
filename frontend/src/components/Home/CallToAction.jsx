import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button 
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const CallToAction = () => {
  const { user } = useAuth();

  const handleStartPlanning = () => {
    if (user) {
      // For authenticated users, navigate to create new itinerary
      window.location.href = '/create-itinerary';
    } else {
      // For non-authenticated users, navigate to sign up
      window.location.href = '/signup';
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right bottom, rgba(28, 79, 123, 0.52), rgba(18, 63, 108, 0.6)), url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 300,
            textTransform: 'uppercase',
            letterSpacing: '0.2rem',
            mb: 3,
            textShadow: '0 0 10px rgba(0,0,0,0.4)',
          }}
        >
          Start your journey today
        </Typography>
        <Typography
          variant="h5"
          sx={{ 
            mb: 6, 
            fontWeight: 300,
            fontSize: '1.5rem',
            opacity: 0.9,
            textShadow: '0 0 10px rgba(0,0,0,0.4)',
          }}
        >
          Join thousands of travelers who trust TravelSensei for their perfect trips.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'white',
            color: 'white',
            px: 6,
            py: 2,
            borderRadius: '50px',
            fontSize: '1.2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1rem',
            fontWeight: 600,
            borderWidth: '2px',
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              transform: 'translateY(-3px)',
              boxShadow: '0 1rem 2rem rgba(0,0,0,0.2)',
            },
          }}
          onClick={handleStartPlanning}
        >
          {user ? 'Create New Itinerary' : 'Discover Your Adventure'}
        </Button>
      </Container>
    </Box>
  );
};

export default CallToAction;