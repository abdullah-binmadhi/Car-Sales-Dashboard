import Papa from 'papaparse';
import _ from 'lodash';

// Memoization cache
const memoizationCache = new Map();
const MAX_CACHE_SIZE = 100;

// Function to parse price strings and convert to numbers
export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  
  // Remove currency symbols and commas
  const cleaned = priceString.replace(/[$,]/g, '').trim();
  
  // Handle price ranges (take the average)
  if (cleaned.includes('-')) {
    const [min, max] = cleaned.split('-').map(p => parseFloat(p.trim()) || 0);
    return (min + max) / 2;
  }
  
  // Handle single price values
  return parseFloat(cleaned) || 0;
};

// Function to parse performance values (0-100 km/h)
export const parsePerformance = (perfString) => {
  if (!perfString) return 0;
  
  // Remove "sec" and extract the number
  const cleaned = perfString.replace(/sec/gi, '').trim();
  return parseFloat(cleaned) || 0;
};

// Function to parse horsepower values
export const parseHorsepower = (hpString) => {
  if (!hpString) return 0;
  
  // Remove "hp" and extract the number
  const cleaned = hpString.replace(/hp/gi, '').replace(/,/g, '').trim();
  return parseFloat(cleaned) || 0;
};

// Function to parse torque values
export const parseTorque = (torqueString) => {
  if (!torqueString) return 0;
  
  // Remove "Nm" and extract the number
  const cleaned = torqueString.replace(/nm/gi, '').trim();
  return parseFloat(cleaned) || 0;
};

// Function to parse speed values
export const parseSpeed = (speedString) => {
  if (!speedString) return 0;
  
  // Remove "km/h" and extract the number
  const cleaned = speedString.replace(/km\/h/gi, '').trim();
  return parseFloat(cleaned) || 0;
};

// Function to clean and standardize fuel types
export const standardizeFuelType = (fuelType) => {
  if (!fuelType) return 'Unknown';
  
  const lowerFuel = fuelType.toLowerCase().trim();
  
  if (lowerFuel.includes('petrol') || lowerFuel.includes('gasoline')) return 'Petrol';
  if (lowerFuel.includes('diesel')) return 'Diesel';
  if (lowerFuel.includes('electric')) return 'Electric';
  if (lowerFuel.includes('hybrid')) return 'Hybrid';
  if (lowerFuel.includes('hydrogen')) return 'Hydrogen';
  if (lowerFuel.includes('cng')) return 'CNG';
  if (lowerFuel.includes('plug in hyrbrid')) return 'Hybrid';
  
  return fuelType;
};

// Function to clean and standardize engine types
export const standardizeEngineType = (engine) => {
  if (!engine) return 'Unknown';
  
  const lowerEngine = engine.toLowerCase().trim();
  
  if (lowerEngine.includes('v8')) return 'V8';
  if (lowerEngine.includes('v6')) return 'V6';
  if (lowerEngine.includes('v10')) return 'V10';
  if (lowerEngine.includes('v12')) return 'V12';
  if (lowerEngine.includes('i4') || lowerEngine.includes('inline-4')) return 'I4';
  if (lowerEngine.includes('i3') || lowerEngine.includes('inline-3')) return 'I3';
  if (lowerEngine.includes('i6') || lowerEngine.includes('inline-6')) return 'I6';
  if (lowerEngine.includes('electric motor')) return 'Electric Motor';
  
  return engine;
};

// Function to process raw car data
export const processCarData = (rawData) => {
  return rawData.map(car => ({
    ...car,
    price: parsePrice(car['Cars Prices']),
    performance: parsePerformance(car['Performance(0 - 100 )KM/H']),
    horsePower: parseHorsepower(car['HorsePower']),
    torque: parseTorque(car['Torque']),
    totalSpeed: parseSpeed(car['Total Speed']),
    fuelType: standardizeFuelType(car['Fuel Types']),
    engineType: standardizeEngineType(car['Engines']),
    companyName: car['Company Names']?.trim() || 'Unknown',
    modelName: car['Cars Names']?.trim() || 'Unknown'
  })).filter(car => car.price > 0); // Filter out cars with invalid prices
};

// Function to load and parse CSV data
export const loadCarData = async (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const processedData = processCarData(results.data);
          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Function to get unique brands from car data
export const getUniqueBrands = (carData) => {
  return [...new Set(carData.map(car => car.companyName))].sort();
};

// Function to get unique fuel types from car data
export const getUniqueFuelTypes = (carData) => {
  return [...new Set(carData.map(car => car.fuelType))].sort();
};

// Memoized function to get unique body types (derived from model names or other heuristics)
export const getUniqueBodyTypes = _.memoize((carData) => {
  // For now, we'll use a simple heuristic based on model names
  const bodyTypes = carData.map(car => {
    const model = car['Cars Names']?.toLowerCase() || '';
    if (model.includes('suv') || model.includes('x1') || model.includes('x3') || model.includes('x5') || model.includes('x7')) {
      return 'SUV';
    } else if (model.includes('sedan') || model.includes('saloon')) {
      return 'Sedan';
    } else if (model.includes('hatchback') || model.includes('hb')) {
      return 'Hatchback';
    } else if (model.includes('coupe') || model.includes('sports')) {
      return 'Coupe';
    } else if (model.includes('convertible') || model.includes('cabriolet') || model.includes('roadster')) {
      return 'Convertible';
    } else if (model.includes('wagon') || model.includes('estate') || model.includes('touring')) {
      return 'Wagon';
    } else if (model.includes('van') || model.includes('mpv') || model.includes('minivan')) {
      return 'Van/MPV';
    } else if (model.includes('pickup') || model.includes('truck')) {
      return 'Pickup';
    } else {
      return 'Other';
    }
  });
  
  return [...new Set(bodyTypes)].sort();
}, (carData) => {
  // Create a cache key based on the data
  if (!carData) return 'null';
  return carData.length;
});

// Memoized function to calculate KPIs
export const calculateKPIs = _.memoize((carData) => {
  if (!carData || carData.length === 0) {
    return {
      totalVehicles: 0,
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      mostExpensiveCar: null
    };
  }
  
  const prices = carData.map(car => car.price).filter(price => price > 0);
  
  return {
    totalVehicles: carData.length,
    averagePrice: prices.length > 0 ? _.round(_.sum(prices) / prices.length, 2) : 0,
    minPrice: prices.length > 0 ? _.min(prices) : 0,
    maxPrice: prices.length > 0 ? _.max(prices) : 0,
    mostExpensiveCar: carData.reduce((mostExpensive, car) => 
      car.price > (mostExpensive?.price || 0) ? car : mostExpensive, null)
  };
}, (carData) => {
  // Create a cache key based on the data
  if (!carData) return 'null';
  return carData.length;
});

// Function to filter car data based on filters
export const filterCarData = (carData, filters) => {
  // Pre-calculate body types for all cars to avoid repeated calculations
  const carBodyTypes = carData.map(car => getUniqueBodyTypes([car])[0]);
  
  return carData.filter((car, index) => {
    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(car.companyName)) {
      return false;
    }
    
    // Price range filter
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) {
      return false;
    }
    
    // Year range filter (assuming we'll derive year from model or have a separate year field)
    // For now, we'll skip this as the dataset doesn't have a clear year field
    
    // Fuel type filter
    if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
      return false;
    }
    
    // Body type filter
    if (filters.bodyTypes.length > 0) {
      const carBodyType = carBodyTypes[index];
      if (!filters.bodyTypes.includes(carBodyType)) {
        return false;
      }
    }
    
    return true;
  });
};

// Memoized function to aggregate data for brand performance chart
export const getBrandPerformanceData = _.memoize((carData) => {
  const grouped = _.groupBy(carData, 'companyName');
  
  return Object.entries(grouped).map(([brand, cars]) => ({
    brand,
    averagePrice: _.round(_.meanBy(cars, 'price'), 2),
    carCount: cars.length,
    averagePerformance: _.round(_.meanBy(cars, 'performance'), 2),
    averageHorsePower: _.round(_.meanBy(cars, 'horsePower'), 2)
  })).sort((a, b) => b.carCount - a.carCount);
}, (carData) => {
  // Create a cache key based on the data
  if (!carData) return 'null';
  return carData.length;
});

// Memoized function to aggregate data for price distribution chart
export const getPriceDistributionData = _.memoize((carData, bucketCount = 10) => {
  if (carData.length === 0) return [];
  
  const prices = carData.map(car => car.price).filter(price => price > 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice;
  const bucketSize = range / bucketCount;
  
  const buckets = Array(bucketCount).fill(0).map((_, i) => ({
    min: minPrice + (i * bucketSize),
    max: minPrice + ((i + 1) * bucketSize),
    count: 0
  }));
  
  prices.forEach(price => {
    const bucketIndex = Math.min(Math.floor((price - minPrice) / bucketSize), bucketCount - 1);
    buckets[bucketIndex].count++;
  });
  
  return buckets.map((bucket, index) => ({
    name: `$${Math.round(bucket.min)} - $${Math.round(bucket.max)}`,
    min: bucket.min,
    max: bucket.max,
    count: bucket.count,
    percentage: _.round((bucket.count / prices.length) * 100, 2)
  }));
}, (carData, bucketCount) => {
  // Create a cache key based on the data and bucket count
  if (!carData) return `null-${bucketCount}`;
  return `${carData.length}-${bucketCount}`;
});

// Function to get market share data
export const getMarketShareData = _.memoize((carData) => {
  const grouped = _.groupBy(carData, 'companyName');
  
  return Object.entries(grouped).map(([brand, cars]) => ({
    name: brand,
    value: cars.length,
    percentage: _.round((cars.length / carData.length) * 100, 2)
  })).sort((a, b) => b.value - a.value);
}, (carData) => {
  // Create a cache key based on the data
  if (!carData) return 'null';
  return carData.length;
});