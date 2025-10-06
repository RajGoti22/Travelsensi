import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  SmartToy,
  CalendarToday,
  AttachMoney,
  Group,
  LocationOn,
  Refresh,
  Save,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { aiService } from '../../services/aiService';
import { itineraryService } from '../../services/itineraryService';
import { useNavigate } from 'react-router-dom';

const steps = ['Destination & Dates', 'Preferences & Budget', 'AI Generation', 'Review & Customize'];

const ItineraryCreator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    startDate: null,
    endDate: null,
    duration: 7,
    budget: 2500,
    currency: 'USD',
    groupSize: 'solo',
    travelStyle: 'cultural',
    interests: [],
    accommodationPreference: 'mid-range',
    transportationPreference: 'mixed'
  });

  const destinations = [
    'Tokyo, Japan',
    'Paris, France',
    'Bali, Indonesia',
    'New York, USA',
    'London, UK',
    'Rome, Italy',
    'Barcelona, Spain',
    'Bangkok, Thailand',
    'Sydney, Australia',
    'Dubai, UAE'
  ];

  const travelStyles = [
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { value: 'luxury', label: 'Luxury', icon: '💎' },
    { value: 'budget', label: 'Budget', icon: '💰' },
    { value: 'romantic', label: 'Romantic', icon: '💕' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'business', label: 'Business', icon: '💼' }
  ];

  const interestOptions = [
    'Art & Museums', 'Food & Dining', 'History', 'Architecture', 'Nature',
    'Adventure Sports', 'Nightlife', 'Shopping', 'Photography', 'Wellness',
    'Local Culture', 'Music & Entertainment', 'Religion & Spirituality', 'Markets'
  ];

  const groupSizes = [
    { value: 'solo', label: 'Solo (1 person)', icon: '🚶' },
    { value: 'couple', label: 'Couple (2 people)', icon: '👫' },
    { value: 'family', label: 'Family (3-5 people)', icon: '👨‍👩‍👧‍👦' },
    { value: 'group', label: 'Group (6+ people)', icon: '👥' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate duration when dates change
      if (field === 'startDate' || field === 'endDate') {
        const startDate = field === 'startDate' ? value : prev.startDate;
        const endDate = field === 'endDate' ? value : prev.endDate;
        
        if (startDate && endDate) {
          const timeDiff = endDate.getTime() - startDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
          newData.duration = Math.max(1, daysDiff);
        }
      }
      
      return newData;
    });
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setSaveDialogOpen(true);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const request = {
        destination: formData.destination,
        duration: formData.duration,
        budget: formData.budget,
        interests: formData.interests,
        travelStyle: formData.travelStyle,
        groupSize: formData.groupSize,
        dates: {
          startDate: formData.startDate?.toISOString(),
          endDate: formData.endDate?.toISOString()
        }
      };

      const itinerary = await aiService.generateItinerary(request);
      setGeneratedItinerary(itinerary);
      setActiveStep(3); // Move to review step
    } catch (error) {
      setError(error.message || 'Failed to generate itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!generatedItinerary) return;

    setIsSaving(true);
    try {
      await itineraryService.saveItinerary(generatedItinerary, user.id);
      setSaveDialogOpen(false);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateDay = async (dayIndex) => {
    console.log('Regenerating day', dayIndex + 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
              }}
            >
              Where would you like to go?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mb: 4,
                fontSize: '1.1rem',
              }}
            >
              Choose your dream destination and travel dates
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Destination
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select your destination</em>
                    </MenuItem>
                    {destinations.map((dest) => (
                      <MenuItem key={dest} value={dest}>{dest}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Start Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  End Date
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('endDate', new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                />
              </Grid>

              {formData.startDate && formData.endDate && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      backgroundColor: '#f0f9ff',
                      borderRadius: 2,
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#0369a1',
                        fontSize: '1.1rem',
                      }}
                    >
                      Trip Duration: {formData.duration} {formData.duration === 1 ? 'day' : 'days'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
              }}
            >
              Customize Your Experience
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mb: 4,
                fontSize: '1.1rem',
              }}
            >
              Tell us about your travel preferences and budget
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 3,
                    fontSize: '1rem',
                  }}
                >
                  Travel Style
                </Typography>
                <Grid container spacing={2}>
                  {travelStyles.map((style) => (
                    <Grid item xs={6} sm={4} md={3} key={style.value} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Paper
                        sx={{
                          width: { xs: 90, sm: 100, md: 110 },
                          height: { xs: 90, sm: 100, md: 110 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: formData.travelStyle === style.value ? '#3b82f6' : '#e2e8f0',
                          backgroundColor: formData.travelStyle === style.value ? '#eff6ff' : 'white',
                          transition: 'all 0.3s ease',
                          boxShadow: formData.travelStyle === style.value ? '0 2px 12px rgba(59,130,246,0.10)' : 'none',
                          p: 1.5,
                          m: 0.5,
                          '&:hover': {
                            borderColor: '#3b82f6',
                            backgroundColor: '#f8fafc',
                            boxShadow: '0 4px 16px rgba(59,130,246,0.13)',
                          },
                        }}
                        onClick={() => handleInputChange('travelStyle', style.value)}
                      >
                        <Typography variant="h3" sx={{ mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.7rem', md: '2rem' } }}>
                          {style.icon}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: formData.travelStyle === style.value ? '#1e40af' : '#374151',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          }}
                        >
                          {style.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 3,
                    fontSize: '1rem',
                  }}
                >
                  Group Size
                </Typography>
                <Grid container spacing={2}>
                  {groupSizes.map((size) => (
                    <Grid item xs={6} sm={3} key={size.value} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Paper
                        sx={{
                          width: { xs: 90, sm: 100, md: 110 },
                          height: { xs: 90, sm: 100, md: 110 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: formData.groupSize === size.value ? '#059669' : '#e2e8f0',
                          backgroundColor: formData.groupSize === size.value ? '#ecfdf5' : 'white',
                          transition: 'all 0.3s ease',
                          boxShadow: formData.groupSize === size.value ? '0 2px 12px rgba(5,150,105,0.10)' : 'none',
                          p: 1.5,
                          m: 0.5,
                          '&:hover': {
                            borderColor: '#059669',
                            backgroundColor: '#f0fdf4',
                            boxShadow: '0 4px 16px rgba(5,150,105,0.13)',
                          },
                        }}
                        onClick={() => handleInputChange('groupSize', size.value)}
                      >
                        <Typography variant="h4" sx={{ mb: 0.5, fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.8rem' } }}>
                          {size.icon}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: formData.groupSize === size.value ? '#065f46' : '#374151',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                          }}
                        >
                          {size.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* Budget section: always below group size, full width, separate Grid */}
            <Grid container spacing={0} sx={{ mt: { xs: 4, sm: 4 }, mb: 1 }}>
              <Grid item xs={12} sm={8} md={6} lg={5} xl={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'rgba(10, 58, 100, 0.78)',
                      mb: 1,
                      fontSize: '1rem',
                    }}
                  >
                    Budget:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <TextField
                      type="number"
                      size="small"
                      value={formData.budget}
                      onChange={e => handleInputChange('budget', Math.max(500, Math.min(20000, Number(e.target.value))))}
                      inputProps={{ min: 500, max: 20000, step: 100, style: { textAlign: 'center', width: 120, color: 'rgba(10, 58, 100, 0.78)', fontWeight: 700, fontSize: '1.1rem' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontWeight: 700,
                          background: '#f5faff',
                          color: 'rgba(10, 58, 100, 0.78)',
                          borderColor: 'rgba(10, 58, 100, 0.78)',
                          fontSize: '1.1rem',
                          height: 44,
                          px: 1,
                          '& fieldset': {
                            borderColor: 'rgba(10, 58, 100, 0.78)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(10, 58, 100, 0.88)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(10, 58, 100, 1)',
                          },
                        },
                        maxWidth: 140,
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={formData.currency}
                        onChange={e => handleInputChange('currency', e.target.value)}
                        sx={{
                          color: 'rgba(10, 58, 100, 0.78)',
                          fontWeight: 700,
                          background: '#f5faff',
                          borderRadius: 3,
                          height: 44,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(10, 58, 100, 0.78)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(10, 58, 100, 0.88)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(10, 58, 100, 1)',
                          },
                        }}
                      >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="INR">INR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                        <MenuItem value="JPY">JPY</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(10, 58, 100, 0.78)', ml: 0.5, fontWeight: 500, mt: 1 }}>
                    Enter your budget (min $500, max $20,000)
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#374151',
                    mb: 3,
                    fontSize: '1rem',
                  }}
                >
                  What interests you most?
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {interestOptions.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      clickable
                      variant={formData.interests.includes(interest) ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: 3,
                        px: 1,
                        py: 0.5,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        backgroundColor: formData.interests.includes(interest) ? '#3b82f6' : 'transparent',
                        color: formData.interests.includes(interest) ? 'white' : '#374151',
                        borderColor: formData.interests.includes(interest) ? '#3b82f6' : '#d1d5db',
                        '&:hover': {
                          backgroundColor: formData.interests.includes(interest) ? '#2563eb' : '#f3f4f6',
                          borderColor: '#3b82f6',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => handleInterestToggle(interest)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
              }}
            >
              <SmartToy sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
              }}
            >
              Generate Your Itinerary
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mb: 4,
                fontSize: '1.1rem',
              }}
            >
              Our AI will create a personalized travel plan for {formData.destination}
            </Typography>

            {!isGenerating && (
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerateItinerary}
                sx={{
                  borderRadius: 2,
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Generate My Itinerary
              </Button>
            )}

            {isGenerating && (
              <Box sx={{ py: 4 }}>
                <CircularProgress
                  size={50}
                  sx={{ color: '#3b82f6', mb: 3 }}
                />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                  Creating your perfect itinerary...
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  This may take a few moments while our AI crafts your personalized adventure.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
                textAlign: 'center',
              }}
            >
              Your Perfect Itinerary
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mb: 4,
                fontSize: '1.1rem',
                textAlign: 'center',
              }}
            >
              Review and customize your AI-generated travel plan
            </Typography>

            {generatedItinerary && (
              <Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>
                          {generatedItinerary.days?.length || formData.duration}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                          Days
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#059669', mb: 1 }}>
                          {generatedItinerary.totalBudget ? `$${generatedItinerary.totalBudget.toLocaleString()}` : `$${formData.budget.toLocaleString()}`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                          Total Budget
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                          {generatedItinerary.activities?.length || '15+'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                          Activities
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mb: 1 }}>
                          {formData.destination.split(',')[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                          Destination
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Unknown step
            </Typography>
          </Box>
        );
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return formData.destination && formData.duration > 0;
      case 1:
        return formData.travelStyle && formData.groupSize && formData.budget > 0;
      case 2:
        return true;
      case 3:
        return generatedItinerary !== null;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
          Create Your Perfect Itinerary
        </Typography>
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
          Let AI design your dream trip in minutes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          {steps.map((label, index) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: index <= activeStep ? 'rgba(10, 58, 100, 0.78)' : '#9ca3af',
                fontWeight: index <= activeStep ? 600 : 400,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: index <= activeStep ? 'rgba(10, 58, 100, 0.78)' : '#e5e7eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  mr: index < steps.length - 1 ? 2 : 0,
                }}
              >
                {index + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  mr: index < steps.length - 1 ? 3 : 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {label}
              </Typography>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 40,
                    height: 2,
                    backgroundColor: index < activeStep ? 'rgba(10, 58, 100, 0.78)' : '#e5e7eb',
                    mr: 3,
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
              )}
            </Box>
          ))}
        </Box>

        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e2e8f0' }}>
          {renderStepContent()}
          
          {/* Navigation Buttons inside the white container */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid #f1f5f9' }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: 2,
                color: 'rgba(10, 58, 100, 0.78)',
                borderColor: 'rgba(10, 58, 100, 0.3)',
                backgroundColor: 'transparent',
                textTransform: 'none',
                minWidth: 90,
                '&:hover': {
                  backgroundColor: 'rgba(10, 58, 100, 0.05)',
                  borderColor: 'rgba(10, 58, 100, 0.5)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  color: '#d1d5db',
                  borderColor: '#e5e7eb',
                  backgroundColor: 'transparent',
                },
                transition: 'all 0.2s ease',
              }}
            >
              ← Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepComplete(activeStep)}
              sx={{
                px: 4,
                py: 1,
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(10, 58, 100, 0.78) 0%, rgba(8, 47, 80, 0.85) 100%)',
                color: 'white',
                textTransform: 'none',
                minWidth: 100,
                boxShadow: '0 2px 8px rgba(10, 58, 100, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(10, 58, 100, 0.85) 0%, rgba(8, 47, 80, 0.9) 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(10, 58, 100, 0.35)',
                },
                '&:disabled': {
                  background: '#e5e7eb',
                  color: '#9ca3af',
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {activeStep === steps.length - 1 ? 'Save Itinerary' : 'Next →'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Your Itinerary</DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to save this itinerary to your account?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveItinerary}
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItineraryCreator;