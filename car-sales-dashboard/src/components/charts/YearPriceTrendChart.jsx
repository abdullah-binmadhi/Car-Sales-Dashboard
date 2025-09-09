import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';

const YearPriceTrendChart = () => {
  const { filteredData } = useDashboard();
  
  // For this example, we'll simulate year data since it's not in the original dataset
  // In a real application, you would have actual year data
  const chartData = [
    { year: 2020, averagePrice: 45000 },
    { year: 2021, averagePrice: 48000 },
    { year: 2022, averagePrice: 52000 },
    { year: 2023, averagePrice: 58000 },
    { year: 2024, averagePrice: 65000 },
    { year: 2025, averagePrice: 72000 }
  ];
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 h-full animate-stagger">
      <h3 className="text-lg font-bold text-white mb-4">Year vs. Average Price Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ 
                value: 'Year', 
                position: 'insideBottom', 
                offset: -5,
                fill: '#9CA3AF',
                fontSize: 12
              }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              label={{ 
                value: 'Average Price ($)', 
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
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Average Price']}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="averagePrice" 
              name="Average Price" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: '#1F2937' }}
              activeDot={{ r: 6, fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearPriceTrendChart;