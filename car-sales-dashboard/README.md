# 2025 Automotive Intelligence Dashboard

A modern, interactive dashboard for analyzing automotive market trends and vehicle data for 2025. Built with React, Vite, and Recharts, this dashboard provides comprehensive insights into car sales, pricing, performance metrics, and market share.

## 🚗 Features

- **Interactive Data Visualization**: Multiple charts showing brand performance, price distribution, market share, and feature analysis
- **Real-time Filtering**: Filter vehicles by brand, price range, fuel type, and body type
- **Key Performance Indicators**: Track total vehicles, average prices, and most expensive cars
- **Detailed Car Information**: View comprehensive details for individual vehicles
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Performance Optimized**: Uses memoization and lazy loading for smooth experience

## 📊 Dashboard Sections

1. **KPI Overview**: Key metrics at a glance
2. **Brand Performance**: Scatter plot showing relationship between price, quantity, and horsepower
3. **Price Distribution**: Histogram of vehicle prices across different ranges
4. **Market Share**: Pie chart visualization of brand market dominance
5. **Feature Analysis**: Radar chart comparing vehicle features
6. **Year vs. Price Trends**: Line chart showing pricing trends over time
7. **Data Table**: Sortable and searchable table of all vehicles

## 🛠️ Technologies Used

- **React 19** with Hooks and Context API
- **Vite** for fast development and build tooling
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **React Router** for navigation
- **PapaParse** for CSV data parsing
- **Lodash** for data processing utilities

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/car-sales-dashboard.git
   ```

2. Navigate to the project directory:
   ```bash
   cd car-sales-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

### Running Tests

To run the test suite:

```bash
npm run test
# or
yarn test
```

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/          # All chart components
│   ├── lazy/            # Lazy loaded components
│   ├── CarComparisonView.jsx
│   ├── CarDetailView.jsx
│   ├── ChartsSection.jsx
│   ├── DataTableSection.jsx
│   ├── FilterControls.jsx
│   ├── Header.jsx
│   └── KPIsSection.jsx
├── context/
│   └── DashboardContext.jsx  # State management
├── utils/
│   └── dataProcessor.js      # Data processing functions
├── __tests__/               # Test files
├── App.jsx
├── main.jsx
└── index.css
```

## 🌐 Data Source

The dashboard uses a comprehensive 2025 automotive dataset containing information about:
- Company names and car models
- Engine specifications and performance metrics
- Pricing information
- Fuel types and seating capacity

## 🌍 GitHub Pages Deployment

This project is configured for deployment to GitHub Pages. To deploy:

1. Update the `vite.config.js` file with your GitHub username and repository name:
   ```js
   base: '/your-repo-name/',
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to GitHub Pages using the deploy script:
   ```bash
   npm run deploy
   ```

### GitHub Actions Deployment (Recommended)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when changes are pushed to the main branch.

To enable GitHub Pages deployment:

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "GitHub Actions"
4. Push changes to the main branch to trigger the deployment workflow

The live demo can be viewed at: [https://abdullah-binmadhi.github.io/car-sales-dashboard/](https://abdullah-binmadhi.github.io/car-sales-dashboard/)

## 🧪 Testing

The project includes unit tests for:
- Dashboard context and data processing
- Utility functions
- Component rendering

Run tests with:
```bash
npm run test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Abdullah Binmadhi**
- GitHub: [@abdullah-binmadhi](https://github.com/abdullah-binmadhi)

## 🙏 Acknowledgements

- Data visualization powered by [Recharts](https://recharts.org/)
- UI components built with [Tailwind CSS](https://tailwindcss.com/)
- Project bootstrapped with [Vite](https://vitejs.dev/)