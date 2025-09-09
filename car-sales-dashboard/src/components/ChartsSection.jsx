import React from 'react';
import PriceDistributionChart from './charts/PriceDistributionChart';
import BrandPerformanceChart from './charts/BrandPerformanceChart';
import MarketShareChart from './charts/MarketShareChart';
import YearPriceTrendChart from './charts/YearPriceTrendChart';
import FeatureAnalysisChart from './charts/FeatureAnalysisChart';

const ChartsSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="grid grid-cols-1 gap-6">
        <PriceDistributionChart />
        <MarketShareChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <BrandPerformanceChart />
        <YearPriceTrendChart />
        <FeatureAnalysisChart />
      </div>
    </section>
  );
};

export default ChartsSection;