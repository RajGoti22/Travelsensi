import React from 'react';
import { Box, Card, CardContent, Typography, IconButton, Stack, Chip, Button } from '@mui/material';
import { MoreVert, CalendarToday, AttachMoney, Edit, Visibility } from '@mui/icons-material';

const DashboardItineraryGrid = ({ itineraries, navigate, handleMenuOpen, getStatusColor }) => (
  <Box component="section" aria-label="Your itineraries" sx={{ mb: 4 }}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(320px, 320px))' },
        gap: { xs: 2, sm: 3, md: 4 },
        justifyContent: 'center',
      }}
    >
      {itineraries.map((itinerary, index) => (
        <Box key={itinerary.id} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 320, md: 360 },
              height: { xs: 'auto', md: 480 },
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(14,30,37,0.06)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 22px 40px rgba(14,30,37,0.12)',
              },
            }}
          >
            {/* Card Header with Gradient */}
            <Box
              sx={{
                height: { xs: 140, md: 200 },
                background: index % 3 === 0 
                  ? 'linear-gradient(to right bottom, #1976d22f, #0d48a17e), url("https://images.unsplash.com/photo-1648467885244-3ea49df7208b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RXVyb3BlYW4lMjBBZHZlbnR1cmV8ZW58MHx8MHx8fDA%3D")'
                  : index % 3 === 1
                  ? 'linear-gradient(to right bottom, #1976d22f, #0d48a17e), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")'
                  : 'linear-gradient(to right bottom, #1976d22f, #0d48a17e), url("https://plus.unsplash.com/premium_photo-1692449337629-00383e181c90?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'screen',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2, md: 3 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '0.95rem', md: '1.3rem' },
                  textTransform: 'none',
                  textShadow: '0 6px 14px rgba(0,0,0,0.5)',
                  flex: 1,
                }}
              >
                {itinerary.title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, itinerary)}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.18)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.22)',
                  },
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
            {/* Card Content */}
            <CardContent sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', flex: '1 1 auto', overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  lineHeight: 1.6,
                  fontSize: '0.95rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {itinerary.description || 'An amazing travel adventure awaits you with carefully planned destinations and activities.'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<CalendarToday />}
                  label={`${itinerary.duration || '7'} days`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(30, 136, 229, 0.1)',
                    color: 'primary.main',
                    border: 'none',
                    '& .MuiChip-icon': {
                      color: 'rgba(10, 58, 100, 0.78)',
                    },
                  }}
                />
                <Chip
                  icon={<AttachMoney />}
                  label={`$${itinerary.totalBudget || '2,500'}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(30, 136, 229, 0.1)',
                    color: 'primary.main',
                    border: 'none',
                    '& .MuiChip-icon': {
                      color: 'rgba(10, 58, 100, 0.78)',
                    },
                  }}
                />
                <Chip
                  label={itinerary.status || 'draft'}
                  size="small"
                  color={getStatusColor(itinerary.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Stack>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  mt: 'auto',
                  mb: 2,
                }}
              >
                Created: {new Date(itinerary.createdAt || Date.now()).toLocaleDateString()}
              </Typography>
              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                  fullWidth
                  sx={{
                    borderColor: 'rgba(10, 58, 100, 0.78)',
                    color: 'rgba(10, 58, 100, 0.78)',
                    borderRadius: '12px',
                    '&:hover': {
                      bgcolor: 'rgba(10, 58, 100, 0.78)',
                      color: 'white',
                    },
                  }}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/itinerary/${itinerary.id}/edit`)}
                  fullWidth
                  sx={{
                    bgcolor: 'rgba(10, 58, 100, 0.78)',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(10, 58, 100, 0.92)',
                      color: 'white',
                    },
                  }}
                >
                  Edit
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  </Box>
);

export default DashboardItineraryGrid;
