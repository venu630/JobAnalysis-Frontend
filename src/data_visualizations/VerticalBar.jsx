import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import data from '../data/salaries.json';
import { Button } from 'primereact/button';

export default function VerticalBar() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [filterType, setFilterType] = useState('experience_level');

    const filterOptions = [
        { label: 'Experience Level', value: 'experience_level' },
        { label: 'Company Size', value: 'company_size' },
        { label: 'Employment Type', value: 'employment_type' }
    ];

    useEffect(() => {
        if (data.length > 0) {
            // Process data to get salary trends over time for different filters
            const filterValues = [...new Set(data.map(item => item[filterType]))];
            const years = [...new Set(data.map(item => item.work_year))].sort();

            const datasets = filterValues.map((filterValue) => {
                return {
                    label: filterValue,
                    data: years.map((year) => {
                        // Filter data by filter type and year
                        const filteredData = data.filter(item => item[filterType] === filterValue && item.work_year === year);
                        // Calculate average salary for that filter value in that year
                        const avgSalary = filteredData.reduce((acc, curr) => acc + curr.salary_in_usd, 0) / (filteredData.length || 1);
                        return avgSalary;
                    }),
                    backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    borderWidth: 1
                };
            });

            const chartData = {
                labels: years,
                datasets: datasets
            };

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            const chartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };

            setChartData(chartData);
            setChartOptions(chartOptions);
        }
    }, [filterType]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = document.getElementsByTagName('canvas')[3].toDataURL('image/png');
        link.download = 'salary_distribution_chart.png';
        link.click();
    };

    return (
        <div className="card">
            <div className="p-field">
                <label htmlFor="filterType">Select Filter:</label>
                <Dropdown id="filterType" value={filterType} options={filterOptions} onChange={(e) => setFilterType(e.value)} placeholder="Select a filter" />
            </div>
            <Chart type="bar" data={chartData} options={chartOptions} />
            <Button label="Download Chart" icon="pi pi-download" onClick={handleDownload} className="p-mt-3" />
        </div>
    );
}
