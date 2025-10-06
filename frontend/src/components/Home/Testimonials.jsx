import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card,
  CardContent,
  Avatar,
  Rating
} from '@mui/material';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      avatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'TravelSensei created my perfect 10-day Italy itinerary! From hidden Tuscan villages to Rome\'s best restaurants - every recommendation was absolutely perfect. The AI suggestions saved me weeks of planning!',
    },
    {
      id: 2,
      name: 'Mike Chen',
      location: 'Toronto, Canada',
      avatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'Incredible AI-powered travel planning! Discovered amazing local experiences in Thailand that no guidebook mentioned. The personalized recommendations matched my budget and interests perfectly. Highly recommended!',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      location: 'London, UK',
      avatar: '/api/placeholder/50/50',
      rating: 4,
      comment: 'As a solo female traveler, TravelSensei gave me confidence to explore Japan safely. Excellent safety tips, authentic cultural experiences, and reliable local insights made my trip unforgettable!',
    },
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.1rem',
              mb: 2,
              color: 'rgba(10, 58, 100, 0.78)',
            }}
          >
            What Our Travelers Say
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              sx={{
                width: '100%',
                minWidth: 0,
                borderRadius: '20px',
                background: 'white',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(10, 58, 100, 0.78)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 60px rgba(30, 136, 229, 0.25)',
                },
                minHeight: { xs: 220, sm: 240, md: 260 },
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'stretch',
              }}
            >
              {/* Quote Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -15,
                  left: 20,
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.1), rgba(25, 118, 210, 0.3))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, color: '#144875ff', fontWeight: 'bold' }}>
                  "
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, pt: { xs: 2.5, sm: 3, md: 4 } }}>
                {/* Testimonial Text */}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.92rem', sm: '0.98rem', md: '1.05rem' },
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    mb: 2.2,
                    textAlign: 'left',
                    minHeight: { xs: 60, sm: 80 },
                  }}
                >
                  {testimonial.comment}
                </Typography>

                {/* User Info Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{
                        width: { xs: 36, sm: 44, md: 50 },
                        height: { xs: 36, sm: 44, md: 50 },
                        mr: 2,
                        background: 'linear-gradient(135deg, #1e88e5, #1976d2)',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        fontWeight: 600,
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '0.98rem', sm: '1rem' },
                          fontWeight: 600,
                          color: 'text.primary',
                          lineHeight: 1.2,
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.78rem', sm: '0.85rem' },
                          color: 'text.secondary',
                        }}
                      >
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Rating */}
                  <Box sx={{ textAlign: 'right', mt: { xs: 1, sm: 0 } }}>
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: 'rgba(10, 58, 100, 0.78)',
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {testimonial.rating}/5
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;