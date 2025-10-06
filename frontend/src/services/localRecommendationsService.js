/**
 * Local Recommendations Service
 * Handles discovery of local experiences, events, restaurants, and activities
 */

import axios from 'axios';

/**
 * @typedef {Object} LocalRecommendation
 * @property {string} id - Unique recommendation ID
 * @property {string} name - Recommendation name
 * @property {string} description - Description
 * @property {string} category - Category (restaurant, activity, event, attraction)
 * @property {string} subcategory - Subcategory for filtering
 * @property {Object} location - Location details
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {string} location.address - Full address
 * @property {string} location.neighborhood - Neighborhood name
 * @property {number} rating - Rating (1-5)
 * @property {number} reviewCount - Number of reviews
 * @property {string} priceRange - Price range ($, $$, $$$, $$$$)
 * @property {number} estimatedCost - Estimated cost in USD
 * @property {string[]} images - Array of image URLs
 * @property {string[]} tags - Recommendation tags
 * @property {Object} contact - Contact information
 * @property {string} contact.phone - Phone number
 * @property {string} contact.website - Website URL
 * @property {Object} hours - Operating hours
 * @property {boolean} isOpen - Currently open status
 * @property {number} distance - Distance from user location (km)
 * @property {string} lastUpdated - Last update timestamp
 */

/**
 * @typedef {Object} LocalEvent
 * @property {string} id - Event ID
 * @property {string} title - Event title
 * @property {string} description - Event description
 * @property {string} category - Event category
 * @property {Object} location - Event location
 * @property {Object} dateTime - Event date and time
 * @property {string} dateTime.start - Start date/time
 * @property {string} dateTime.end - End date/time
 * @property {number} price - Ticket price
 * @property {string} ticketUrl - Ticket purchase URL
 * @property {string[]} images - Event images
 * @property {Object} organizer - Event organizer info
 */

// Mock data for different cities
const MOCK_RECOMMENDATIONS = {
  'tokyo': {
    restaurants: [
      {
        id: 'tokyo-rest-1',
        name: 'Sukiyabashi Jiro',
        description: 'World-renowned sushi restaurant with exceptional omakase experience',
        category: 'restaurant',
        subcategory: 'sushi',
        location: {
          lat: 35.6712,
          lng: 139.7640,
          address: 'Tsukamoto Sogyo Building B1F, 4-2-15 Ginza, Chuo City, Tokyo',
          neighborhood: 'Ginza'
        },
        rating: 4.9,
        reviewCount: 2847,
        priceRange: '$$$$',
        estimatedCost: 300,
        images: ['/images/jiro-sushi.jpg'],
        tags: ['michelin-star', 'omakase', 'traditional', 'reservations-required'],
        contact: {
          phone: '+81-3-3535-3600',
          website: 'https://sukiyabashijiro.co.jp'
        },
        hours: { open: '11:30', close: '14:00' },
        isOpen: true,
        distance: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'tokyo-rest-2',
        name: 'Ramen Yashichi',
        description: 'Authentic tonkotsu ramen in a cozy neighborhood setting',
        category: 'restaurant',
        subcategory: 'ramen',
        location: {
          lat: 35.7096,
          lng: 139.8107,
          address: '2-14-1 Nippori, Arakawa City, Tokyo',
          neighborhood: 'Nippori'
        },
        rating: 4.6,
        reviewCount: 892,
        priceRange: '$',
        estimatedCost: 12,
        images: ['/images/ramen-yashichi.jpg'],
        tags: ['local-favorite', 'casual', 'late-night'],
        contact: {
          phone: '+81-3-3891-2345',
          website: null
        },
        hours: { open: '18:00', close: '02:00' },
        isOpen: true,
        distance: 2.3,
        lastUpdated: new Date().toISOString()
      }
    ],
    activities: [
      {
        id: 'tokyo-act-1',
        name: 'TeamLab Borderless',
        description: 'Immersive digital art museum with interactive installations',
        category: 'activity',
        subcategory: 'museum',
        location: {
          lat: 35.6249,
          lng: 139.7798,
          address: '1-3-8 Ariake, Koto City, Tokyo',
          neighborhood: 'Odaiba'
        },
        rating: 4.7,
        reviewCount: 15420,
        priceRange: '$$',
        estimatedCost: 32,
        images: ['/images/teamlab.jpg'],
        tags: ['art', 'digital', 'unique', 'instagram-worthy'],
        contact: {
          phone: '+81-3-6368-4292',
          website: 'https://borderless.teamlab.art'
        },
        hours: { open: '10:00', close: '19:00' },
        isOpen: true,
        distance: 3.8,
        lastUpdated: new Date().toISOString()
      }
    ],
    events: [
      {
        id: 'tokyo-event-1',
        title: 'Cherry Blossom Festival',
        description: 'Annual hanami celebration in Ueno Park with food stalls and performances',
        category: 'festival',
        location: {
          lat: 35.7145,
          lng: 139.7737,
          address: 'Ueno Park, Taito City, Tokyo',
          neighborhood: 'Ueno'
        },
        dateTime: {
          start: '2025-04-01T10:00:00Z',
          end: '2025-04-10T20:00:00Z'
        },
        price: 0,
        ticketUrl: null,
        images: ['/images/hanami.jpg'],
        organizer: {
          name: 'Tokyo Parks Association',
          contact: 'info@tokyoparks.jp'
        }
      }
    ]
  },
  'paris': {
    restaurants: [
      {
        id: 'paris-rest-1',
        name: 'L\'Ami Jean',
        description: 'Beloved bistro serving modern French cuisine with Basque influences',
        category: 'restaurant',
        subcategory: 'french',
        location: {
          lat: 48.8584,
          lng: 2.3053,
          address: '27 Rue Malar, 75007 Paris, France',
          neighborhood: '7th Arrondissement'
        },
        rating: 4.5,
        reviewCount: 3456,
        priceRange: '$$$',
        estimatedCost: 85,
        images: ['/images/lamijean.jpg'],
        tags: ['bistro', 'traditional', 'wine-pairing', 'reservations-recommended'],
        contact: {
          phone: '+33-1-47-05-86-89',
          website: 'https://lamijean.fr'
        },
        hours: { open: '19:00', close: '23:30' },
        isOpen: false,
        distance: 0.8,
        lastUpdated: new Date().toISOString()
      }
    ],
    activities: [
      {
        id: 'paris-act-1',
        name: 'Louvre Private Tour',
        description: 'Skip-the-line private guided tour of the world\'s largest art museum',
        category: 'activity',
        subcategory: 'museum',
        location: {
          lat: 48.8606,
          lng: 2.3376,
          address: 'Rue de Rivoli, 75001 Paris, France',
          neighborhood: '1st Arrondissement'
        },
        rating: 4.8,
        reviewCount: 8923,
        priceRange: '$$$',
        estimatedCost: 120,
        images: ['/images/louvre-tour.jpg'],
        tags: ['art', 'history', 'guided-tour', 'skip-the-line'],
        contact: {
          phone: '+33-1-40-20-53-17',
          website: 'https://www.louvre.fr'
        },
        hours: { open: '09:00', close: '18:00' },
        isOpen: true,
        distance: 1.2,
        lastUpdated: new Date().toISOString()
      }
    ],
    events: []
  },
  'bali': {
    restaurants: [
      {
        id: 'bali-rest-1',
        name: 'Locavore',
        description: 'Award-winning restaurant focusing on local Indonesian ingredients',
        category: 'restaurant',
        subcategory: 'fine-dining',
        location: {
          lat: -8.5139,
          lng: 115.2608,
          address: 'Jl. Dewisita No.10, Ubud, Gianyar Regency, Bali',
          neighborhood: 'Ubud'
        },
        rating: 4.7,
        reviewCount: 2156,
        priceRange: '$$$',
        estimatedCost: 95,
        images: ['/images/locavore.jpg'],
        tags: ['fine-dining', 'local-ingredients', 'tasting-menu', 'sustainable'],
        contact: {
          phone: '+62-361-977733',
          website: 'https://www.locavore.co.id'
        },
        hours: { open: '18:00', close: '23:00' },
        isOpen: true,
        distance: 0,
        lastUpdated: new Date().toISOString()
      }
    ],
    activities: [
      {
        id: 'bali-act-1',
        name: 'Rice Terrace Sunrise Trek',
        description: 'Early morning guided trek through UNESCO World Heritage rice terraces',
        category: 'activity',
        subcategory: 'outdoor',
        location: {
          lat: -8.3675,
          lng: 115.2189,
          address: 'Tegallalang Rice Terrace, Gianyar Regency, Bali',
          neighborhood: 'Tegallalang'
        },
        rating: 4.9,
        reviewCount: 4567,
        priceRange: '$$',
        estimatedCost: 45,
        images: ['/images/rice-terrace-trek.jpg'],
        tags: ['nature', 'sunrise', 'unesco', 'photography'],
        contact: {
          phone: '+62-812-3456-7890',
          website: 'https://balitrekking.com'
        },
        hours: { open: '05:00', close: '09:00' },
        isOpen: false,
        distance: 15.2,
        lastUpdated: new Date().toISOString()
      }
    ],
    events: []
  }
};

class LocalRecommendationsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_LOCAL_API_KEY || 'mock-key';
    this.baseURL = process.env.REACT_APP_LOCAL_API_URL || 'mock-service';
  }

  /**
   * Get local recommendations for a destination
   * @param {string} destination - Destination city
   * @param {Object} filters - Filter options
   * @param {string[]} filters.categories - Categories to include
   * @param {number} filters.maxDistance - Maximum distance in km
   * @param {string} filters.priceRange - Price range filter
   * @param {number} filters.minRating - Minimum rating
   * @param {boolean} filters.openNow - Only show currently open places
   * @returns {Promise<LocalRecommendation[]>}
   */
  async getRecommendations(destination, filters = {}) {
    try {
      await this.delay(800);
      
      const destinationKey = destination.toLowerCase().split(',')[0].replace(/[^a-z]/g, '');
      const cityData = MOCK_RECOMMENDATIONS[destinationKey] || MOCK_RECOMMENDATIONS.tokyo;
      
      let recommendations = [];
      
      // Combine all recommendation types
      if (cityData.restaurants) recommendations.push(...cityData.restaurants);
      if (cityData.activities) recommendations.push(...cityData.activities);
      if (cityData.attractions) recommendations.push(...cityData.attractions);
      
      // Apply filters
      recommendations = this.applyFilters(recommendations, filters);
      
      // Sort by rating and distance
      recommendations.sort((a, b) => {
        const ratingDiff = b.rating - a.rating;
        return ratingDiff !== 0 ? ratingDiff : a.distance - b.distance;
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw new Error('Failed to fetch local recommendations');
    }
  }

  /**
   * Get local events for a destination
   * @param {string} destination - Destination city
   * @param {Object} dateRange - Date range for events
   * @param {string} dateRange.start - Start date
   * @param {string} dateRange.end - End date
   * @returns {Promise<LocalEvent[]>}
   */
  async getEvents(destination, dateRange = {}) {
    try {
      await this.delay(600);
      
      const destinationKey = destination.toLowerCase().split(',')[0].replace(/[^a-z]/g, '');
      const cityData = MOCK_RECOMMENDATIONS[destinationKey] || MOCK_RECOMMENDATIONS.tokyo;
      
      let events = cityData.events || [];
      
      // Filter by date range if provided
      if (dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        events = events.filter(event => {
          const eventStart = new Date(event.dateTime.start);
          const eventEnd = new Date(event.dateTime.end);
          
          return (eventStart >= startDate && eventStart <= endDate) ||
                 (eventEnd >= startDate && eventEnd <= endDate) ||
                 (eventStart <= startDate && eventEnd >= endDate);
        });
      }
      
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch local events');
    }
  }

  /**
   * Get recommendations by specific category
   * @param {string} destination - Destination city
   * @param {string} category - Category (restaurant, activity, attraction)
   * @param {Object} filters - Additional filters
   * @returns {Promise<LocalRecommendation[]>}
   */
  async getByCategory(destination, category, filters = {}) {
    const allRecommendations = await this.getRecommendations(destination, {
      ...filters,
      categories: [category]
    });
    
    return allRecommendations.filter(rec => rec.category === category);
  }

  /**
   * Search recommendations by query
   * @param {string} destination - Destination city
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<LocalRecommendation[]>}
   */
  async searchRecommendations(destination, query, filters = {}) {
    const allRecommendations = await this.getRecommendations(destination, filters);
    
    const searchTerm = query.toLowerCase();
    
    return allRecommendations.filter(rec => 
      rec.name.toLowerCase().includes(searchTerm) ||
      rec.description.toLowerCase().includes(searchTerm) ||
      rec.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      rec.subcategory.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get trending recommendations
   * @param {string} destination - Destination city
   * @param {number} limit - Number of recommendations to return
   * @returns {Promise<LocalRecommendation[]>}
   */
  async getTrending(destination, limit = 10) {
    try {
      const recommendations = await this.getRecommendations(destination);
      
      // Sort by a combination of rating and review count to determine "trending"
      const trending = recommendations
        .sort((a, b) => {
          const scoreA = a.rating * Math.log(a.reviewCount + 1);
          const scoreB = b.rating * Math.log(b.reviewCount + 1);
          return scoreB - scoreA;
        })
        .slice(0, limit);
      
      return trending;
    } catch (error) {
      console.error('Error fetching trending recommendations:', error);
      throw error;
    }
  }

  /**
   * Get recommendations near a specific location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} radius - Search radius in km
   * @returns {Promise<LocalRecommendation[]>}
   */
  async getNearby(lat, lng, radius = 5) {
    try {
      await this.delay(500);
      
      // For demo purposes, return mock nearby recommendations
      // In a real app, this would use geolocation APIs
      const mockNearby = [
        {
          id: 'nearby-1',
          name: 'Local Coffee Shop',
          description: 'Cozy neighborhood coffee shop with artisanal brews',
          category: 'restaurant',
          subcategory: 'cafe',
          location: { lat, lng, address: 'Near your location', neighborhood: 'Local' },
          rating: 4.3,
          reviewCount: 156,
          priceRange: '$',
          estimatedCost: 8,
          images: ['/images/local-cafe.jpg'],
          tags: ['coffee', 'local', 'wifi'],
          contact: { phone: null, website: null },
          hours: { open: '07:00', close: '19:00' },
          isOpen: true,
          distance: 0.3,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      return mockNearby;
    } catch (error) {
      console.error('Error fetching nearby recommendations:', error);
      throw error;
    }
  }

  /**
   * Apply filters to recommendations
   * @param {LocalRecommendation[]} recommendations 
   * @param {Object} filters 
   * @returns {LocalRecommendation[]}
   */
  applyFilters(recommendations, filters) {
    let filtered = [...recommendations];
    
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(rec => filters.categories.includes(rec.category));
    }
    
    if (filters.maxDistance) {
      filtered = filtered.filter(rec => rec.distance <= filters.maxDistance);
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(rec => rec.priceRange === filters.priceRange);
    }
    
    if (filters.minRating) {
      filtered = filtered.filter(rec => rec.rating >= filters.minRating);
    }
    
    if (filters.openNow) {
      filtered = filtered.filter(rec => rec.isOpen);
    }
    
    if (filters.subcategory) {
      filtered = filtered.filter(rec => rec.subcategory === filters.subcategory);
    }
    
    return filtered;
  }

  /**
   * Simulate async delay
   * @param {number} ms 
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available categories for a destination
   * @param {string} destination - Destination city
   * @returns {Promise<string[]>}
   */
  async getCategories(destination) {
    try {
      const recommendations = await this.getRecommendations(destination);
      const categories = [...new Set(recommendations.map(rec => rec.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['restaurant', 'activity', 'attraction'];
    }
  }

  /**
   * Get subcategories for a specific category
   * @param {string} destination - Destination city
   * @param {string} category - Main category
   * @returns {Promise<string[]>}
   */
  async getSubcategories(destination, category) {
    try {
      const recommendations = await this.getByCategory(destination, category);
      const subcategories = [...new Set(recommendations.map(rec => rec.subcategory))];
      return subcategories.sort();
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  }
}

// Export singleton instance
export const localRecommendationsService = new LocalRecommendationsService();
export default localRecommendationsService;