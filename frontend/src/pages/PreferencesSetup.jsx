import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Landscape,
  Restaurant,
  Museum,
  LocalActivity,
  ShoppingBag,
  Nightlife,
  FamilyRestroom,
} from '@mui/icons-material';

const interestCategories = [
  { id: 'nature', label: 'Nature & Outdoors', icon: Landscape },
  { id: 'food', label: 'Food & Dining', icon: Restaurant },
  { id: 'culture', label: 'Culture & Museums', icon: Museum },
  { id: 'adventure', label: 'Adventure Sports', icon: LocalActivity },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'nightlife', label: 'Nightlife', icon: Nightlife },
  { id: 'family', label: 'Family Activities', icon: FamilyRestroom },
];

function PreferencesSetup() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    interests: [],
    budget: [100, 500],
    notifications: true,
    accessibility: false,
    travelStyle: 'balanced',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInterestToggle = (interestId) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleBudgetChange = (event, newValue) => {
    setPreferences(prev => ({
      ...prev,
      budget: newValue
    }));
  };

  const handleSave = () => {
    // Save preferences to localStorage or API
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setShowSuccess(true);
    
    // Navigate to home after a brief delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Set Your Travel Preferences
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Help us personalize your travel experience
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully! Redirecting to home...
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Interests Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                What interests you?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select your favorite travel activities
              </Typography>
              
              <Grid container spacing={2}>
                {interestCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = preferences.interests.includes(category.id);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                      <Chip
                        icon={<Icon />}
                        label={category.label}
                        clickable
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => handleInterestToggle(category.id)}
                        sx={{ 
                          width: '100%', 
                          height: 48,
                          fontSize: '0.875rem'
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Budget Range
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Daily budget per person (USD)
              </Typography>
              
              <Box sx={{ px: 2 }}>
                <Slider
                  value={preferences.budget}
                  onChange={handleBudgetChange}
                  valueLabelDisplay="on"
                  min={50}
                  max={2000}
                  step={50}
                  marks={[
                    { value: 50, label: '$50' },
                    { value: 500, label: '$500' },
                    { value: 1000, label: '$1000' },
                    { value: 2000, label: '$2000' },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Preferences
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        notifications: e.target.checked
                      }))}
                    />
                  }
                  label="Enable notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.accessibility}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        accessibility: e.target.checked
                      }))}
                    />
                  }
                  label="Accessibility requirements"
                />
                
                <TextField
                  select
                  label="Travel Style"
                  value={preferences.travelStyle}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    travelStyle: e.target.value
                  }))}
                  SelectProps={{
                    native: true,
                  }}
                  fullWidth
                >
                  <option value="budget">Budget Traveler</option>
                  <option value="balanced">Balanced</option>
                  <option value="luxury">Luxury Traveler</option>
                  <option value="adventure">Adventure Seeker</option>
                  <option value="cultural">Cultural Explorer</option>
                </TextField>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/')}
            >
              Skip for Now
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleSave}
              disabled={preferences.interests.length === 0}
            >
              Save Preferences
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PreferencesSetup;