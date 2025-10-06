import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const isHealthy = await apiService.healthCheck();
      console.log('Backend health check:', isHealthy ? 'Connected ✅' : 'Failed ❌');
      alert(isHealthy ? 'Backend Connected ✅' : 'Backend Connection Failed ❌');
    } catch (error) {
      console.error('Backend connection error:', error);
      alert('Backend Connection Failed ❌');
    }
  };

  const handleStartPlanning = () => {
    if (user) {
      navigate('/itinerary/create');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        background: 'linear-gradient(to right bottom, rgba(30, 136, 229, 0.1), rgba(25, 118, 210, 0.3)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'polygon(0 0, 100% 0, 100% 75vh, 0 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            animation: 'moveInBottom 1s ease-out 0.75s both',
            '@keyframes moveInBottom': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
              fontWeight: 300,
              letterSpacing: '1rem',
              textTransform: 'uppercase',
              mb: 2,
              textShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)',
              animation: 'moveInLeft 1s ease-out',
              '@keyframes moveInLeft': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-100px)',
                },
                '80%': {
                  transform: 'translateX(10px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            TravelSensei
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem', lg: '2.5rem' },
              fontWeight: 400,
              letterSpacing: '0.5rem',
              mb: 6,
              textShadow: '0 0.5rem 1rem rgba(0,0,0,0.4)',
              animation: 'moveInRight 1s ease-out',
              '@keyframes moveInRight': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(100px)',
                },
                '80%': {
                  transform: 'translateX(-10px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            Your AI Travel Companion
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              onClick={handleStartPlanning}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                textShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.4)',
                letterSpacing: '0.1rem',
                fontWeight: 600,
                borderWidth: '2px',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 1rem 2rem rgba(0,0,0,0.4)',
                },
              }}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={testBackendConnection}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: '50px',
                fontSize: '1.1rem',
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
            >
              Test Connection
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;