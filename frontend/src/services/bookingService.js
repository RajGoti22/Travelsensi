// Booking service for handling hotel, flight, and activity bookings
import axios from 'axios';

class BookingService {

  // Fetch destination suggestions for autocomplete
  async getDestinationSuggestions(query) {
    try {
      const response = await axios.get('/api/hotels/destinations', { params: { query } });
      return { success: true, data: response.data?.data || [] };
    } catch (error) {
      console.error('Get destination suggestions failed:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // Fetch user bookings from backend
  async getUserBookings() {
    try {
      const response = await axios.get('/api/bookings');
      return { success: true, data: response.data?.data?.bookings || response.data.bookings || [] };
    } catch (error) {
      console.error('Get user bookings failed:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // Get hotel details from new backend API
  async getHotelDetails({ hotel_id, checkin, checkout, guests = 2 }) {
    try {
      const response = await axios.get(`http://localhost:5001/api/hotels/${hotel_id}`);
      
      // Map the hotel data to match expected format
      const hotel = response.data;
      const mappedHotel = {
        hotel_name: hotel.name,
        price: Math.floor(hotel.price_per_night / 100), // Convert to USD for display
        rating: hotel.rating,
        location: `${hotel.city}, ${hotel.state}`,
        description: hotel.description,
        amenities: hotel.amenities,
        image_url: hotel.image_url,
        city: hotel.city,
        state: hotel.state,
        price_per_night: hotel.price_per_night,
      };
      
      return { success: true, data: mappedHotel };
    } catch (error) {
      console.error('Get hotel details failed:', error);
      return { success: false, error: error.message };
    }
  }
  constructor() {
    this.baseURL = process.env.REACT_APP_BOOKING_API_URL || 'https://api.travelsensei.com';
    this.apiKey = process.env.REACT_APP_BOOKING_API_KEY || 'demo-key';
  }

  // Hotel Booking Methods
  async searchHotels(location, checkIn, checkOut, guests = 2, filters = {}) {
    try {
      // First try to search by city if location is provided
      let response;
      if (location) {
        response = await axios.get('http://localhost:5001/api/hotels', {
          params: { city: location }
        });
      } else {
        response = await axios.get('http://localhost:5001/api/hotels');
      }

      // Map the API response to match the expected hotel card format
      const mappedHotels = (response.data || []).map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        rating: hotel.rating,
        reviews: Math.floor(Math.random() * 2000) + 100, // Mock reviews count
        price: Math.floor(hotel.price_per_night / 100), // Convert to USD for display
        originalPrice: Math.floor(hotel.price_per_night / 100) + 50,
        currency: 'USD',
        image: hotel.image_url,
        amenities: hotel.amenities,
        location: `${hotel.city}, ${hotel.state}`,
        description: hotel.description,
        cancellationPolicy: 'Free cancellation until 24 hours before check-in',
        roomType: 'Deluxe Room',
        availability: 'Available',
        checkIn,
        checkOut,
        guests,
        totalPrice: Math.floor(hotel.price_per_night / 100) * this.calculateNights(checkIn, checkOut),
      }));

      return {
        success: true,
        data: mappedHotels,
        total: mappedHotels.length,
      };
    } catch (error) {
      console.error('Hotel search failed:', error);
      return { success: false, error: error.message };
    }
  }

  async bookHotel(hotelId, bookingDetails) {
    try {
      // Compose booking payload for backend
      const payload = {
        type: 'hotel',
        hotelId,
        ...bookingDetails,
      };
      const response = await axios.post('/api/bookings', payload);
      return { success: true, booking: response.data };
    } catch (error) {
      console.error('Hotel booking failed:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // Flight Booking Methods
  async searchFlights(origin, destination, departDate, returnDate = null, passengers = 1) {
    try {
      const mockFlights = this.generateMockFlights(origin, destination, departDate, returnDate, passengers);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        data: mockFlights,
        total: mockFlights.length,
      };
    } catch (error) {
      console.error('Flight search failed:', error);
      return { success: false, error: error.message };
    }
  }

  async bookFlight(flightId, bookingDetails) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const booking = {
        id: `flight_${Date.now()}`,
        type: 'flight',
        flightId,
        ...bookingDetails,
        status: 'confirmed',
        confirmationCode: `FLT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        bookingDate: new Date().toISOString(),
      };

      return { success: true, booking };
    } catch (error) {
      console.error('Flight booking failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Activity Booking Methods
  async searchActivities(destination, date = null, category = null) {
    try {
      const mockActivities = this.generateMockActivities(destination, date, category);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        data: mockActivities,
        total: mockActivities.length,
      };
    } catch (error) {
      console.error('Activity search failed:', error);
      return { success: false, error: error.message };
    }
  }

  async bookActivity(activityId, bookingDetails) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking = {
        id: `activity_${Date.now()}`,
        type: 'activity',
        activityId,
        ...bookingDetails,
        status: 'confirmed',
        confirmationCode: `ACT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        bookingDate: new Date().toISOString(),
      };

      return { success: true, booking };
    } catch (error) {
      console.error('Activity booking failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Payment Processing
  async processPayment(paymentDetails, bookingDetails) {
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success/failure
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo
      
      if (!isSuccess) {
        throw new Error('Payment was declined. Please check your card details.');
      }

      const payment = {
        id: `pay_${Date.now()}`,
        amount: bookingDetails.totalPrice,
        currency: 'USD',
        status: 'completed',
        method: paymentDetails.paymentMethod,
        transactionId: `txn_${Math.random().toString(36).substr(2, 12)}`,
        processedAt: new Date().toISOString(),
      };

      return { success: true, payment };
    } catch (error) {
      console.error('Payment processing failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Booking Management
  async getUserBookings(userId) {
    try {
      // Mock user bookings
      const mockBookings = [
        {
          id: 'booking_001',
          type: 'hotel',
          destination: 'Tokyo, Japan',
          checkIn: '2025-10-15',
          checkOut: '2025-10-20',
          guests: 2,
          status: 'confirmed',
          totalPrice: 850,
          confirmationCode: 'HTL12345678',
        },
        {
          id: 'booking_002',
          type: 'flight',
          origin: 'New York',
          destination: 'Tokyo',
          departDate: '2025-10-14',
          returnDate: '2025-10-21',
          passengers: 2,
          status: 'confirmed',
          totalPrice: 1200,
          confirmationCode: 'FLT87654321',
        },
      ];

      return { success: true, bookings: mockBookings };
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelBooking(bookingId, reason = '') {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Booking cancelled successfully',
        refundAmount: Math.floor(Math.random() * 500) + 200, // Mock refund
      };
    } catch (error) {
      console.error('Booking cancellation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Mock Data Generators
  generateMockHotels(destination, checkIn, checkOut, guests) {
    const hotels = [
      {
        id: 'hotel_001',
        name: 'Grand Luxury Hotel',
        rating: 5,
        reviews: 1245,
        price: 285,
        originalPrice: 320,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service'],
        location: `Downtown ${destination}`,
        description: 'Luxurious 5-star hotel in the heart of the city with world-class amenities.',
        cancellationPolicy: 'Free cancellation until 24 hours before check-in',
        roomType: 'Deluxe Room',
        availability: 'Last 2 rooms at this price',
      },
      {
        id: 'hotel_002',
        name: 'Modern City Resort',
        rating: 4,
        reviews: 867,
        price: 165,
        originalPrice: 190,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        amenities: ['Free WiFi', 'Pool', 'Gym', 'Business Center'],
        location: `Business District ${destination}`,
        description: 'Contemporary hotel perfect for business and leisure travelers.',
        cancellationPolicy: 'Free cancellation until 48 hours before check-in',
        roomType: 'Standard Room',
        availability: 'Good availability',
      },
      {
        id: 'hotel_003',
        name: 'Boutique Garden Hotel',
        rating: 4.5,
        reviews: 532,
        price: 195,
        originalPrice: 220,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
        amenities: ['Free WiFi', 'Garden', 'Restaurant', 'Bar', 'Pet Friendly'],
        location: `Historic Quarter ${destination}`,
        description: 'Charming boutique hotel with beautiful gardens and personalized service.',
        cancellationPolicy: 'Free cancellation until 72 hours before check-in',
        roomType: 'Superior Room',
        availability: 'Limited availability',
      },
    ];

    return hotels.map(hotel => ({
      ...hotel,
      checkIn,
      checkOut,
      guests,
      totalPrice: hotel.price * this.calculateNights(checkIn, checkOut),
    }));
  }

  generateMockFlights(origin, destination, departDate, returnDate, passengers) {
    const airlines = [
      { code: 'AA', name: 'American Airlines', logo: '🛩️' },
      { code: 'UA', name: 'United Airlines', logo: '✈️' },
      { code: 'DL', name: 'Delta Airlines', logo: '🛫' },
      { code: 'JL', name: 'Japan Airlines', logo: '🏯' },
    ];

    const flights = [];
    
    airlines.forEach((airline, index) => {
      const basePrice = 450 + (index * 100);
      const flight = {
        id: `flight_${airline.code}_${Date.now()}_${index}`,
        airline: airline.name,
        airlineCode: airline.code,
        logo: airline.logo,
        origin,
        destination,
        departDate,
        returnDate,
        passengers,
        price: basePrice,
        originalPrice: basePrice + 50,
        currency: 'USD',
        duration: '12h 30m',
        stops: index === 0 ? 'Direct' : '1 Stop',
        departTime: `${8 + index * 2}:${index * 15}0`,
        arriveTime: `${20 + index}:${30 + index * 10}`,
        aircraft: 'Boeing 777-300ER',
        baggage: '2 x 23kg',
        seatClass: 'Economy',
        cancellationPolicy: 'Cancellation fees may apply',
        totalPrice: basePrice * passengers,
      };
      
      if (returnDate) {
        flight.returnDepartTime = `${10 + index}:${20 + index * 5}`;
        flight.returnArriveTime = `${14 + index * 2}:${40 + index * 15}`;
        flight.totalPrice *= 1.8; // Round trip multiplier
      }
      
      flights.push(flight);
    });

    return flights;
  }

  generateMockActivities(destination, date, category) {
    const activities = [
      {
        id: 'activity_001',
        name: 'City Walking Tour',
        category: 'Tours',
        rating: 4.8,
        reviews: 2341,
        price: 45,
        currency: 'USD',
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400',
        description: 'Discover the hidden gems and rich history of the city with our expert local guides.',
        includes: ['Professional guide', 'Walking tour', 'Historical insights', 'Photo opportunities'],
        meetingPoint: 'City Hall Square',
        cancellationPolicy: 'Free cancellation up to 24 hours before',
        availability: 'Available daily',
        maxCapacity: 20,
      },
      {
        id: 'activity_002',
        name: 'Cooking Class Experience',
        category: 'Food & Drink',
        rating: 4.9,
        reviews: 876,
        price: 85,
        currency: 'USD',
        duration: '4 hours',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        description: 'Learn to cook authentic local cuisine with professional chefs in a hands-on class.',
        includes: ['All ingredients', 'Professional chef instruction', 'Recipe booklet', 'Full meal'],
        meetingPoint: 'Culinary Studio Downtown',
        cancellationPolicy: 'Free cancellation up to 48 hours before',
        availability: 'Tuesday to Sunday',
        maxCapacity: 12,
      },
      {
        id: 'activity_003',
        name: 'Sunset Photography Tour',
        category: 'Photography',
        rating: 4.7,
        reviews: 654,
        price: 65,
        currency: 'USD',
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
        description: 'Capture stunning sunset views of the city skyline with professional photography guidance.',
        includes: ['Professional photographer guide', 'Photography tips', 'Best viewpoints', 'Photo editing basics'],
        meetingPoint: 'Observation Deck',
        cancellationPolicy: 'Free cancellation up to 12 hours before',
        availability: 'Daily (weather permitting)',
        maxCapacity: 8,
      },
    ];

    return activities.filter(activity => 
      !category || activity.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Utility Methods
  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

export const bookingService = new BookingService();
export default bookingService;