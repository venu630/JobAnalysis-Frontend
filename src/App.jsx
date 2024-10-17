import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

// import './css/style.css';

// import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Navbar from './utils/Navbar';
import DataVisualization from './pages/DataVisualization';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
    <Navbar/>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
      <Route exact path="/data_visualization" element={<DataVisualization />} />
      </Routes>
    </>
  );
}

export default App;
