// Mock hotel data (formerly in hotel-api-server.js)
// This is used only when USE_MOCK_HOTELS=true
module.exports = [
  {
    id: 1,
    name: 'The Taj Mahal Palace',
    city: 'Mumbai',
    state: 'Maharashtra',
    price_per_night: 25000,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1596384664689-33827d0f4d6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDR8fHRhaiUyMG1haGFsJTIwcGFsYWNlfGVufDB8fHx8MTY3ODg4ODU4MA&ixlib=rb-4.0.3&q=80&w=1080',
    description: 'An iconic luxury hotel located in the heart of Mumbai, offering breathtaking views of the Gateway of India and the Arabian Sea.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Sea View Rooms']
  },
  {
    id: 2,
    name: 'The Oberoi Amarvilas',
    city: 'Agra',
    state: 'Uttar Pradesh',
    price_per_night: 35000,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1587135941944-a60015a8f422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHRhaiUyMG1haGFsfGVufDB8fHx8MTY3ODg4ODU4MA&ixlib=rb-4.0.3&q=80&w=1080',
    description: 'Located just 600 meters from the Taj Mahal, this hotel offers unrestricted views of the monument from every room.',
    amenities: ['Free WiFi', 'Private Balcony', 'Spa', 'Fine Dining']
  },
  {
    id: 3,
    name: 'The Leela Palace',
    city: 'New Delhi',
    state: 'Delhi',
    price_per_night: 22000,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGhvdGVsJTIwcm9vbXxlbnwwfHx8fDE2Nzg4ODg1ODQ&ixlib=rb-4.0.3&q=80&w=1080',
    description: 'A modern palace hotel that exemplifies the grace and elegance of Lutyens\' Delhi.',
    amenities: ['Rooftop Pool', 'Free WiFi', 'Fitness Center', 'Award-winning Restaurants']
  },
  {
    id: 4,
    name: 'Rambagh Palace',
    city: 'Jaipur',
    state: 'Rajasthan',
    price_per_night: 45000,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEyfHxob3RlbHxlbnwwfHx8fDE2Nzg4ODg1ODQ&ixlib=rb-4.0.3&q=80&w=1080',
    description: 'Known as the "Jewel of Jaipur", this former Maharaja\'s residence offers an unparalleled experience of royal living.',
    amenities: ['Indoor Pool', 'Spa', 'Gardens', 'Vintage Car Airport Transfer']
  },
  {
    id: 5,
    name: 'The Leela Palace Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    price_per_night: 18000,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE3fHxob3RlbHxlbnwwfHx8fDE2Nzg4ODg1ODQ&ixlib=rb-4.0.3&q=80&w=1080',
    description: 'Inspired by the architectural glory of the Mysore Palace, this hotel stands amidst seven acres of lush gardens.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Library Bar', 'Fitness Center']
  }
];
