import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button 
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const featureList = [
  {
    icon: '🤖',
    title: 'AI-Powered Planning',
    desc: 'Get personalized travel recommendations based on your preferences and budget.'
  },
  {
    icon: '🗺️',
    title: 'Discover Hidden Gems',
    desc: 'Find unique destinations and experiences that match your travel style.'
  },
  {
    icon: '👥',
    title: 'Community Insights',
    desc: 'Learn from fellow travelers and share your own experiences.'
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 2, md: 4 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'rgba(10, 58, 100, 0.78)',
              mb: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Why Choose TravelSensei
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', fontWeight: 400, mb: 2 }}
          >
            Smart planning, unique experiences, and a community that helps you travel better.
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
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {featureList.map((f, i) => (
            <Box
              key={i}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 5,
                boxShadow: '0 4px 32px 0 rgba(10,58,100,0.07)',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 },
                minHeight: { xs: 140, sm: 170, md: 200 },
                transition: 'box-shadow .25s, transform .25s',
                '&:hover': {
                  boxShadow: '0 8px 32px 0 rgba(10,58,100,0.13)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: 44, sm: 54, md: 64 },
                  height: { xs: 44, sm: 54, md: 64 },
                  borderRadius: '50%',
                  bgcolor: 'grey.100',
                  color: 'primary.main',
                  fontSize: { xs: 26, sm: 32, md: 38 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.2,
                  boxShadow: '0 2px 12px 0 rgba(10,58,100,0.08)',
                }}
              >
                {f.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.7, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.18rem' } }}>
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.92rem', sm: '0.98rem', md: '1.05rem' } }}>
                {f.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;