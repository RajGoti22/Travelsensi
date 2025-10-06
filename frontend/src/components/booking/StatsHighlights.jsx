import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * StatsHighlights
 * Reusable component for the 4 (or more) stat boxes shown in the hero.
 * Each item supports either:
 *  - icon: ReactNode (custom JSX / MUI icon / inline svg) OR
 *  - icon: string path to an image (png/svg)
 *  - iconBgColor: background behind the icon (defaults to theme primary)
 *  - value: main stat (e.g. "2M+")
 *  - label: caption text under the value
 */
const StatsHighlights = ({
  items = [],
  iconSize = 16,
  boxSize = { xs: 90, sm: 100, md: 110 },
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 3, md: 4 },
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        mt: { xs: 0, sm: 2 },
      }}
    >
      {items.map((item, idx) => {
        const { label, value, icon, iconBgColor = '#2563EB', iconBgGradient, iconColor = '#fff' } = item;
        const isImg = typeof icon === 'string';
        return (
          <Box
            key={idx + label}
            sx={{
              background: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 6px 0 rgba(31,41,55,0.10)',
              width: boxSize,
              height: boxSize,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
              border: '1px solid #e5e7eb',
            }}
            aria-label={label}
          >
            <Box
              sx={{
                bgcolor: iconBgGradient ? 'transparent' : iconBgColor,
                background: iconBgGradient || iconBgColor,
                width: 28,
                height: 28,
                borderRadius: 1.2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.9,
                boxShadow: iconBgGradient ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
              }}
            >
              {isImg ? (
                <Box
                  component="img"
                  src={icon}
                  alt={label}
                  sx={{ width: iconSize, height: iconSize, objectFit: 'contain' }}
                />
              ) : (
                // Allow passing a JSX node
                <Box
                  sx={{
                    display: 'flex',
                    width: iconSize,
                    height: iconSize,
                    '& svg': { width: iconSize, height: iconSize, fill: iconColor },
                  }}
                >
                  {icon}
                </Box>
              )}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: '#1F2937',
                mb: 0.1,
                fontSize: '0.95rem',
                letterSpacing: '0.3px',
                textAlign: 'center',
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#6B7280',
                fontWeight: 600,
                fontSize: '0.7rem',
                textAlign: 'center',
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default StatsHighlights;