import React, { useState } from 'react';
import { Box, Container,Typography } from '@mui/material';
import { TravelExplore } from '@mui/icons-material';
import Header from './Header';

const Layout = ({ children }) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: 'rgba(10, 58, 100, 0.78)',
          color: 'primary.contrastText',
          py: 3,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg" >
          <Typography variant="body2" align="center">
            © 2025 TravelSensei. All rights reserved. | AI-powered travel planning made simple.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;