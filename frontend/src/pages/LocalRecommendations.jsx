import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Rating,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Phone,
  Language,
  Schedule,
  AttachMoney,
  Close,
  ViewList,
  Map,
} from '@mui/icons-material';
import { localRecommendationsService } from '../services/localRecommendationsService';
import { useAuth } from '../contexts/AuthContext';
import TravelMap from '../components/maps/TravelMap';

const RecommendationCard = ({ recommendation, onViewDetails }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardMedia
      component="img"
      height="200"
      image={recommendation.image}
      alt={recommendation.name}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h6" component="div">
        {recommendation.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Rating value={recommendation.rating} readOnly size="small" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({recommendation.reviews} reviews)
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
        {recommendation.location}
      </Typography>
      <Chip 
        label={recommendation.category} 
        size="small" 
        color="primary" 
        variant="outlined"
        sx={{ mb: 1 }}
      />
      <Typography variant="body2" sx={{ mb: 1 }}>
        {recommendation.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="primary">
          {recommendation.priceRange}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => onViewDetails(recommendation)}
        >
          View Details
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const LocalRecommendations = ({ destination = 'tokyo' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, [destination]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await localRecommendationsService.getRecommendations(destination);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRecommendations();
      return;
    }

    try {
      setLoading(true);
      const results = await localRecommendationsService.searchRecommendations(destination, searchTerm);
      setRecommendations(results);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filters = {
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      priceRange: priceFilter !== 'all' ? priceFilter : undefined,
      minRating: ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
    };

    const filtered = localRecommendationsService.applyFilters(recommendations, filters);
    return filtered;
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecommendation(null);
  };

  const filteredRecommendations = applyFilters();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={loadRecommendations} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search recommendations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="restaurant">Restaurants</MenuItem>
                <MenuItem value="activity">Activities</MenuItem>
                <MenuItem value="attraction">Attractions</MenuItem>
                <MenuItem value="shopping">Shopping</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Price</InputLabel>
              <Select
                value={priceFilter}
                label="Price"
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="$">$ - Budget</MenuItem>
                <MenuItem value="$$">$$ - Moderate</MenuItem>
                <MenuItem value="$$$">$$$ - Expensive</MenuItem>
                <MenuItem value="$$$$">$$$$ - Very Expensive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                value={ratingFilter}
                label="Rating"
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="4">4+ Stars</MenuItem>
                <MenuItem value="3">3+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: 56 }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Results Header with View Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {filteredRecommendations.length} recommendations found
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(event, newViewMode) => {
            if (newViewMode !== null) {
              setViewMode(newViewMode);
            }
          }}
          size="small"
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="map" aria-label="map view">
            <Map />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* List View */}
      {viewMode === 'list' && (
        <>
          <Grid container spacing={3}>
            {filteredRecommendations.map((recommendation) => (
              <Grid item xs={12} sm={6} md={4} key={recommendation.id}>
                <RecommendationCard
                  recommendation={recommendation}
                  onViewDetails={handleViewDetails}
                />
              </Grid>
            ))}
          </Grid>

          {filteredRecommendations.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No recommendations found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <Box sx={{ mb: 3 }}>
          <TravelMap
            destination={destination}
            recommendations={filteredRecommendations}
            height="600px"
            enableUserLocation={true}
          />
          {filteredRecommendations.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No recommendations to display on map
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedRecommendation && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">
                  {selectedRecommendation.name}
                </Typography>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedRecommendation.image}
                  alt={selectedRecommendation.name}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={selectedRecommendation.rating} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({selectedRecommendation.reviews} reviews)
                  </Typography>
                </Box>
                <Chip 
                  label={selectedRecommendation.category} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedRecommendation.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {selectedRecommendation.location}
                    </Typography>
                  </Box>
                  {selectedRecommendation.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {selectedRecommendation.phone}
                      </Typography>
                    </Box>
                  )}
                  {selectedRecommendation.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Language sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {selectedRecommendation.website}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Price Range: {selectedRecommendation.priceRange}
                    </Typography>
                  </Box>
                  {selectedRecommendation.hours && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {selectedRecommendation.hours}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {selectedRecommendation.tips && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Local Tips
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedRecommendation.tips}
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" onClick={handleCloseDialog}>
                Add to Itinerary
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default LocalRecommendations;
