import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchSection = ({ 
  searchDestination, 
  setSearchDestination, 
  trendingSearches, 
  onDestinationSelect 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontWeight: 300,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Your Next Adventure
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 300,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Explore destinations, get AI-powered recommendations, and plan unforgettable journeys
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Where would you like to go?"
        value={searchDestination}
        onChange={(e) => setSearchDestination(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Trending searches:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {trendingSearches.map((search, index) => (
            <Chip
              key={index}
              label={search}
              onClick={() => onDestinationSelect(search)}
              sx={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'text.primary',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchSection;