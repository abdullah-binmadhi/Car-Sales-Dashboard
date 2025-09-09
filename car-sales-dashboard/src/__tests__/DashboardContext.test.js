const React = require('react');
const { render, screen, act } = require('@testing-library/react');
const { DashboardProvider, useDashboard } = require('../context/DashboardContext');

// Mock the data processor functions
jest.mock('../utils/dataProcessor', () => ({
  loadCarData: jest.fn(),
  filterCarData: jest.fn(),
  calculateKPIs: jest.fn(),
  getUniqueBrands: jest.fn(),
  getUniqueFuelTypes: jest.fn(),
  getUniqueBodyTypes: jest.fn()
}));

// Import the mocked functions
const { 
  loadCarData, 
  filterCarData, 
  calculateKPIs, 
  getUniqueBrands, 
  getUniqueFuelTypes, 
  getUniqueBodyTypes 
} = require('../utils/dataProcessor');

// Test component to use the context
const TestComponent = () => {
  const { loading, error, kpis, filters, brandOptions, fuelTypeOptions, bodyTypeOptions } = useDashboard();
  
  return React.createElement('div', null,
    React.createElement('div', { 'data-testid': 'loading' }, loading.toString()),
    React.createElement('div', { 'data-testid': 'error' }, error || 'No error'),
    React.createElement('div', { 'data-testid': 'kpis-total' }, kpis.totalVehicles),
    React.createElement('div', { 'data-testid': 'filters-brands' }, filters.brands.join(',')),
    React.createElement('div', { 'data-testid': 'brand-options' }, brandOptions.join(',')),
    React.createElement('div', { 'data-testid': 'fuel-options' }, fuelTypeOptions.join(',')),
    React.createElement('div', { 'data-testid': 'body-options' }, bodyTypeOptions.join(','))
  );
};

describe('DashboardContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should provide initial state', () => {
    const mockData = [
      { companyName: 'FERRARI', price: 1100000 },
      { companyName: 'TOYOTA', price: 26700 }
    ];
    
    // Mock the data processor functions
    loadCarData.mockResolvedValue(mockData);
    calculateKPIs.mockReturnValue({
      totalVehicles: 2,
      averagePrice: 563350,
      minPrice: 26700,
      maxPrice: 1100000,
      mostExpensiveCar: { companyName: 'FERRARI', price: 1100000 }
    });
    getUniqueBrands.mockReturnValue(['FERRARI', 'TOYOTA']);
    getUniqueFuelTypes.mockReturnValue(['Hybrid', 'Petrol']);
    getUniqueBodyTypes.mockReturnValue(['Coupe', 'Hatchback']);
    filterCarData.mockReturnValue(mockData);
    
    render(
      React.createElement(DashboardProvider, null,
        React.createElement(TestComponent, null)
      )
    );
    
    // Check initial loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should load data and update state', async () => {
    const mockData = [
      { companyName: 'FERRARI', price: 1100000 },
      { companyName: 'TOYOTA', price: 26700 }
    ];
    
    // Mock the data processor functions
    loadCarData.mockResolvedValue(mockData);
    calculateKPIs.mockReturnValue({
      totalVehicles: 2,
      averagePrice: 563350,
      minPrice: 26700,
      maxPrice: 1100000,
      mostExpensiveCar: { companyName: 'FERRARI', price: 1100000 }
    });
    getUniqueBrands.mockReturnValue(['FERRARI', 'TOYOTA']);
    getUniqueFuelTypes.mockReturnValue(['Hybrid', 'Petrol']);
    getUniqueBodyTypes.mockReturnValue(['Coupe', 'Hatchback']);
    filterCarData.mockReturnValue(mockData);
    
    await act(async () => {
      render(
        React.createElement(DashboardProvider, null,
          React.createElement(TestComponent, null)
        )
      );
    });
    
    // Check that data was loaded
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('kpis-total')).toHaveTextContent('2');
    expect(screen.getByTestId('brand-options')).toHaveTextContent('FERRARI,TOYOTA');
    expect(screen.getByTestId('fuel-options')).toHaveTextContent('Hybrid,Petrol');
    expect(screen.getByTestId('body-options')).toHaveTextContent('Coupe,Hatchback');
  });
});