import React from 'react';
import { Box, Container, Typography, Card, CardContent, CardActions, Button, Grid, Avatar, Paper, Chip, Divider } from '@mui/material';
import { Hotel, Flight, Tour, DirectionsCarOutlined, Shield, Support, TrendingUp, MonetizationOn, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsHighlights from '../../components/booking/StatsHighlights';

// -----------------------------------------------------------------------------
// Highlight statistics configuration (icons can be swapped easily). To change:
//  - value: numeric/stat text
//  - label: short descriptor
//  - icon: any MUI icon or custom <svg/>
//  - iconBgGradient: optional gradient string for circular background
// -----------------------------------------------------------------------------
const highlightStats = [
  { value: '2M+', label: 'Hotels', icon: <Hotel />, iconBgGradient: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
  { value: '500K+', label: 'Flights', icon: <Flight />, iconBgGradient: 'linear-gradient(135deg,#0369a1,#0ea5e9)' },
  { value: '1.2M+', label: 'Activities', icon: <Tour />, iconBgGradient: 'linear-gradient(135deg,#0f766e,#14b8a6)' },
  { value: '3.5M+', label: 'Travelers', icon: <DirectionsCarOutlined />, iconBgGradient: 'linear-gradient(135deg,#9333ea,#6366f1)' },
];

// -----------------------------------------------------------------------------
// Booking options displayed as cards. Each option drives one BookingCard.
// route: target path, ensure router has matching route.
// features: short tags; keep concise (< 4 ideally) for visual clarity.
// popular: adds a visual badge. Only one should generally be true.
// -----------------------------------------------------------------------------
const bookingOptions = [
  {
    title: 'Hotels',
    description: 'Find and reserve stays worldwide with flexible rates.',
    icon: <Hotel />,
    route: '/booking/hotels',
    features: ['Flexible', 'Best Deals', '24/7 Support'],
    popular: true,
  },
  {
    title: 'Flights',
    description: 'Compare global airlines and book at the right moment.',
    icon: <Flight />,
    route: '/booking/flights',
    features: ['Price Alerts', 'Multi-City', 'Fast Checkout'],
  },
  {
    title: 'Activities',
    description: 'Curate unique local experiences tailored to your interests.',
    icon: <Tour />,
    route: '/booking/activities',
    features: ['Curated', 'Local Guides', 'Instant Confirm'],
  },
];

// -----------------------------------------------------------------------------
// Feature blurbs below cards. Each item rendered inside a Paper block.
// -----------------------------------------------------------------------------
const features = [
  {
    title: 'Trusted Support',
    description: 'Round-the-clock travel assistance whenever you need it.',
    icon: <Support />,
  },
  {
    title: 'Smart Savings',
    description: 'Dynamic price tracking helps you lock in better rates.',
    icon: <MonetizationOn />,
  },
  {
    title: 'Performance',
    description: 'Fast search with optimized global infrastructure.',
    icon: <TrendingUp />,
  },
  {
    title: 'Secure Bookings',
    description: 'Enterprise‑grade security for payments and data.',
    icon: <Shield />,
  },
];

// -----------------------------------------------------------------------------
// BookingCard: minimalist, responsive, accessible.
//  - Removes heavy decoration, focuses on clarity.
//  - Keyboard accessible (Enter/Space triggers navigation).
//  - Motion reduced when user prefers reduced motion.
// Customization points:
//  - Change gradient in icon wrapper
//  - Adjust spacing via theme (p, gap)
//  - Modify font sizes with responsive typography tokens
// -----------------------------------------------------------------------------
const BookingCard = ({ title, description, icon, route, features, popular = false }) => {
  const navigate = useNavigate();
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`${title} booking option`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(route);
        }
      }}
      onClick={() => navigate(route)}
      sx={theme => ({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3.25,
        gap: 2,
        height: '100%',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'box-shadow .25s ease, transform .25s ease, border-color .25s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-4px)',
          borderColor: 'rgba(10, 58, 100, 0.95)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
        '&:focus-visible': {
          outline: '3px solid',
          outlineColor: theme.palette.primary.main,
          outlineOffset: '2px',
        },
      })}
    >
      {popular && (
        <Chip
          label="Popular"
          size="small"
          color="primary"
          sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 600 }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 0, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.75 }}>
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: ' rgba(10, 58, 100, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': { fontSize: 32, color: '#fff' },
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2, lineHeight: 1.5, px: 1 }}>
          {description}
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.75 }}>
          {features.map((feature, i) => (
            <Chip
              key={i}
              label={feature}
              size="small"
              variant="outlined"
              sx={{
                px: 1.05,
                fontSize: '0.65rem',
                fontWeight: 500,
                lineHeight: 1.1,
                borderColor: 'divider',
                color: 'text.secondary',
                bgcolor: 'background.default',
                borderRadius: 2,
              }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 0 }}>
        <Button
          variant="contained"
          size="medium"
          endIcon={<ArrowForward />}
          sx={{
            variant:'outlined',
            borderRadius: 2.5,
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.92rem',
            bgcolor:'rgba(10, 58, 100, 0.78)',
            '&:hover': { bgcolor: 'rgba(10, 58, 100, 0.95)' },
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

// -----------------------------------------------------------------------------
// Main page component
// -----------------------------------------------------------------------------
const BookingHub = () => {
  const { currentUser } = useAuth() || {};
  const firstName = currentUser?.displayName?.split(' ')[0] || currentUser?.username || 'Traveler';

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          // Layered gradient over primary image with a remote fallback.
          // Order: top gradient, local image (if exists), remote fallback image.
          backgroundImage: `linear-gradient(#1976d22f, #0d48a17e), url(/images/hero-travel.jpg), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0d2544', // solid color fallback while image loads / if all fail
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          pt: { xs: 7, sm: 10, md: 12 },
          pb: { xs: 6, sm: 8, md: 10 },
          mb: { xs: 2, sm: 3, md: 4 },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            // background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))',
            pointerEvents: 'none',
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.35rem', sm: '3.25rem', md: '4.1rem' },
            textAlign: 'center',
            mb: { xs: 2, sm: 3 },
            letterSpacing: '1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          Your Travel Booking Hub
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.95,
            fontWeight: 400,
            fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.45rem' },
            textAlign: 'center',
            maxWidth: 780,
            mx: 'auto',
            mb: { xs: 5, sm: 6 },
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}
        >
          Welcome back, {firstName}! Book hotels, flights, and activities in one streamlined workspace.
        </Typography>
        <StatsHighlights items={highlightStats} />
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 8, mt: -4, position: 'relative', zIndex: 2,mt:7 }}>
        {/* Booking Options */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography variant="h3" sx={{ mb: 2.5, fontWeight: 700, letterSpacing: '0.5px' }}>
            What would you like to book?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 620, mx: 'auto', lineHeight: 1.55 }}>
            Choose from our core booking categories and start assembling your itinerary.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {bookingOptions.map((option, index) => (
            <BookingCard key={index} {...option} />
          ))}
        </Box>

        <Divider sx={{ my: 8, opacity: 0.25 }} />

        {/* Features Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 2.5, fontWeight: 700, letterSpacing: '0.5px' }}>
            Why Choose TravelSensei?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.55 }}>
            We streamline planning so you can focus on the journey, not logistics.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)'
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 0.5, sm: 2 },
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {features.map((feature, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'box-shadow .25s ease, transform .25s ease, border-color .25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 22px rgba(0,0,0,0.10)',
                  borderColor: 'rgba(10, 58, 100, 0.78)',
                },
                minHeight: { xs: 120, sm: 150, md: 180 },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 40, md: 50 },
                  height: { xs: 32, sm: 40, md: 50 },
                  mb: { xs: 1, sm: 1.5 },
                  bgcolor: 'rgba(10, 58, 100, 0.78)',
                  background: 'rgba(10, 58, 100, 0.9)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
                  '& svg': { fontSize: { xs: 18, sm: 22, md: 26 } },
                }}
              >
                {feature.icon}
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: { xs: 0.3, sm: 0.5 },
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.08rem', md: '1.12rem' },
                  lineHeight: 1.1,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.3,
                  fontSize: { xs: '0.78rem', sm: '0.9rem' },
                  wordBreak: 'break-word',
                  maxWidth: { xs: 180, sm: 220, md: 260 },
                }}
              >
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default BookingHub;
