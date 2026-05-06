const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    category: "Rooms"
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    category: "Iconic Cities"
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    category: "Camping"
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    category: "Castles"
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 800,
    location: "Portland",
    country: "United States",
    category: "Camping"
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    category: "Rooms"
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    category: "Camping"
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    category: "Rooms"
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    category: "Arctic"
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    category: "Farms"
  },
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    image: {
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    category: "Trending"
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description:
      "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    image: {
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
    category: "Rooms"
  },
  {
    title: "Historic Brownstone in Boston",
    description:
      "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    image: {
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 2200,
    location: "Boston",
    country: "United States",
    category: "Iconic Cities"
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    image: {
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    category: "Rooms"
  },
  {
    title: "Luxury Villa in the Maldives",
    description:
      "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    image: {
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    category: "Luxury"
  },
  {
    title: "Beachfront Villa Bali",
    description:
      "Beautiful beachfront villa with private access to pristine white sand beach and crystal clear waters.",
    image: {
      url: "https://images.unsplash.com/photo-1566660097343-bcf74f61d868?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 2800,
    location: "Bali",
    country: "Indonesia",
    category: "Beach Houses"
  },
  {
    title: "Luxury Mountain Villa",
    description:
      "Exclusive luxury villa nestled in the mountains with panoramic views and world-class amenities.",
    image: {
      url: "https://images.unsplash.com/photo-1570129477492-45201003c6c7?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 4500,
    location: "Swiss Alps",
    country: "Switzerland",
    category: "Villas"
  },
  {
    title: "Cozy English Cottage",
    description:
      "Traditional English cottage with charm, character, and all modern comforts for a perfect countryside escape.",
    image: {
      url: "https://images.unsplash.com/photo-1576578302519-b247b08d4984?auto=format&fit=crop&w=800&q=60",
      filename: "listingimage"
    },
    price: 950,
    location: "Lake District",
    country: "United Kingdom",
    category: "Cottages"
  },
];

module.exports = { data: sampleListings };
