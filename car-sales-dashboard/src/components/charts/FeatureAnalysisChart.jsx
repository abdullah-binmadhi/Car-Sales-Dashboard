import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { getBrandPerformanceData } from '../../utils/dataProcessor';
import _ from 'lodash';

const FeatureAnalysisChart = () => {
  const { filteredData } = useDashboard();
  
  // Get brand performance data
  const brandPerformanceData = getBrandPerformanceData(filteredData);
  
  // Calculate average values for all brands
  const avgPerformance = _.meanBy(brandPerformanceData, 'averagePerformance') || 0;
  const avgPrice = _.meanBy(brandPerformanceData, 'averagePrice') || 0;
  const avgHorsePower = _.meanBy(brandPerformanceData, 'averageHorsePower') || 0;
  
  // Normalize values for radar chart (0-100 scale)
  const maxPerformance = 10; // Assuming max performance is 10 seconds
  const maxPrice = 5000000; // Assuming max price is $5M
  const maxHorsePower = 1500; // Assuming max horsepower is 1500
  
  const chartData = [
    { 
      feature: 'Performance', 
      value: Math.max(0, Math.min(100, (maxPerformance - avgPerformance) / maxPerformance * 100)), 
      max: 100 
    },
    { 
      feature: 'Price', 
      value: Math.max(0, Math.min(100, avgPrice / maxPrice * 100)), 
      max: 100 
    },
    { 
      feature: 'Horsepower', 
      value: Math.max(0, Math.min(100, avgHorsePower / maxHorsePower * 100)), 
      max: 100 
    },
    { 
      feature: 'Efficiency', 
      value: Math.max(0, Math.min(100, (100 - (avgPrice / maxPrice * 50)))), 
      max: 100 
    },
    { 
      feature: 'Variety', 
      value: Math.max(0, Math.min(100, brandPerformanceData.length / 20 * 100)), 
      max: 100 
    },
    { 
      feature: 'Technology', 
      value: Math.max(0, Math.min(100, (avgHorsePower / maxHorsePower * 100))), 
      max: 100 
    }
  ];
  
  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 h-full animate-stagger">
      <h3 className="text-lg font-bold text-white mb-4">Feature Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
              dataKey="feature" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <Radar
              name="Features"
              dataKey="value"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeatureAnalysisChart;