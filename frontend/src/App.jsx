import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './utils/theme-enhanced';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PreferencesSetup from './pages/profile/PreferencesSetup';
import ItineraryCreator from './pages/itinerary/ItineraryCreator';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import HotelBooking from './pages/booking/HotelBooking';
import FlightBooking from './pages/booking/FlightBooking';
import ActivityBooking from './pages/booking/ActivityBooking';
import BookingHub from './pages/booking/BookingHub';
import BookingManagement from './pages/booking/BookingManagement';
import CommunityReviews from './pages/community/CommunityReviews';
import SocialFeed from './pages/community/SocialFeed';

/**
 * Main App component with routing and theme setup
 * @returns {React.ReactElement}
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/explore" element={<Layout><Explore /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/profile/preferences" 
              element={
                <ProtectedRoute>
                  <PreferencesSetup />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Booking routes */}
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <BookingHub />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/booking/hotels" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <HotelBooking />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/booking/flights" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <FlightBooking />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/booking/activities" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ActivityBooking />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/booking/manage" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <BookingManagement />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Community routes */}
            <Route 
              path="/community/reviews" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <CommunityReviews />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/community/social" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <SocialFeed />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy reviews route */}
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <CommunityReviews />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Temporary itinerary creator route */}
            <Route 
              path="/itinerary/create" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ItineraryCreator />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Temporary itinerary redirect */}
            <Route 
              path="/itinerary" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <h2>Itinerary Planner Coming Soon!</h2>
                      <p>Start planning your next adventure here.</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;