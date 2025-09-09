import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

const Header = () => {
  const { kpis } = useDashboard();
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  
  // Metrics to display in the ticker
  const metrics = [
    { label: 'Total Vehicles', value: kpis.totalVehicles?.toLocaleString() || '0' },
    { label: 'Avg. Price', value: kpis.averagePrice ? `$${kpis.averagePrice.toLocaleString()}` : '$0' },
    { label: 'Most Expensive', value: kpis.mostExpensiveCar ? `$${kpis.mostExpensiveCar.price?.toLocaleString()}` : '$0' }
  ];
  
  // Rotate metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetricIndex((prevIndex) => (prevIndex + 1) % metrics.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [metrics.length]);
  
  return (
    <header className="glass rounded-2xl shadow-2xl mb-6 relative overflow-hidden animate-fadeIn">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-soft-light opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-soft-light opacity-20 animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              2025 Automotive Intelligence Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Comprehensive insights into the latest automotive market trends
              <span className="block text-sm mt-1">
                <a 
                  href="https://github.com/abdullah-binmadhi/car-sales-dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  View on GitHub
                </a>
              </span>
            </p>
          </div>
          
          {/* Metrics ticker */}
          <div className="glass rounded-xl p-4 border border-gray-700 min-w-[250px]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">{metrics[currentMetricIndex].label}</div>
              <div className="text-lg font-bold text-blue-400 animate-fadeIn">
                {metrics[currentMetricIndex].value}
              </div>
            </div>
            <div className="flex mt-2 space-x-1">
              {metrics.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 flex-1 rounded-full ${index === currentMetricIndex ? 'bg-blue-500' : 'bg-gray-600'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;