import React from 'react';
import PriceDistributionChart from './charts/PriceDistributionChart';
import BrandPerformanceChart from './charts/BrandPerformanceChart';
import MarketShareChart from './charts/MarketShareChart';
import YearPriceTrendChart from './charts/YearPriceTrendChart';
import FeatureAnalysisChart from './charts/FeatureAnalysisChart';

const ChartsSection = () => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Data Visualizations</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
          Interactive Charts
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-6">
          <PriceDistributionChart />
          <MarketShareChart />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <BrandPerformanceChart />
          <YearPriceTrendChart />
          <FeatureAnalysisChart />
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;