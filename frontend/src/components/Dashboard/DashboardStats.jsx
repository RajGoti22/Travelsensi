import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TrendingUp, Explore as ExploreIcon, CalendarToday, AttachMoney } from '@mui/icons-material';

const DashboardStats = ({ itineraries }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(4, minmax(64px, 1fr))',
        sm: 'repeat(4, minmax(80px, 140px))',
        md: 'repeat(4, minmax(100px, 160px))'
      },
      gap: { xs: 0.5, sm: 0.8, md: 2 },
      py: { xs: 0.4, md: 1.5 },
      px: { xs: 0.5, md: 1 },
      mb: 6,
      alignItems: 'stretch',
      justifyContent: 'center',
      mx: 'auto',
      '@media (max-width:300px)': {
        gridTemplateColumns: 'repeat(2, 1fr)'
      }
    }}
  >
    {[
      {
        icon: <TrendingUp sx={{ fontSize: { xs: 20, md: 34 } }} />,
        value: itineraries.length,
        label: 'Total Itineraries',
        bg: 'linear-gradient(135deg, rgba(102, 126, 234, 1) 20%, rgba(118, 75, 162, 1) 100%)'
      },
      {
        icon: <ExploreIcon sx={{ fontSize: { xs: 20, md: 34 } }} />,
        value: itineraries.filter(i => i.status === 'active').length,
        label: 'Active Trips',
        bg: 'linear-gradient(135deg, rgba(240, 90, 157, 0.75) 20%, rgba(245,87,108,1) 100%)'
      },
      {
        icon: <CalendarToday sx={{ fontSize: { xs: 20, md: 34 } }} />,
        value: itineraries.reduce((sum, i) => sum + (i.duration || 0), 0),
        label: 'Total Days',
        bg: 'linear-gradient(135deg, rgba(79,172,254,1) 20%, rgba(0,242,254,1) 100%)'
      },
      {
        icon: <AttachMoney sx={{ fontSize: { xs: 20, md: 34 } }} />,
        value: `$${itineraries.reduce((sum, i) => sum + (i.totalBudget || 0), 0).toLocaleString()}`,
        label: 'Total Budget',
        bg: 'linear-gradient(135deg, #0d48a1ff 20% , #1976d2e4 100%)'
      }
    ].map((s, idx) => (
      <Paper
        key={idx}
        sx={{
          p: { xs: 0.35, sm: 0.6, md: 1.25 },
          textAlign: 'center',
          borderRadius: '12px',
          background: s.bg,
          color: 'white',
          boxShadow: '0 8px 20px rgba(14,30,37,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: { xs: 100, sm: 120, md: 140 },
          margin: '0 auto',
          minHeight: { xs: 80, sm: 100, md: 120 },
        }}
      >
        <Box sx={{ mb: 0.2, '& svg': { fontSize: { xs: 18, sm: 20, md: 26 } } }}>{s.icon}</Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.1, fontSize: { xs: '0.78rem', sm: '0.9rem', md: '1.05rem' } }}>
          {s.value}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.95, fontSize: { xs: '0.62rem', sm: '0.68rem', md: '0.78rem' } }}>
          {s.label}
        </Typography>
      </Paper>
    ))}
  </Box>
);

export default DashboardStats;
