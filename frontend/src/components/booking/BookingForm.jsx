import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const BookingForm = ({ 
  title = "Booking Details",
  onSubmit,
  loading = false,
  fields = [],
  initialData = {}
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { name, label, type, required, options, ...props } = field;
    const value = formData[name] || '';

    switch (type) {
      case 'select':
        return (
          <FormControl fullWidth key={name}>
            <InputLabel>{label}</InputLabel>
            <Select
              value={value}
              label={label}
              onChange={(e) => handleChange(name, e.target.value)}
              required={required}
              {...props}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} key={name}>
            <DatePicker
              label={label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => handleChange(name, newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth required={required} {...props} />
              )}
            />
          </LocalizationProvider>
        );

      case 'number':
        return (
          <TextField
            key={name}
            fullWidth
            type="number"
            label={label}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
            {...props}
          />
        );

      case 'textarea':
        return (
          <TextField
            key={name}
            fullWidth
            multiline
            rows={4}
            label={label}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
            {...props}
          />
        );

      default:
        return (
          <TextField
            key={name}
            fullWidth
            label={label}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            required={required}
            {...props}
          />
        );
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        {title}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field, index) => (
            <Grid item xs={12} sm={field.width || 6} key={field.name || index}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={() => setFormData(initialData)}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 120,
              background: 'linear-gradient(135deg, rgba(10,58,100,0.9), rgba(8,47,80,0.9))',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(10,58,100,1), rgba(8,47,80,1))',
              },
            }}
          >
            {loading ? 'Processing...' : 'Submit Booking'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BookingForm;