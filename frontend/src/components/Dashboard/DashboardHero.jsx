import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const DashboardHero = ({ user, navigate }) => (
  <Box
    sx={{
      background: 'linear-gradient(180deg, rgba(10,58,100,0.2), rgba(10,58,100,0.6)), url("https://images.unsplash.com/photo-1418846531910-2b7bb1043512?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      py: { xs: 6, md: 10 },
      mb:6,
      color: 'white',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minHeight: { xs: '48vh', md: '75vh' },
      pt: { xs: 6, md: 10 },
      clipPath: { xs: 'none', md: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)' },
    }}
  >
    <Container maxWidth="lg">
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          fontWeight: 300,
          textTransform: 'uppercase',
          letterSpacing: '0.2rem',
          mb: 2,
          textShadow: '0 0.5rem 1rem rgba(0,0,0,0.7)',
        }}
      >
        Your Adventures
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: '1.1rem', md: '1.3rem' },
          fontWeight: 300,
          mb: 4,
          maxWidth: '600px',
          lineHeight: 1.6,
          textShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)',
        }}
      >
        Welcome back, {user?.name || 'Explorer'}! Manage your travel itineraries and continue planning your next amazing journey.
      </Typography>
      <Button
        variant="outlined"
        size="large"
        startIcon={<Add />}
        onClick={() => navigate('/itinerary/create')}
        sx={{
          borderColor: 'rgba(255,255,255,0.9)',
          color: 'white',
          borderRadius: '15px',
          borderWidth: '2px',
          textShadow: '0 0.3rem 0.6rem rgba(0,0,0,0.3)',
          px: { xs: 3, md: 4 },
          py: 1.25,
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          fontWeight: 700,
          textTransform: 'none',
          letterSpacing: '0.02rem',
          background: 'transparent',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.3)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        Create New Adventure
      </Button>
    </Container>
  </Box>
);

export default DashboardHero;
