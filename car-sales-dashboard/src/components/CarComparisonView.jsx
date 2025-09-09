import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';

// Function to export data as CSV
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  // Create CSV content
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(field => 
      typeof field === 'string' ? `"${field}"` : field
    ).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const CarComparisonView = () => {
  const { filteredData } = useDashboard();
  const navigate = useNavigate();

  // For demonstration, we'll use a fixed set of cars to compare
  // In a real application, this would come from a comparison state
  const carsToCompare = filteredData.slice(0, 3);

  if (carsToCompare.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 border border-gray-700/50 animate-fadeIn">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">No Cars to Compare</h2>
          <p className="text-gray-400 mb-6">Add cars to compare them side by side.</p>
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

  // Define the specifications to compare
  const specifications = [
    { key: 'engine', label: 'Engine' },
    { key: 'ccBattery', label: 'CC/Battery' },
    { key: 'horsePower', label: 'Horsepower' },
    { key: 'torque', label: 'Torque' },
    { key: 'totalSpeed', label: 'Top Speed' },
    { key: 'performance', label: '0-100 km/h' },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'seats', label: 'Seats' },
    { key: 'price', label: 'Price' }
  ];

  // Handle export comparison data
  const handleExportComparison = () => {
    // Create comparison data structure for export
    const comparisonData = specifications.map(spec => {
      const row = { specification: spec.label };
      carsToCompare.forEach((car, index) => {
        row[`car_${index + 1}`] = spec.key === 'price' 
          ? `$${car[spec.key]?.toLocaleString()}` 
          : car[spec.key];
      });
      return row;
    });
    
    exportToCSV(comparisonData, 'car_comparison.csv');
  };

  return (
    <div className="glass rounded-2xl p-6 border border-gray-700/50 animate-fadeIn">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-white">
          Car Comparison
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Specification</th>
              {carsToCompare.map((car, index) => (
                <th key={index} className="px-4 py-3 text-center text-white font-medium min-w-[200px]">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                    <span className="font-bold">{car.companyName}</span>
                    <span className="text-sm">{car.modelName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {specifications.map((spec, specIndex) => (
              <tr key={specIndex} className={specIndex % 2 === 0 ? 'bg-gray-800/20' : ''}>
                <td className="px-4 py-3 text-gray-400 font-medium">{spec.label}</td>
                {carsToCompare.map((car, carIndex) => (
                  <td key={carIndex} className="px-4 py-3 text-center text-white">
                    {spec.key === 'price' 
                      ? `$${car[spec.key]?.toLocaleString()}` 
                      : car[spec.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-8">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
          Add More Cars
        </button>
        <button 
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200"
          onClick={handleExportComparison}
        >
          Export Comparison
        </button>
      </div>
    </div>
  );
};

export default CarComparisonView;