import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  Paper,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Explore as ExploreIcon,
  Event,
  TrendingUp,
  LocationCity,
  Flight,
  Map,
  Star,
} from '@mui/icons-material';
import LocalRecommendations from './LocalRecommendations';
import { useAuth } from '../contexts/AuthContext';

const Explore = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchDestination, setSearchDestination] = useState('Tokyo, Japan');
  const { user } = useAuth();
  const theme = useTheme();

  const popularDestinations = [
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Modern metropolis with ancient traditions',
      recommendationCount: 2847,
      rating: 4.8,
    },
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXN8ZW58MHx8MHx8fDA%3D',
      description: 'City of lights and romance',
      recommendationCount: 3156,
      rating: 4.9,
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Tropical paradise with rich culture',
      recommendationCount: 1892,
      rating: 4.7,
    },
    {
      name: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'The city that never sleeps',
      recommendationCount: 4231,
      rating: 4.6,
    },
    {
      name: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Breathtaking sunsets and white architecture',
      recommendationCount: 2143,
      rating: 4.8,
    },
    {
      name: 'Iceland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Land of fire and ice',
      recommendationCount: 1567,
      rating: 4.9,
    },
  ];

  const trendingSearches = [
    'Best ramen in Tokyo',
    'Hidden gems in Paris',
    'Sunset spots in Bali',
    'Local coffee shops',
    'Night markets',
    'Art galleries',
    'Rooftop bars',
    'Walking tours',
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDestinationSelect = (destination) => {
    setSearchDestination(destination);
    setCurrentTab(1); // Switch to recommendations tab
  };

  const renderOverview = () => (
    <Box>
      {/* Popular Destinations */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.2rem',
              mb: 2,
              background: 'rgba(10, 58, 100, 0.78)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Popular Destinations
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 300,
              letterSpacing: '0.1rem',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover the world's most captivating destinations, curated by fellow travelers
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {popularDestinations.map((destination, index) => (
            <Grid item xs={12} sm={6} md={4} key={destination.name}>
              <Card
                sx={{
                  width: '260px',
                  minWidth: '260px',
                  maxWidth: '260px',
                  height: '370px',
                  minHeight: '370px',
                  maxHeight: '370px',
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.15)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-1rem) scale(1.02)',
                    boxShadow: '0 2.5rem 4rem rgba(0,0,0,0.25)',
                  },
                }}
                onClick={() => handleDestinationSelect(destination.name)}
              >
                {/* Background Image with Gradient Overlay */}
                <Box
                  sx={{
                    height: '250px',
                    backgroundImage: `linear-gradient(to right bottom, #1976d216, #0d48a15d), url("${destination.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                  }}
                >
                  {/* Recommendation Count Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '16px',
                      px: 1.2,
                      py: 0.3,
                      minWidth: 'auto',
                      minHeight: 'auto',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'rgba(10, 58, 100, 0.95)',
                        fontSize: '0.78rem',
                        letterSpacing: 0.1,
                        px: 0.2,
                      }}
                    >
                      {destination.recommendationCount.toLocaleString()} places
                    </Typography>
                  </Box>

                  {/* Rating Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '16px',
                      px: 1.2,
                      py: 0.3,
                      minWidth: 'auto',
                      minHeight: 'auto',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Star sx={{ fontSize: 16, color: '#ffd700' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.78rem',
                        letterSpacing: 0.1,
                        px: 0.2,
                      }}
                    >
                      {destination.rating}
                    </Typography>
                  </Box>

                  {/* Destination Name */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 30,
                      left: 30,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: 300,
                        fontSize: '1.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1rem',
                        textShadow: '0 0.5rem 1rem rgba(0,0,0,0.3)',
                      }}
                    >
                      {destination.name}
                    </Typography>
                  </Box>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ p: 3, height: '170px', display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: '0.95rem',
                      flex: 1,
                    }}
                  >
                    {destination.description}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Flight />}
                    sx={{
                      bgcolor: 'rgba(10, 58, 100, 0.78)',
                      borderRadius: '25px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(10, 58, 100, 0.95)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Trending Searches */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 2rem 4rem rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.1rem',
            }}
          >
            Trending Searches
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {trendingSearches.map((search, index) => (
            <Chip
              key={index}
              label={search}
              clickable
              sx={{
                borderRadius: '18px',
                bgcolor: 'rgba(10, 58, 100, 0.07)',
                color: 'rgba(10, 58, 100, 0.85)',
                border: '1.5px solid rgba(10, 58, 100, 0.13)',
                fontWeight: 600,
                fontSize: '0.97rem',
                px: 1.8,
                py: 0.3,
                boxShadow: '0 2px 8px rgba(10,58,100,0.07)',
                letterSpacing: '0.01em',
                textTransform: 'none',
                transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
                backdropFilter: 'blur(2px)',
                '&:hover': {
                  bgcolor: 'rgba(10, 58, 100, 0.78)',
                  color: 'white',
                  borderColor: 'rgba(10, 58, 100, 0.78)',
                  boxShadow: '0 6px 18px rgba(10,58,100,0.13)',
                  transform: 'translateY(-2px) scale(1.04)',
                },
              }}
              onClick={() => {
                setSearchDestination(search);
                setCurrentTab(1);
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(to right bottom, rgba(30, 136, 229, 0.1), rgba(25, 118, 210, 0.5)), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 8, md: 12 },
          color: 'white',
          clipPath: 'polygon(0 0, 100% 0, 100% 85vh, 0 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.3rem',
              mb: 3,
              textShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)',
            }}
          >
            Explore the World
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.4rem' },
              fontWeight: 300,
              mb: 5,
              maxWidth: '700px',
              lineHeight: 1.6,
              textShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)',
            }}
          >
            Discover authentic experiences, hidden gems, and local favorites from fellow travelers around the globe
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ maxWidth: '600px' }}>
            <TextField
              fullWidth
              placeholder="Where do you want to explore?"
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: '25px',
                  height: '60px',
                  fontSize: '1.1rem',
                  backdropFilter: 'blur(10px)',
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '18px 20px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(10, 58, 100, 0.78)', fontSize: 28 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: '20px',
                        px: 3,
                        bgcolor: 'rgba(10, 58, 100, 0.78)',
                        '&:hover': {
                          bgcolor: 'rgba(10, 58, 100,0.95)',
                        },
                      }}
                      onClick={() => setCurrentTab(1)}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                ),
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setCurrentTab(1);
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, mt: -11 }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Enhanced Tabs */}
          <Paper
            elevation={0}
            sx={{
              mb: { xs: 2, sm: 3 },
              background: 'rgba(253, 253, 255, 1)',
              boxShadow: '0 2px 12px 0 rgba(30, 60, 90, 0.5)',
              borderRadius: { xs: '14px', sm: '18px', md: '22px' },
              px: 0,
              py: 0,
              mb: 8,
              maxWidth: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 900,
                background: 'none',
                px: { xs: 0.5, sm: 1.5, md: 2 },
                py: { xs: 0.5, sm: 1 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="standard"
                sx={{
                  minHeight: { xs: 36, sm: 40, md: 48 },
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  overflowX: 'auto',
                  '& .MuiTabs-flexContainer': {
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    gap: { xs: 2, sm: 4, md: 8 },
                  },
                  '& .MuiTab-root': {
                    minHeight: { xs: 36, sm: 40, md: 48 },
                    px: { xs: 1.5, sm: 4, md: 7 },
                    py: { xs: 0.1, sm: 0.5 },
                    textTransform: 'none',
                    letterSpacing: 0,
                    fontWeight: 700,
                    fontSize: { xs: '0.92rem', sm: '1.08rem', md: '1.18rem' },
                    color: '#25324b',
                    background: 'none',
                    borderRadius: 0,
                    transition: 'all 0.18s',
                    mx: 0,
                    whiteSpace: 'nowrap',
                    flexShrink: 1,
                    '&:hover': {
                      color: '#3a5a7c',
                      background: 'rgba(58,90,124,0.06)',
                    },
                    '&.Mui-selected': {
                      color: '#1e3c5a',
                      fontWeight: 800,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #3a5a7c 0%, #547ca6 100%)',
                    transition: 'all 0.2s',
                  },
                }}
              >
                <Tab label={<span style={{ fontSize: 'inherit', fontWeight: 700 }}>Overview</span>} />
                <Tab label={<span style={{ fontSize: 'inherit', fontWeight: 700 }}>Local Recommendations</span>} />
                <Tab label={<span style={{ fontSize: 'inherit', fontWeight: 700 }}>Events</span>} />
              </Tabs>
            </Box>
          </Paper>

          {/* Tab Content */}
          <Box>
            {currentTab === 0 && renderOverview()}
            {currentTab === 1 && <LocalRecommendations destination={searchDestination} />}
            {currentTab === 2 && (
              <Paper
                sx={{
                  textAlign: 'center',
                  py: 10,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 2rem 4rem rgba(0,0,0,0.1)',
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
                  <Event sx={{ fontSize: 50, color: 'white' }} />
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
                  Events Coming Soon
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
                  We're working on bringing you the best local events and experiences from around the world.
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Explore;
