import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { getPriceDistributionData } from '../../utils/dataProcessor';

const PriceDistributionChart = () => {
  const { filteredData } = useDashboard();
  
  // Get price distribution data
  const chartData = getPriceDistributionData(filteredData);
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 h-full animate-stagger">
      <h3 className="text-lg font-bold text-white mb-4">Price Distribution</h3>
      <div className="h-80">
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