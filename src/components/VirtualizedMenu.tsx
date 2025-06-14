import React, { useMemo, useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { MenuItemCard } from './MenuItemCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface VirtualizedMenuProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  searchTerm: string;
  cartItems: { [key: string]: number };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
}

const ITEMS_PER_PAGE = 20;

export const VirtualizedMenu: React.FC<VirtualizedMenuProps> = ({
  items,
  onAddToCart,
  searchTerm,
  cartItems,
  onUpdateQuantity
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<MenuItem[]>([]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, items]);

  // Update displayed items when page or filtered items change
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setDisplayedItems(filteredItems.slice(startIndex, endIndex));
  }, [filteredItems, currentPage]);

  const hasMore = currentPage * ITEMS_PER_PAGE < filteredItems.length;

  const loadMore = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const { targetRef, isFetching } = useInfiniteScroll(loadMore, hasMore, {
    threshold: 0.8,
    rootMargin: '200px'
  });

  return (
    <div className="px-3 py-4">
      {/* Results summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {searchTerm ? (
            <>Showing {displayedItems.length} of {filteredItems.length} results for "{searchTerm}"</>
          ) : (
            <>Showing {displayedItems.length} of {filteredItems.length} items</>
          )}
        </p>
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {displayedItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            cartQuantity={cartItems[item.id] || 0}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>

      {/* Infinite scroll trigger and loading indicator */}
      {filteredItems.length > 0 && (
        <div className="mt-6">
          {hasMore && (
            <div
              ref={targetRef}
              className="flex justify-center items-center py-4"
            >
              {isFetching ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading more items...</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400">Scroll to load more</p>
                </div>
              )}
            </div>
          )}
          
          {!hasMore && displayedItems.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">You've reached the end • {filteredItems.length} items total</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {filteredItems.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500 text-sm">Try searching with different keywords</p>
        </div>
      )}

      {/* Empty state for no items */}
      {filteredItems.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No menu items available</h3>
          <p className="text-gray-500 text-sm">Please check back later</p>
        </div>
      )}
    </div>
  );
};