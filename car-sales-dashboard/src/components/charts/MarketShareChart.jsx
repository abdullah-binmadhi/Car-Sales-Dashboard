import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { getMarketShareData } from '../../utils/dataProcessor';

const MarketShareChart = () => {
  const { filteredData } = useDashboard();
  
  // Get market share data
  const chartData = getMarketShareData(filteredData);
  
  // Colors for the pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 h-full animate-stagger">
      <h3 className="text-lg font-bold text-white mb-4">Market Share by Brand</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F9FAFB'
              }}
              formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, 'Vehicles']}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              contentStyle={{ color: '#F9FAFB' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketShareChart;