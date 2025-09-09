import React, { useState, useEffect, memo } from 'react';
import { useDashboard } from '../context/DashboardContext';

// Memoized brand filter item component
const BrandFilterItem = memo(({ brand, isChecked, onChange }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={`brand-${brand}`}
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
      />
      <label 
        htmlFor={`brand-${brand}`} 
        className="ml-2 text-gray-300 text-sm"
      >
        {brand}
      </label>
    </div>
  );
});

// Memoized fuel type filter item component
const FuelTypeFilterItem = memo(({ fuelType, isChecked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`fuel-${fuelType}`}
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
      />
      <label 
        htmlFor={`fuel-${fuelType}`} 
        className="ml-2 text-gray-300 text-sm"
      >
        {fuelType}
      </label>
    </div>
  );
});

// Memoized body type filter item component
const BodyTypeFilterItem = memo(({ bodyType, isChecked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`body-${bodyType}`}
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
      />
      <label 
        htmlFor={`body-${bodyType}`} 
        className="ml-2 text-gray-300 text-sm"
      >
        {bodyType}
      </label>
    </div>
  );
});

const FilterControls = () => {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    brandOptions, 
    fuelTypeOptions, 
    bodyTypeOptions 
  } = useDashboard();
  
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // Debounce filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(localFilters);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localFilters, setFilters]);
  
  // Handle brand selection
  const handleBrandChange = (brand) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
      
    setLocalFilters(prev => ({
      ...prev,
      brands: newBrands
    }));
  };
  
  // Handle fuel type selection
  const handleFuelTypeChange = (fuelType) => {
    const newFuelTypes = localFilters.fuelTypes.includes(fuelType)
      ? localFilters.fuelTypes.filter(f => f !== fuelType)
      : [...localFilters.fuelTypes, fuelType];
      
    setLocalFilters(prev => ({
      ...prev,
      fuelTypes: newFuelTypes
    }));
  };
  
  // Handle body type selection
  const handleBodyTypeChange = (bodyType) => {
    const newBodyTypes = localFilters.bodyTypes.includes(bodyType)
      ? localFilters.bodyTypes.filter(b => b !== bodyType)
      : [...localFilters.bodyTypes, bodyType];
      
    setLocalFilters(prev => ({
      ...prev,
      bodyTypes: newBodyTypes
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min, max) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    resetFilters();
    setSearchTerm('');
  };
  
  // Filter options based on search term
  const filteredBrandOptions = brandOptions.filter(brand => 
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 mb-8 animate-stagger">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button 
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Reset All Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Brand Filter */}
        <div className="lg:col-span-2">
          <label className="block text-gray-400 text-sm font-medium mb-2">Brands</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {filteredBrandOptions.map((brand) => (
              <BrandFilterItem
                key={brand}
                brand={brand}
                isChecked={localFilters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
            ))}
          </div>
        </div>
        
        {/* Price Range Filter */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Price Range: ${localFilters.priceRange[0].toLocaleString()} - ${localFilters.priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="5000000"
              step="10000"
              value={localFilters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value), localFilters.priceRange[1])}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="5000000"
              step="10000"
              value={localFilters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(localFilters.priceRange[0], Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Fuel Type Filter */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Fuel Type</label>
          <div className="space-y-2">
            {fuelTypeOptions.map((fuelType) => (
              <FuelTypeFilterItem
                key={fuelType}
                fuelType={fuelType}
                isChecked={localFilters.fuelTypes.includes(fuelType)}
                onChange={() => handleFuelTypeChange(fuelType)}
              />
            ))}
          </div>
        </div>
        
        {/* Body Type Filter */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Body Type</label>
          <div className="space-y-2">
            {bodyTypeOptions.map((bodyType) => (
              <BodyTypeFilterItem
                key={bodyType}
                bodyType={bodyType}
                isChecked={localFilters.bodyTypes.includes(bodyType)}
                onChange={() => handleBodyTypeChange(bodyType)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;