import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { getBrandPerformanceData } from '../../utils/dataProcessor';

const BrandPerformanceChart = () => {
  const { filteredData } = useDashboard();
  
  // Get brand performance data
  const chartData = getBrandPerformanceData(filteredData);
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 h-full animate-stagger">
      <h3 className="text-lg font-bold text-white mb-4">Brand Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              dataKey="averagePrice" 
              name="Average Price"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ 
                value: 'Average Price ($)', 
                position: 'insideBottom', 
                offset: -10,
                fill: '#9CA3AF',
                fontSize: 12
              }}
            />
            <YAxis 
              type="number" 
              dataKey="carCount" 
              name="Number of Cars"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ 
                value: 'Number of Cars', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#9CA3AF',
                fontSize: 12
              }}
            />
            <ZAxis 
              type="number" 
              dataKey="averageHorsePower" 
              range={[100, 1000]} 
              name="Avg Horsepower"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F9FAFB'
              }}
              formatter={(value, name) => {
                if (name === 'averagePrice') return [`$${Number(value).toLocaleString()}`, 'Average Price'];
                if (name === 'carCount') return [value, 'Number of Cars'];
                if (name === 'averageHorsePower') return [value, 'Avg Horsepower'];
                return [value, name];
              }}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            />
            <Legend />
            <Scatter 
              name="Brands" 
              data={chartData} 
              fill="#10B981" 
              stroke="#047857"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BrandPerformanceChart;