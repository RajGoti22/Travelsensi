import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card,
  Button,
  Chip,
  Rating
} from '@mui/material';
import { 
  SmartToy, 
  TravelExplore, 
  Group 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PopularTours = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SmartToy sx={{ fontSize: 40, color: 'white' }} />,
      title: 'AI-Powered Planning',
      description: 'Get personalized travel recommendations based on your preferences and budget.',
    },
    {
      icon: <TravelExplore sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Discover Hidden Gems',
      description: 'Find unique destinations and experiences that match your travel style.',
    },
    {
      icon: <Group sx={{ fontSize: 40, color: 'white' }} />,
      title: 'Community Insights',
      description: 'Learn from fellow travelers and share your own experiences.',
    },
  ];

  const popularDestinations = [
    {
      id: 1,
      name: 'Tokyo, Japan',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      price: '$2,500',
      days: 7,
      highlights: ['Cultural Sites', 'Food Tours', 'Shopping'],
    },
    {
      id: 2,
      name: 'Paris, France',
      image: '/api/placeholder/300/200',
      rating: 4.7,
      price: '$3,200',
      days: 5,
      highlights: ['Museums', 'Architecture', 'Romance'],
    },
    {
      id: 3,
      name: 'Bali, Indonesia',
      image: '/api/placeholder/300/200',
      rating: 4.9,
      price: '$1,800',
      days: 10,
      highlights: ['Beaches', 'Temples', 'Wellness'],
    },
  ];

  return (
    <>

      {/* Popular Destinations */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 300,
                textTransform: 'uppercase',
                letterSpacing: '0.2rem',
                mb: 3,
                color: 'rgba(10, 58, 100, 0.78)',
              }}
            >
              Most popular tours
            </Typography>
          </Box>
          
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {popularDestinations.map((destination, index) => (
              <Grid item xs={4} key={destination.id}>
                <Card
                  sx={{
                    height: '450px',
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    maxWidth: '320px',
                    mx: 'auto',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {/* Card Image */}
                  <Box
                    sx={{
                      height: '170px',
                      background: index === 0 
                        ? 'linear-gradient(to right bottom, #1976d22f, #0d48a17e), url("https://plus.unsplash.com/premium_photo-1666700698920-d2d2bba589f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHRva3lvfGVufDB8fDB8fHww")'
                        : index === 1
                        ? 'linear-gradient(to right bottom, rgba(30, 136, 229, 0.1), rgba(25, 118, 210, 0.2)), url("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFyaXN8ZW58MHx8MHx8fDA%3D")'
                        : 'linear-gradient(to right bottom, #1976d22f, #0d48a17e), url("https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGJhbGl8ZW58MHx8MHx8fDA%3D")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundBlendMode: 'screen',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '1.3rem',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                        px: 2,
                      }}
                    >
                      {destination.name}
                    </Typography>
                  </Box>

                  {/* Card Details */}
                  <Box sx={{ p: 2.5, pb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        fontSize: '0.80rem',
                        mb: 1,
                        color: 'rgba(10, 58, 100, 0.78)',
                      }}
                    >
                      {destination.days} day tour
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        mb: 1.5,
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      Experience the perfect blend of {destination.highlights.join(', ').toLowerCase()}.
                    </Typography>

                    <Box sx={{ mb: 1.5 }}>
                      {destination.highlights.slice(0, 2).map((highlight, idx) => (
                        <Chip
                          key={idx}
                          label={highlight}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            fontSize: '0.7rem',
                            height: '24px',
                            bgcolor: 'rgba(30, 136, 229, 0.1)',
                            color: 'primary.main',
                          }}
                        />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Rating value={destination.rating} readOnly precision={0.1} size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({destination.rating})
                      </Typography>
                    </Box>
                  </Box>

                  {/* Card Footer */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      pt:0.5,
                      pr: 2.5,
                      pl: 2.5,
                      pb: 2.5,
                      bgcolor: 'white',
                      borderTop: '1px solid rgba(0,0,0,0.03)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Starting from
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.5rem',
                          color: 'rgba(10, 58, 100, 0.78)',
                        }}
                      >
                        {destination.price}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        borderColor: 'rgba(10, 58, 100, 0.78)',
                        color: 'rgba(10, 58, 100, 0.78)',
                        borderRadius: '25px',
                        py: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05rem',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        borderWidth: '2px',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'rgba(10, 58, 100, 0.78)',
                          transform: 'translateY(-1px)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                      }}
                      onClick={() => navigate('/explore')}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default PopularTours;