import React from 'react';
import { Restaurant } from '../types';
import { ShoppingCart, Users, MapPin } from 'lucide-react';

interface MenuHeaderProps {
  restaurant: Restaurant;
  table: string;
  cartItemCount: number;
  onCartClick: () => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  restaurant,
  table,
  cartItemCount,
  onCartClick
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{restaurant.logo}</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{restaurant.name}</h1>
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Table {table}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>Dine In</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onCartClick}
            className="relative p-2.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};