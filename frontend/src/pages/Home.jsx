import React from 'react';
import { Box } from '@mui/material';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import PopularTours from '../components/Home/PopularTours';
import Testimonials from '../components/Home/Testimonials';
import CallToAction from '../components/Home/CallToAction';

const Home = () => {
  return (
    <Box>
      <Hero />
      <Features />
      <PopularTours />
      <Testimonials />
      <CallToAction />
    </Box>
  );
};

export default Home;