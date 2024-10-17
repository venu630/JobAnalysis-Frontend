import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import data from '../data/salaries.json';

export default function DonutGraph() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [filterType, setFilterType] = useState('work_year');

    const filterOptions = [
        { label: 'Work Year', value: 'work_year' },
        { label: 'Salary Currency', value: 'salary_currency' },
        { label: 'Employment Type', value: 'employment_type' }
    ];

    useEffect(() => {
        if (data.length > 0) {
            // Process data to get salary distribution for different filters
            const filterValues = [...new Set(data.map(item => item[filterType]))];
            const counts = filterValues.map(filterValue => {
                return data.filter(item => item[filterType] === filterValue).length;
            });

            const documentStyle = getComputedStyle(document.documentElement);
            const chartData = {
                labels: filterValues,
                datasets: [
                    {
                        data: counts,
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--pink-500'),
                            documentStyle.getPropertyValue('--purple-500')
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--yellow-400'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--pink-400'),
                            documentStyle.getPropertyValue('--purple-400')
                        ]
                    }
                ]
            };

            const chartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            };

            setChartData(chartData);
            setChartOptions(chartOptions);
        }
    }, [data, filterType]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = document.getElementsByTagName('canvas')[1].toDataURL('image/png');
        link.download = 'salary_distribution_chart.png';
        link.click();
    };

    return (
        <div className="card" style={{ position: 'relative' }}>
            <div className="p-field">
                <label htmlFor="filterType">Select Filter:</label>
                <Dropdown id="filterType" value={filterType} options={filterOptions} onChange={(e) => setFilterType(e.value)} placeholder="Select a filter" />
            </div>
            <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
            <Button label="Download Chart" icon="pi pi-download" onClick={handleDownload} className="p-mt-3" />
        </div>
    );
}
