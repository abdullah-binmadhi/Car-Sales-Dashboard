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
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
            Interactive
          </span>
        </div>
        <button 
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Brand Filter */}
        <div className="lg:col-span-2 glass rounded-xl p-4 border border-gray-700/30">
          <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
            <span className="mr-2">🚗</span> Brands
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="glass rounded-xl p-4 border border-gray-700/30">
          <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
            <span className="mr-2">💰</span> Price Range
          </label>
          <div className="mb-2 text-center text-gray-300">
            ${localFilters.priceRange[0].toLocaleString()} - ${localFilters.priceRange[1].toLocaleString()}
          </div>
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
        <div className="glass rounded-xl p-4 border border-gray-700/30">
          <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
            <span className="mr-2">⛽</span> Fuel Type
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
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
        <div className="glass rounded-xl p-4 border border-gray-700/30">
          <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
            <span className="mr-2">🚘</span> Body Type
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
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