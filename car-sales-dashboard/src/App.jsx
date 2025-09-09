import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import DashboardLayout from './components/DashboardLayout';

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
      <DashboardLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/car/:carId" element={<CarDetailView />} />
            <Route path="/compare" element={<CarComparisonView />} />
          </Routes>
        </Suspense>
      </DashboardLayout>
    </DashboardProvider>
  );
}

export default App;