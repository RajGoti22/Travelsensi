import React from 'react';
import {
  Box,
  Chip,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Cancel,
  Warning,
  HourglassEmpty,
} from '@mui/icons-material';

const BookingStatus = ({ status, progress, showProgress = false }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          color: 'success',
          icon: <CheckCircle />,
          label: 'Confirmed',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          textColor: '#2E7D32',
        };
      case 'pending':
        return {
          color: 'warning',
          icon: <Schedule />,
          label: 'Pending',
          bgColor: 'rgba(255, 152, 0, 0.1)',
          textColor: '#F57C00',
        };
      case 'cancelled':
        return {
          color: 'error',
          icon: <Cancel />,
          label: 'Cancelled',
          bgColor: 'rgba(244, 67, 54, 0.1)',
          textColor: '#D32F2F',
        };
      case 'processing':
        return {
          color: 'info',
          icon: <HourglassEmpty />,
          label: 'Processing',
          bgColor: 'rgba(33, 150, 243, 0.1)',
          textColor: '#1976D2',
        };
      default:
        return {
          color: 'default',
          icon: <Warning />,
          label: 'Unknown',
          bgColor: 'rgba(158, 158, 158, 0.1)',
          textColor: '#757575',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
      <Chip
        icon={config.icon}
        label={config.label}
        sx={{
          backgroundColor: config.bgColor,
          color: config.textColor,
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: config.textColor,
          },
        }}
      />
      
      {showProgress && progress !== undefined && (
        <Box sx={{ width: '100%', minWidth: 200 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: config.textColor,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BookingStatus;