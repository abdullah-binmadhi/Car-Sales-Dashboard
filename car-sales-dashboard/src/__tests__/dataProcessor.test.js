const { 
  parsePrice, 
  parsePerformance, 
  parseHorsepower, 
  parseTorque, 
  parseSpeed,
  standardizeFuelType,
  standardizeEngineType,
  processCarData,
  getUniqueBrands,
  getUniqueFuelTypes,
  getUniqueBodyTypes,
  calculateKPIs,
  filterCarData,
  getBrandPerformanceData,
  getPriceDistributionData,
  getMarketShareData
} = require('../utils/dataProcessor');

describe('dataProcessor', () => {
  describe('parsePrice', () => {
    it('should parse single price values', () => {
      expect(parsePrice('$1,100,000')).toBe(1100000);
      expect(parsePrice('$26,700')).toBe(26700);
    });

    it('should parse price ranges and return average', () => {
      expect(parsePrice('$12,000-$15,000')).toBe(13500);
    });

    it('should handle invalid price values', () => {
      expect(parsePrice('')).toBe(0);
      expect(parsePrice(null)).toBe(0);
      expect(parsePrice(undefined)).toBe(0);
    });
  });

  describe('parsePerformance', () => {
    it('should parse performance values', () => {
      expect(parsePerformance('2.5 sec')).toBe(2.5);
      expect(parsePerformance('10.5 sec')).toBe(10.5);
    });

    it('should handle invalid performance values', () => {
      expect(parsePerformance('')).toBe(0);
      expect(parsePerformance(null)).toBe(0);
    });
  });

  describe('parseHorsepower', () => {
    it('should parse horsepower values', () => {
      expect(parseHorsepower('963 hp')).toBe(963);
      expect(parseHorsepower('1,020 hp')).toBe(1020);
    });

    it('should handle invalid horsepower values', () => {
      expect(parseHorsepower('')).toBe(0);
      expect(parseHorsepower(null)).toBe(0);
    });
  });

  describe('standardizeFuelType', () => {
    it('should standardize fuel types', () => {
      expect(standardizeFuelType('Petrol')).toBe('Petrol');
      expect(standardizeFuelType('plug in hyrbrid')).toBe('Hybrid');
      expect(standardizeFuelType('Electric')).toBe('Electric');
    });

    it('should handle unknown fuel types', () => {
      expect(standardizeFuelType('')).toBe('Unknown');
      expect(standardizeFuelType('Hydrogen')).toBe('Hydrogen');
    });
  });

  describe('processCarData', () => {
    it('should process raw car data', () => {
      const rawData = [{
        'Company Names': 'FERRARI',
        'Cars Names': 'SF90 STRADALE',
        'Engines': 'V8',
        'CC/Battery Capacity': '3990 cc',
        'HorsePower': '963 hp',
        'Total Speed': '340 km/h',
        'Performance(0 - 100 )KM/H': '2.5 sec',
        'Cars Prices': '$1,100,000',
        'Fuel Types': 'plug in hyrbrid',
        'Seats': '2',
        'Torque': '800 Nm'
      }];

      const processedData = processCarData(rawData);
      expect(processedData).toHaveLength(1);
      expect(processedData[0]).toEqual({
        'Company Names': 'FERRARI',
        'Cars Names': 'SF90 STRADALE',
        'Engines': 'V8',
        'CC/Battery Capacity': '3990 cc',
        'HorsePower': '963 hp',
        'Total Speed': '340 km/h',
        'Performance(0 - 100 )KM/H': '2.5 sec',
        'Cars Prices': '$1,100,000',
        'Fuel Types': 'plug in hyrbrid',
        'Seats': '2',
        'Torque': '800 Nm',
        price: 1100000,
        performance: 2.5,
        horsePower: 963,
        torque: 800,
        totalSpeed: 340,
        fuelType: 'Hybrid',
        engineType: 'V8',
        companyName: 'FERRARI',
        modelName: 'SF90 STRADALE'
      });
    });
  });

  describe('calculateKPIs', () => {
    it('should calculate KPIs correctly', () => {
      const carData = [
        { price: 100000 },
        { price: 200000 },
        { price: 300000 }
      ];

      const kpis = calculateKPIs(carData);
      expect(kpis.totalVehicles).toBe(3);
      expect(kpis.averagePrice).toBe(200000);
      expect(kpis.minPrice).toBe(100000);
      expect(kpis.maxPrice).toBe(300000);
      expect(kpis.mostExpensiveCar).toEqual({ price: 300000 });
    });

    it('should handle empty data', () => {
      const kpis = calculateKPIs([]);
      expect(kpis.totalVehicles).toBe(0);
      expect(kpis.averagePrice).toBe(0);
      expect(kpis.minPrice).toBe(0);
      expect(kpis.maxPrice).toBe(0);
      expect(kpis.mostExpensiveCar).toBe(null);
    });
  });

  describe('filterCarData', () => {
    const carData = [
      { companyName: 'FERRARI', price: 1100000, fuelType: 'Hybrid' },
      { companyName: 'TOYOTA', price: 26700, fuelType: 'Hybrid' },
      { companyName: 'TESLA', price: 108490, fuelType: 'Electric' }
    ];

    it('should filter by brand', () => {
      const filters = { brands: ['FERRARI'], priceRange: [0, 5000000], fuelTypes: [], bodyTypes: [] };
      const filtered = filterCarData(carData, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].companyName).toBe('FERRARI');
    });

    it('should filter by price range', () => {
      const filters = { brands: [], priceRange: [50000, 200000], fuelTypes: [], bodyTypes: [] };
      const filtered = filterCarData(carData, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].companyName).toBe('TESLA');
    });

    it('should filter by fuel type', () => {
      const filters = { brands: [], priceRange: [0, 5000000], fuelTypes: ['Electric'], bodyTypes: [] };
      const filtered = filterCarData(carData, filters);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].companyName).toBe('TESLA');
    });
  });
});