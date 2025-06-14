import { MenuItem, Restaurant } from '../types';

export const restaurants: Record<string, Restaurant> = {
  'resto1': {
    id: 'resto1',
    name: 'Bella Vista',
    logo: '🍝',
    theme: {
      primary: '#000000',
      secondary: '#374151'
    }
  },
  'resto2': {
    id: 'resto2',
    name: 'Golden Spoon',
    logo: '🥘',
    theme: {
      primary: '#374151',
      secondary: '#10B981'
    }
  }
};

// Generate more items for testing large menus with many categories
const generateMenuItems = (baseItems: MenuItem[], count: number): MenuItem[] => {
  const categories = [
    'Appetizers', 'Pasta', 'Pizza', 'Seafood', 'Salads', 'Steaks', 'Desserts', 'Beverages', 
    'Soups', 'Sandwiches', 'Burgers', 'Tacos', 'Sushi', 'Ramen', 'Curry', 'Rice Dishes',
    'Noodles', 'Grilled Items', 'Fried Items', 'Baked Goods', 'Ice Cream', 'Coffee', 'Tea',
    'Smoothies', 'Juices', 'Cocktails', 'Wine', 'Beer', 'Spirits', 'Mocktails',
    'Breakfast', 'Brunch', 'Lunch Specials', 'Dinner Specials', 'Kids Menu', 'Healthy Options',
    'Vegan', 'Vegetarian', 'Gluten-Free', 'Low-Carb', 'Keto', 'Paleo', 'Mediterranean',
    'Asian Fusion', 'Mexican', 'Italian', 'French', 'Indian', 'Thai', 'Chinese', 'Japanese',
    'Korean', 'Vietnamese', 'Middle Eastern', 'Greek', 'Spanish', 'American', 'BBQ',
    'Street Food', 'Comfort Food', 'Fine Dining', 'Casual Dining', 'Fast Food', 'Snacks',
    'Finger Foods', 'Sharing Plates', 'Family Meals', 'Chef Specials', 'Seasonal Items',
    'Holiday Specials', 'Limited Time', 'New Arrivals', 'Popular Items', 'Recommended',
    'Spicy', 'Mild', 'Sweet', 'Savory', 'Tangy', 'Creamy', 'Crispy', 'Tender',
    'Hot Dishes', 'Cold Dishes', 'Raw Items', 'Cooked Items', 'Grains', 'Proteins',
    'Dairy', 'Nuts', 'Fruits', 'Vegetables', 'Herbs', 'Spices', 'Sauces', 'Dips',
    'Sides', 'Mains', 'Starters', 'Finishers', 'Light Bites', 'Heavy Meals',
    'Quick Bites', 'Slow Cooked', 'Fresh Made', 'House Made', 'Imported', 'Local',
    'Organic', 'Farm Fresh', 'Artisanal', 'Gourmet', 'Premium', 'Budget Friendly'
  ];
  
  const adjectives = ['Delicious', 'Premium', 'Classic', 'Signature', 'Special', 'Traditional', 'Gourmet', 'Fresh', 'Homemade', 'Artisan'];
  const items = [...baseItems];
  
  for (let i = baseItems.length; i < count; i++) {
    const category = categories[i % categories.length];
    const adjective = adjectives[i % adjectives.length];
    const baseItem = baseItems[i % baseItems.length];
    
    items.push({
      id: `item-${i + 1}`,
      name: `${adjective} ${baseItem.name} ${i + 1}`,
      description: `${baseItem.description} - A wonderful variation with unique flavors and premium ingredients.`,
      price: Math.round((Math.random() * 30 + 10) * 100) / 100,
      image: baseItem.image,
      category: category,
      isPopular: Math.random() > 0.8,
      isVegetarian: Math.random() > 0.7
    });
  }
  
  return items;
};

const baseItems: MenuItem[] = [
  {
    id: '001',
    name: 'Truffle Pasta',
    description: 'Handmade pasta with black truffle, parmesan, and fresh herbs',
    price: 28.99,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Pasta',
    isPopular: true
  },
  {
    id: '002',
    name: 'Margherita Pizza',
    description: 'Classic wood-fired pizza with fresh mozzarella, tomatoes, and basil',
    price: 22.50,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Pizza',
    isVegetarian: true
  },
  {
    id: '003',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 32.00,
    image: 'https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Seafood'
  },
  {
    id: '004',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan, croutons, and caesar dressing',
    price: 16.99,
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Salads',
    isVegetarian: true
  },
  {
    id: '005',
    name: 'Ribeye Steak',
    description: 'Premium aged ribeye with roasted potatoes and red wine jus',
    price: 45.00,
    image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Steaks',
    isPopular: true
  },
  {
    id: '006',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 12.99,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Desserts'
  },
  {
    id: '007',
    name: 'Seafood Paella',
    description: 'Traditional Spanish rice dish with fresh seafood and saffron',
    price: 34.99,
    image: 'https://images.pexels.com/photos/16743848/pexels-photo-16743848.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Seafood',
    isPopular: true
  },
  {
    id: '008',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms and truffle oil',
    price: 26.50,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Pasta',
    isVegetarian: true
  }
];

export const menuItems: Record<string, MenuItem[]> = {
  'resto1': generateMenuItems(baseItems, 1000), // Generate 1000 items with 100+ categories
  'resto2': generateMenuItems(baseItems.slice(0, 4), 500) // Generate 500 items for second restaurant
};

export const categories = ['All', 'Appetizers', 'Pasta', 'Pizza', 'Seafood', 'Salads', 'Steaks', 'Desserts', 'Beverages', 'Soups', 'Sandwiches', 'Curry', 'Rice'];