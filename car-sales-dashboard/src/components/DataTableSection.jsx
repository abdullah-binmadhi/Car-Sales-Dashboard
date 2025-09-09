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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Vehicle Data</h2>
            <p className="text-gray-400 text-sm">Detailed information about vehicles in the dataset</p>
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center"
              onClick={handleExportCSV}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PNG
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="text-gray-400 text-sm">
            Showing <span className="font-medium text-white">{paginatedData.length}</span> of{' '}
            <span className="font-medium text-white">{sortedData.length}</span> vehicles
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Items per page:</span>
            <select 
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => {
                // This would require additional state management in a real implementation
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
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
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                      onClick={() => handleViewCarAction(car)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button 
                      className="text-green-400 hover:text-green-300 flex items-center"
                      onClick={() => navigate('/compare')}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Compare
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
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
          Page <span className="font-medium text-white">{currentPage}</span> of{' '}
          <span className="font-medium text-white">{totalPages}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              currentPage === 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
            className={`px-3 py-1 rounded text-sm flex items-center ${
              currentPage === totalPages 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTableSection;