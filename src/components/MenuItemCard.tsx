import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Minus, Star, Leaf, Check } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  cartQuantity = 0,
  onUpdateQuantity 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate add animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onAddToCart(item);
    setIsAdding(false);
    setShowAdded(true);
    
    // Hide success state after animation
    setTimeout(() => setShowAdded(false), 1000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex space-x-1">
          {item.isPopular && (
            <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow-sm">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>Popular</span>
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow-sm">
              <Leaf className="w-2.5 h-2.5 fill-current" />
              <span>Veg</span>
            </span>
          )}
        </div>
        
        {/* Cart quantity indicator */}
        {cartQuantity > 0 && (
          <div className="absolute top-2 right-2 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold shadow-lg">
            {cartQuantity}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-black transition-colors">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-black ml-2">₹{item.price}</span>
        </div>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
        
        {/* Add to cart or quantity controls - Made narrower */}
        <div className="flex justify-center">
          {cartQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || showAdded}
              className={`font-medium py-1.5 px-4 rounded-md transition-all duration-300 flex items-center justify-center space-x-1 text-xs min-w-[80px] ${
                showAdded
                  ? 'bg-green-500 text-white'
                  : isAdding
                  ? 'bg-gray-400 text-white'
                  : 'bg-black hover:bg-gray-800 text-white hover:shadow-md transform hover:scale-[1.02] active:scale-95'
              }`}
            >
              {showAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added!</span>
                </>
              ) : isAdding ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-md px-2 py-1 min-w-[80px]">
              <button
                onClick={() => handleQuantityChange(cartQuantity - 1)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-black"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-semibold text-black text-sm px-2">{cartQuantity}</span>
              <button
                onClick={() => handleQuantityChange(cartQuantity + 1)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-black"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};