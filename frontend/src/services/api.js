// API Service for TravelSensei Frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Helper method for making requests
  async makeRequest(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        
        // Handle validation errors
        if (response.status === 400 && errorData.errors) {
          const validationMessages = errorData.errors.map(err => err.msg).join(', ');
          throw new Error(validationMessages);
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // AI Methods
  async generateItinerary(preferences) {
    return this.makeRequest('/ai/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  async chatWithAI(message, conversationId = null) {
    return this.makeRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  }

  async getRecommendations(preferences) {
    return this.makeRequest('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  // Itinerary Methods
  async getItineraries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/itineraries?${queryString}` : '/itineraries';
    return this.makeRequest(url);
  }

  async getItinerary(id) {
    return this.makeRequest(`/itineraries/${id}`);
  }

  async createItinerary(itineraryData) {
    return this.makeRequest('/itineraries', {
      method: 'POST',
      body: JSON.stringify(itineraryData),
    });
  }

  async updateItinerary(id, itineraryData) {
    return this.makeRequest(`/itineraries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itineraryData),
    });
  }

  async deleteItinerary(id) {
    return this.makeRequest(`/itineraries/${id}`, {
      method: 'DELETE',
    });
  }

  async likeItinerary(id, liked) {
    return this.makeRequest(`/itineraries/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ liked }),
    });
  }

  async saveItinerary(id, saved) {
    return this.makeRequest(`/itineraries/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ saved }),
    });
  }

  async getMyItineraries(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/itineraries/my/all?${queryString}` : '/itineraries/my/all';
    return this.makeRequest(url);
  }

  // Booking Methods
  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/bookings?${queryString}` : '/bookings';
    return this.makeRequest(url);
  }

  async getBooking(id) {
    return this.makeRequest(`/bookings/${id}`);
  }

  async createBooking(bookingData) {
    return this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id, bookingData) {
    return this.makeRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id, reason) {
    return this.makeRequest(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getBookingStats() {
    return this.makeRequest('/bookings/stats');
  }

  // Review Methods
  async getItineraryReviews(itineraryId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/reviews/itinerary/${itineraryId}?${queryString}` : `/reviews/itinerary/${itineraryId}`;
    return this.makeRequest(url);
  }

  async getReview(id) {
    return this.makeRequest(`/reviews/${id}`);
  }

  async createReview(reviewData) {
    return this.makeRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(id, reviewData) {
    return this.makeRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id) {
    return this.makeRequest(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async markReviewHelpful(id, helpful) {
    return this.makeRequest(`/reviews/${id}/helpful`, {
      method: 'POST',
      body: JSON.stringify({ helpful }),
    });
  }

  async reportReview(id, reason, description) {
    return this.makeRequest(`/reviews/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, description }),
    });
  }

  async getMyReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/reviews/my/all?${queryString}` : '/reviews/my/all';
    return this.makeRequest(url);
  }

  async getMyReviewStats() {
    return this.makeRequest('/reviews/my/stats');
  }

  // User Methods
  async getUserStats() {
    return this.makeRequest('/users/stats');
  }

  // Upload Methods
  async uploadSingleImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    return this.makeRequest('/upload/single', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
        ...this.getAuthHeaders(),
      },
      body: formData,
    });
  }

  async uploadMultipleImages(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    return this.makeRequest('/upload/multiple', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
        ...this.getAuthHeaders(),
      },
      body: formData,
    });
  }

  // Utility Methods
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for easier imports
export const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  generateItinerary,
  chatWithAI,
  getRecommendations,
  getItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  likeItinerary,
  saveItinerary,
  getMyItineraries,
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingStats,
  getItineraryReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview,
  getMyReviews,
  getMyReviewStats,
  getUserStats,
  uploadSingleImage,
  uploadMultipleImages,
  isAuthenticated,
  getCurrentUser,
  healthCheck,
} = apiService;