import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';

const CarDetailView = () => {
  const { filteredData } = useDashboard();
  const { carId } = useParams();
  const navigate = useNavigate();

  // Find the car by matching the carId with companyName-modelName
  const car = filteredData.find(car => 
    `${car.companyName}-${car.modelName}` === carId
  );

  if (!car) {
    return (
      <div className="glass rounded-2xl p-6 border border-gray-700/50 animate-fadeIn">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Car Not Found</h2>
          <p className="text-gray-400 mb-6">The requested car could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 animate-fadeIn">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-white">
          {car.companyName} {car.modelName}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Car Image Placeholder */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-700 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center mb-4">
            <span className="text-gray-400">Car Image</span>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-bold text-white mb-2">Price</h3>
            <p className="text-3xl font-bold text-yellow-400">${car.price?.toLocaleString()}</p>
          </div>
        </div>

        {/* Car Details */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Engine</p>
              <p className="text-white font-medium">{car.engine}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">CC/Battery</p>
              <p className="text-white font-medium">{car.ccBattery}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Horsepower</p>
              <p className="text-white font-medium">{car.horsePower}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Torque</p>
              <p className="text-white font-medium">{car.torque}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Top Speed</p>
              <p className="text-white font-medium">{car.totalSpeed}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Performance (0-100 km/h)</p>
              <p className="text-white font-medium">{car.performance}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Fuel Type</p>
              <p className="text-white font-medium">{car.fuelType}</p>
            </div>
            <div className="glass rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-400 text-sm">Seats</p>
              <p className="text-white font-medium">{car.seats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-8">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
          Add to Compare
        </button>
        <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200">
          Add to Favorites
        </button>
      </div>
    </div>
  );
};

export default CarDetailView;