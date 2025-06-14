import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, Restaurant } from '../types';
import { MenuHeader } from './MenuHeader';
import { CategoryTabs } from './CategoryTabs';
import { SearchBar } from './SearchBar';
import { VirtualizedMenu } from './VirtualizedMenu';
import { CartModal } from './CartModal';
import { useCart } from '../hooks/useCart';

const BASE_URL = 'https://bytz-be.onrender.com';

interface MenuProps {
  restaurantId: string;
  table: string;
}

export const Menu: React.FC<MenuProps> = ({ restaurantId, table }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['All']);
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItemsMap
  } = useCart();

  useEffect(() => {
    // Fetch restaurant details
    fetch(`${BASE_URL}/restaurants/${restaurantId}`)
      .then(res => res.json())
      .then(data => setRestaurant(data))
      .catch(() => setRestaurant(null));
      console.log(restaurantId);

    // Fetch menu items
    fetch(`${BASE_URL}/restaurants/${restaurantId}/menu`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
      })
      .catch(() => setItems([]));

    // Fetch categories
    fetch(`${BASE_URL}/restaurants/${restaurantId}/categories`)
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(() => setAvailableCategories(['All']));
  }, [restaurantId]);

  // Filter items by category first, then by search in VirtualizedMenu
  const categoryFilteredItems = useMemo(() => {
    let filtered = items;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [items, activeCategory, searchTerm]);

  // Clear search when category changes
  useEffect(() => {
    setSearchTerm('');
  }, [activeCategory]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader
        restaurant={restaurant}
        table={table}
        cartItemCount={getCartItemCount()}
        onCartClick={() => setIsCartOpen(true)}
      />
      <CategoryTabs
        categories={availableCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />
      <VirtualizedMenu
        items={categoryFilteredItems}
        onAddToCart={addToCart}
        searchTerm={searchTerm}
        cartItems={getCartItemsMap()}
        onUpdateQuantity={updateQuantity}
      />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        total={getCartTotal()}
        restaurantId={restaurantId}
        table={table}
      />
    </div>
  );
};