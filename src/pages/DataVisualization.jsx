
import React from 'react';
import LineGraph from '../data_visualizations/LineGraph';
import PieChart from '../data_visualizations/PieChart';
import VerticalBar from '../data_visualizations/VerticalBar';
import DonutGraph from '../data_visualizations/DonutGraph';

export default function DataVisualization() {
    return (
        <div>
            <h1>Data Visualization</h1>
            <LineGraph />
            <div className='card' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <PieChart />
            <DonutGraph />
            </div>
            
            <VerticalBar />
        </div>
    );
}
