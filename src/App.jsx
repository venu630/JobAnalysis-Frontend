import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

// Import pages
import Dashboard from './pages/Dashboard';
import Navbar from './utils/Navbar';
import DataVisualization from './pages/DataVisualization';
import KNNModel from './algorithms/KNNModel';
import TimeSeriesModel from './algorithms/TimeSeriesModel'; // Import TimeSeriesModel

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/data_visualization" element={<DataVisualization />} />
        <Route exact path="/algorithms/knn_classification" element={<KNNModel />} />
        <Route exact path="/algorithms/time_series_analysis" element={<TimeSeriesModel />} />
      </Routes>
    </>
  );
}

export default App;
