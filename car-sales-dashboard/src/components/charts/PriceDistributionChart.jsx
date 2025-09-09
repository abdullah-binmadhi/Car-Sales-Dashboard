import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { getPriceDistributionData } from '../../utils/dataProcessor';

const PriceDistributionChart = () => {
  const { filteredData } = useDashboard();
  
  // Get price distribution data
  const chartData = getPriceDistributionData(filteredData);
  
  // Calculate statistics
  const totalVehicles = filteredData.length;
  const averagePrice = filteredData.reduce((sum, car) => sum + (car.price || 0), 0) / totalVehicles || 0;
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 h-full animate-stagger">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Price Distribution</h3>
          <p className="text-gray-400 text-sm">Distribution of vehicle prices across different ranges</p>
        </div>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
            📊
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="glass rounded-lg p-3 border border-gray-700/30">
          <p className="text-gray-400 text-xs">Total Vehicles</p>
          <p className="text-white font-bold">{totalVehicles.toLocaleString()}</p>
        </div>
        <div className="glass rounded-lg p-3 border border-gray-700/30">
          <p className="text-gray-400 text-xs">Average Price</p>
          <p className="text-white font-bold">${Math.round(averagePrice).toLocaleString()}</p>
        </div>
        <div className="glass rounded-lg p-3 border border-gray-700/30">
          <p className="text-gray-400 text-xs">Price Ranges</p>
          <p className="text-white font-bold">{chartData.length}</p>
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ 
                value: 'Number of Vehicles', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#9CA3AF',
                fontSize: 12
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F9FAFB'
              }}
              formatter={(value) => [value, 'Vehicles']}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Number of Vehicles" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceDistributionChart;