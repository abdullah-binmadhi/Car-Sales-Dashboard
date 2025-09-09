import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';

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

const DataTableSection = ({ onViewCar }) => {
  const { filteredData } = useDashboard();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  
  // Sort data based on sort config
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);
  
  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle view car action
  const handleViewCarAction = (car) => {
    if (onViewCar) {
      onViewCar(car);
    } else {
      // Fallback to navigation if no callback provided
      navigate(`/car/${car.companyName}-${car.modelName}`);
    }
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    exportToCSV(sortedData, 'car_data.csv');
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  return (
    <div className="glass rounded-2xl border border-gray-700/50 overflow-hidden animate-stagger">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Vehicle Data</h2>
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="text-gray-400">
            Showing {paginatedData.length} of {sortedData.length} vehicles
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
              onClick={handleExportCSV}
            >
              Export CSV
            </button>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
              Export PNG
            </button>
          </div>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('companyName')}
              >
                <div className="flex items-center">
                  Brand
                  {sortConfig.key === 'companyName' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('modelName')}
              >
                <div className="flex items-center">
                  Model
                  {sortConfig.key === 'modelName' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('engine')}
              >
                <div className="flex items-center">
                  Engine
                  {sortConfig.key === 'engine' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('horsePower')}
              >
                <div className="flex items-center">
                  Horsepower
                  {sortConfig.key === 'horsePower' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {sortConfig.key === 'price' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {paginatedData.map((car, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-700/30 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {car.companyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {car.modelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {car.engine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {car.horsePower}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                  ${car.price?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleViewCarAction(car)}
                    >
                      View
                    </button>
                    <button 
                      className="text-green-400 hover:text-green-300"
                      onClick={() => navigate('/compare')}
                    >
                      Compare
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-300">
                      Favorite
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-400 mb-4 md:mb-0">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            if (pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === totalPages 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTableSection;