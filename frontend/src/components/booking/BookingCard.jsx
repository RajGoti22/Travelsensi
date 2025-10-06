import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ 
  title, 
  description, 
  icon, 
  route, 
  color, 
  features, 
  popular = false 
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.92) 100%)',
        backdropFilter: 'blur(20px)',
        border: popular ? '2px solid' : '1px solid',
        borderColor: popular ? 'rgba(10,58,100,0.78)' : 'rgba(10,58,100,0.15)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(10,58,100,0.18)',
          borderColor: 'rgba(10,58,100,0.78)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: popular 
            ? 'linear-gradient(90deg, rgba(10,58,100,0.95), rgba(8,47,80,0.9))' 
            : 'linear-gradient(90deg, rgba(10,58,100,0.35), rgba(8,47,80,0.35))',
          zIndex: 1,
        }
      }}
      onClick={() => navigate(route)}
    >
      {popular && (
        <Chip
          label="Most Popular"
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(10,58,100,0.9)',
            color: 'white',
            fontWeight: 700,
            letterSpacing: '0.5px',
            zIndex: 2,
            boxShadow: '0 4px 12px rgba(10,58,100,0.3)',
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: popular ? 5 : 3, px: 3 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
            mb: 3,
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'transparent',
              background: 'linear-gradient(135deg, rgba(10,58,100,0.9), rgba(8,47,80,0.9))',
              width: 80, 
              height: 80, 
              mx: 'auto',
              boxShadow: '0 8px 32px rgba(10,58,100,0.32)',
              '& svg': { fontSize: 40, color: 'white' }
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: '#1A202C',
            mb: 2,
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            lineHeight: 1.6,
            fontSize: '1rem',
          }}
        >
          {description}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          {features.map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              size="small"
              variant="outlined"
              sx={{ 
                m: 0.5, 
                borderColor: 'rgba(10,58,100,0.35)', 
                color: 'rgba(10,58,100,0.9)',
                bgcolor: 'rgba(10,58,100,0.06)',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(10,58,100,0.6)',
                  bgcolor: 'rgba(10,58,100,0.12)',
                }
              }}
            />
          ))}
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: 'rgba(10,58,100,0.9)',
            borderRadius: '50px',
            px: 4,
            py: 1.5,
            fontWeight: 700,
            letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, rgba(10,58,100,0.9), rgba(8,47,80,0.9))',
            boxShadow: '0 8px 24px rgba(10,58,100,0.28)',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 12px 32px rgba(10,58,100,0.35)',
              background: 'linear-gradient(135deg, rgba(10,58,100,1), rgba(8,47,80,1))',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(route);
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookingCard;