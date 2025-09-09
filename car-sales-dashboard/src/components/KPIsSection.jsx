import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

// Counter animation component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16); // 60fps approximation
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{displayValue.toLocaleString()}</span>;
};

// Metric card component
const MetricCard = ({ title, value, prefix = '', suffix = '', description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-400'
  };
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 animate-stagger">
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className={`text-3xl font-bold mb-2 ${colorClasses[color].split(' ')[2]}`}>
        {prefix}
        <AnimatedCounter value={value} />
        {suffix}
      </div>
      {description && <p className="text-gray-500 text-sm">{description}</p>}
    </div>
  );
};

// Price range card component
const PriceRangeCard = ({ minPrice, maxPrice }) => {
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 animate-stagger">
      <h3 className="text-gray-400 text-sm font-medium mb-4">Price Range</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Minimum</span>
            <span className="text-green-400 font-medium">${minPrice?.toLocaleString() || '0'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
              style={{ width: '30%' }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Maximum</span>
            <span className="text-red-400 font-medium">${maxPrice?.toLocaleString() || '0'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Highlight card component
const HighlightCard = ({ car }) => {
  if (!car) return null;
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 animate-stagger">
      <h3 className="text-gray-400 text-sm font-medium mb-4">Most Expensive Vehicle</h3>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
        <div className="flex-1">
          <h4 className="font-bold text-lg text-white">{car.companyName} {car.modelName}</h4>
          <p className="text-gray-400 text-sm">{car.engine} • {car.fuelType}</p>
          <p className="text-2xl font-bold text-yellow-400 mt-2">${car.price?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const KPIsSection = () => {
  const { kpis } = useDashboard();
  
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard 
        title="Total Vehicles" 
        value={kpis.totalVehicles || 0} 
        description="in the dataset"
        color="blue"
      />
      
      <MetricCard 
        title="Average Price" 
        value={kpis.averagePrice || 0} 
        prefix="$"
        description="across all vehicles"
        color="green"
      />
      
      <PriceRangeCard 
        minPrice={kpis.minPrice} 
        maxPrice={kpis.maxPrice} 
      />
      
      <HighlightCard 
        car={kpis.mostExpensiveCar} 
      />
    </section>
  );
};

export default KPIsSection;