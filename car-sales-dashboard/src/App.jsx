import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';

// Lazy load components
const Header = lazy(() => import('./components/Header'));
const KPIsSection = lazy(() => import('./components/KPIsSection'));
const FilterControls = lazy(() => import('./components/FilterControls'));
const ChartsSection = lazy(() => import('./components/ChartsSection'));
const DataTableSection = lazy(() => import('./components/DataTableSection'));
const CarDetailView = lazy(() => import('./components/CarDetailView'));
const CarComparisonView = lazy(() => import('./components/CarComparisonView'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main dashboard component
const Dashboard = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();

  const handleViewCar = (car) => {
    setSelectedCar(car);
    navigate(`/car/${car.companyName}-${car.modelName}`);
  };

  return (
    <>
      <Header />
      <KPIsSection />
      <FilterControls />
      <ChartsSection />
      <DataTableSection onViewCar={handleViewCar} />
    </>
  );
};

function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/car/:carId" element={<CarDetailView />} />
              <Route path="/compare" element={<CarComparisonView />} />
            </Routes>
          </Suspense>
        </div>
        <footer className="max-w-7xl mx-auto mt-8 py-4 text-center text-gray-400 text-sm">
          <p>
            2025 Automotive Intelligence Dashboard •{' '}
            <a 
              href="https://github.com/abdullah-binmadhi/car-sales-dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </DashboardProvider>
  );
}

export default App;