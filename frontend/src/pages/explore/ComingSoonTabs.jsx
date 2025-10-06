import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import {
  Event,
  TrendingUp,
  LocationCity,
  Flight,
  Map,
} from '@mui/icons-material';

const ComingSoonSection = ({ icon: Icon, title, description }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: '20px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 4,
        }}
      >
        <Icon sx={{ fontSize: 50, color: 'white' }} />
      </Box>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 300,
          textTransform: 'uppercase',
          letterSpacing: '0.1rem',
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: 'text.secondary',
          fontWeight: 300,
          maxWidth: '500px',
          mx: 'auto',
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

const ComingSoonTabs = ({ currentTab }) => {
  const tabContent = {
    1: {
      icon: TrendingUp,
      title: 'Trending Coming Soon',
      description: "We're analyzing global travel trends to bring you the hottest destinations and experiences before they become mainstream.",
    },
    2: {
      icon: LocationCity,
      title: 'Cities Coming Soon',
      description: "Comprehensive city guides with AI-curated recommendations for urban explorers are in development.",
    },
    3: {
      icon: Flight,
      title: 'Flights Coming Soon',
      description: "Smart flight search and booking with AI-powered price predictions and route optimization coming soon.",
    },
    4: {
      icon: Map,
      title: 'Itineraries Coming Soon',
      description: "AI-generated personalized travel itineraries based on your preferences and travel style are being crafted.",
    },
    5: {
      icon: Event,
      title: 'Events Coming Soon',
      description: "We're working on bringing you the best local events and experiences from around the world.",
    },
  };

  const content = tabContent[currentTab] || tabContent[5];

  return <ComingSoonSection {...content} />;
};

export default ComingSoonTabs;