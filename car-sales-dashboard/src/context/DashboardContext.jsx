import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { loadCarData, filterCarData, calculateKPIs, getUniqueBrands, getUniqueFuelTypes, getUniqueBodyTypes } from '../utils/dataProcessor';

// Initial state
const initialState = {
  // Raw and filtered data
  rawData: [],
  filteredData: [],
  
  // Loading state
  loading: true,
  error: null,
  
  // KPIs
  kpis: {
    totalVehicles: 0,
    averagePrice: 0,
    minPrice: 0,
    maxPrice: 0,
    mostExpensiveCar: null
  },
  
  // Filters
  filters: {
    brands: [],
    priceRange: [0, 5000000], // Default range from $0 to $5M
    fuelTypes: [],
    bodyTypes: []
  },
  
  // Filter options
  brandOptions: [],
  fuelTypeOptions: [],
  bodyTypeOptions: []
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_RAW_DATA: 'SET_RAW_DATA',
  SET_FILTERED_DATA: 'SET_FILTERED_DATA',
  SET_KPIS: 'SET_KPIS',
  SET_FILTERS: 'SET_FILTERS',
  SET_FILTER_OPTIONS: 'SET_FILTER_OPTIONS',
  RESET_FILTERS: 'RESET_FILTERS'
};

// Reducer function
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case ACTIONS.SET_RAW_DATA:
      return {
        ...state,
        rawData: action.payload,
        loading: false,
        error: null
      };
      
    case ACTIONS.SET_FILTERED_DATA:
      return {
        ...state,
        filteredData: action.payload
      };
      
    case ACTIONS.SET_KPIS:
      return {
        ...state,
        kpis: action.payload
      };
      
    case ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
      
    case ACTIONS.SET_FILTER_OPTIONS:
      return {
        ...state,
        brandOptions: action.payload.brands || state.brandOptions,
        fuelTypeOptions: action.payload.fuelTypes || state.fuelTypeOptions,
        bodyTypeOptions: action.payload.bodyTypes || state.bodyTypeOptions
      };
      
    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };
      
    default:
      return state;
  }
};

// Create context
const DashboardContext = createContext();

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Provider component
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        
        // Load data from the CSV file
        const csvFilePath = './Cars Datasets 2025.csv';
        const data = await loadCarData(csvFilePath);
        
        dispatch({ type: ACTIONS.SET_RAW_DATA, payload: data });
        
        // Calculate initial KPIs
        const kpis = calculateKPIs(data);
        dispatch({ type: ACTIONS.SET_KPIS, payload: kpis });
        
        // Set filter options
        const brands = getUniqueBrands(data);
        const fuelTypes = getUniqueFuelTypes(data);
        const bodyTypes = getUniqueBodyTypes(data);
        
        dispatch({ 
          type: ACTIONS.SET_FILTER_OPTIONS, 
          payload: { brands, fuelTypes, bodyTypes } 
        });
        
        // Set initial filtered data
        dispatch({ type: ACTIONS.SET_FILTERED_DATA, payload: data });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    };
    
    loadData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    if (state.rawData.length > 0) {
      const filtered = filterCarData(state.rawData, state.filters);
      dispatch({ type: ACTIONS.SET_FILTERED_DATA, payload: filtered });
      
      // Recalculate KPIs based on filtered data
      const kpis = calculateKPIs(filtered);
      dispatch({ type: ACTIONS.SET_KPIS, payload: kpis });
    }
  }, [state.filters, state.rawData]);
  
  // Actions
  const setFilters = (filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
  };
  
  const resetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };
  
  const value = {
    ...state,
    setFilters,
    resetFilters
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};