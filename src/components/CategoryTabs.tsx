import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [categories]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Auto-scroll to active category
  useEffect(() => {
    if (scrollContainerRef.current && activeCategory) {
      const activeButton = scrollContainerRef.current.querySelector(
        `[data-category="${activeCategory}"]`
      ) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeCategory]);

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setShowGrid(false);
    setShowSearch(false);
    setSearchTerm('');
  };

  return (
    <div className="sticky top-[72px] z-40 bg-white border-b">
      {/* Main category bar */}
      <div className="relative">
        <div className="flex items-center px-3 py-2">
          {/* Scroll left button */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-1 z-10 p-1.5 bg-white shadow-md rounded-full border hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Categories scroll container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide flex-1 px-8"
          >
            {categories.slice(0, 20).map((category) => (
              <button
                key={category}
                data-category={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all duration-200 text-sm flex-shrink-0 ${
                  activeCategory === category
                    ? 'bg-black text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
            
            {/* Show more indicator */}
            {categories.length > 20 && (
              <button
                onClick={() => setShowGrid(true)}
                className="px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-sm flex-shrink-0 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center space-x-1"
              >
                <span>+{categories.length - 20}</span>
                <Grid3X3 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Scroll right button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-1 z-10 p-1.5 bg-white shadow-md rounded-full border hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`ml-2 p-1.5 rounded-full transition-colors ${
              showSearch ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Grid view toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`ml-1 p-1.5 rounded-full transition-colors ${
              showGrid ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-3 py-2 border-t bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              autoFocus
            />
          </div>
          {searchTerm && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              <div className="grid grid-cols-2 gap-1">
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-2 text-left text-sm rounded transition-colors ${
                      activeCategory === category
                        ? 'bg-black text-white'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid view modal */}
      {showGrid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl m-4 max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">All Categories</h3>
              <button
                onClick={() => setShowGrid(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-3 text-left text-sm rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No categories found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};