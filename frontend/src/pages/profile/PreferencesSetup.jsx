import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  LinearProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Travel Style', 'Destinations', 'Budget & Duration', 'Activities', 'Accommodations'];

const PreferencesSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [preferences, setPreferences] = useState({
    travelStyle: [],
    destinations: {
      preferred: [],
      avoided: [],
    },
    budget: {
      range: [500, 3000],
      currency: 'USD',
    },
    duration: {
      typical: 7,
      flexible: true,
    },
    activities: [],
    accommodation: {
      types: [],
      amenities: [],
    },
    dietary: [],
    accessibility: [],
    travelSeason: 'flexible',
    groupSize: 'solo',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserPreferences } = useAuth();
  const navigate = useNavigate();

  const travelStyles = [
    'Adventure', 'Cultural', 'Relaxation', 'Luxury', 'Budget', 
    'Romantic', 'Family', 'Solo', 'Business', 'Eco-friendly'
  ];

  const destinationTypes = [
    'Beach', 'Mountains', 'Cities', 'Countryside', 'Desert',
    'Islands', 'Historical Sites', 'National Parks', 'Ski Resorts'
  ];

  const activities = [
    'Hiking', 'Museums', 'Food Tours', 'Shopping', 'Photography',
    'Water Sports', 'Nightlife', 'Spa & Wellness', 'Wildlife',
    'Art & Culture', 'Adventure Sports', 'Local Experiences'
  ];

  const accommodationTypes = [
    'Hotels', 'Hostels', 'Vacation Rentals', 'Resorts', 'B&Bs',
    'Boutique Hotels', 'Luxury Hotels', 'Camping', 'Glamping'
  ];

  const accommodationAmenities = [
    'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service',
    'Parking', 'Pet Friendly', 'Airport Shuttle', 'Business Center'
  ];

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher',
    'Dairy-Free', 'Nut Allergies', 'Low-Sodium', 'Diabetic'
  ];

  const accessibilityNeeds = [
    'Wheelchair Accessible', 'Visual Impairment Support', 'Hearing Assistance',
    'Mobility Assistance', 'Elevator Access', 'Accessible Bathrooms'
  ];

  const handleChipToggle = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleDestinationToggle = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      destinations: {
        ...prev.destinations,
        [type]: prev.destinations[type].includes(value)
          ? prev.destinations[type].filter(item => item !== value)
          : [...prev.destinations[type], value]
      }
    }));
  };

  const handleAccommodationToggle = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      accommodation: {
        ...prev.accommodation,
        [type]: prev.accommodation[type].includes(value)
          ? prev.accommodation[type].filter(item => item !== value)
          : [...prev.accommodation[type], value]
      }
    }));
  };

  const handleBudgetChange = (event, newValue) => {
    setPreferences(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        range: newValue
      }
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await updateUserPreferences(preferences);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What's your travel style?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select all that apply to help us personalize your recommendations.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {travelStyles.map((style) => (
                <Chip
                  key={style}
                  label={style}
                  clickable
                  color={preferences.travelStyle.includes(style) ? 'primary' : 'default'}
                  onClick={() => handleChipToggle('travelStyle', style)}
                />
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Destination Preferences
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  I love visiting:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {destinationTypes.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      clickable
                      color={preferences.destinations.preferred.includes(type) ? 'primary' : 'default'}
                      onClick={() => handleDestinationToggle('preferred', type)}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  I prefer to avoid:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {destinationTypes.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      clickable
                      color={preferences.destinations.avoided.includes(type) ? 'secondary' : 'default'}
                      onClick={() => handleDestinationToggle('avoided', type)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Budget & Trip Duration
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Typical Budget Range (per trip)
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={preferences.budget.range}
                    onChange={handleBudgetChange}
                    valueLabelDisplay="on"
                    min={100}
                    max={10000}
                    step={100}
                    marks={[
                      { value: 500, label: '$500' },
                      { value: 2500, label: '$2.5K' },
                      { value: 5000, label: '$5K' },
                      { value: 10000, label: '$10K+' }
                    ]}
                    valueLabelFormat={(value) => `$${value}`}
                  />
                </Box>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={preferences.budget.currency}
                    label="Currency"
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      budget: { ...prev.budget, currency: e.target.value }
                    }))}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="CAD">CAD ($)</MenuItem>
                    <MenuItem value="AUD">AUD ($)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Trip Duration
                </Typography>
                <TextField
                  label="Typical trip length (days)"
                  type="number"
                  value={preferences.duration.typical}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    duration: { ...prev.duration, typical: parseInt(e.target.value) || 7 }
                  }))}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preferences.duration.flexible}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        duration: { ...prev.duration, flexible: e.target.checked }
                      }))}
                    />
                  }
                  label="I'm flexible with trip duration"
                />
                <Box sx={{ mt: 3 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Preferred Travel Season</FormLabel>
                    <RadioGroup
                      value={preferences.travelSeason}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        travelSeason: e.target.value
                      }))}
                    >
                      <FormControlLabel value="spring" control={<Radio />} label="Spring (Mar-May)" />
                      <FormControlLabel value="summer" control={<Radio />} label="Summer (Jun-Aug)" />
                      <FormControlLabel value="fall" control={<Radio />} label="Fall (Sep-Nov)" />
                      <FormControlLabel value="winter" control={<Radio />} label="Winter (Dec-Feb)" />
                      <FormControlLabel value="flexible" control={<Radio />} label="Flexible/Any season" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Favorite Activities
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              What do you enjoy doing when you travel?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {activities.map((activity) => (
                <Chip
                  key={activity}
                  label={activity}
                  clickable
                  color={preferences.activities.includes(activity) ? 'primary' : 'default'}
                  onClick={() => handleChipToggle('activities', activity)}
                />
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Special Considerations
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Dietary Restrictions
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {dietaryRestrictions.map((restriction) => (
                    <Chip
                      key={restriction}
                      label={restriction}
                      clickable
                      size="small"
                      color={preferences.dietary.includes(restriction) ? 'primary' : 'default'}
                      onClick={() => handleChipToggle('dietary', restriction)}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  Accessibility Needs
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {accessibilityNeeds.map((need) => (
                    <Chip
                      key={need}
                      label={need}
                      clickable
                      size="small"
                      color={preferences.accessibility.includes(need) ? 'primary' : 'default'}
                      onClick={() => handleChipToggle('accessibility', need)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Accommodation Preferences
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Preferred Accommodation Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {accommodationTypes.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      clickable
                      color={preferences.accommodation.types.includes(type) ? 'primary' : 'default'}
                      onClick={() => handleAccommodationToggle('types', type)}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Important Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {accommodationAmenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      clickable
                      color={preferences.accommodation.amenities.includes(amenity) ? 'primary' : 'default'}
                      onClick={() => handleAccommodationToggle('amenities', amenity)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Typical Group Size</FormLabel>
                <RadioGroup
                  value={preferences.groupSize}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    groupSize: e.target.value
                  }))}
                  row
                >
                  <FormControlLabel value="solo" control={<Radio />} label="Solo" />
                  <FormControlLabel value="couple" control={<Radio />} label="Couple" />
                  <FormControlLabel value="family" control={<Radio />} label="Family" />
                  <FormControlLabel value="group" control={<Radio />} label="Group" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Set Up Your Travel Preferences
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Help us personalize your travel recommendations by sharing your preferences.
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <LinearProgress 
          variant="determinate" 
          value={(activeStep + 1) / steps.length * 100} 
          sx={{ mb: 4, height: 6, borderRadius: 3 }}
        />

        <Card elevation={0} sx={{ bgcolor: 'grey.50', p: 3, mb: 4 }}>
          <CardContent>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSavePreferences}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? 'Saving...' : 'Save Preferences & Continue'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="large"
            >
              Next
            </Button>
          )}
        </Box>
        
        {activeStep === steps.length - 1 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            You can always update your preferences later in your account settings.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default PreferencesSetup;
