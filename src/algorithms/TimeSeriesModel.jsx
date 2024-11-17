import React, { useState, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Chart } from 'primereact/chart';

// Experience Levels Dropdown Options
const experienceLevels = [
    { label: "Entry-level / Junior", value: "EN" },
    { label: "Mid-level / Intermediate", value: "MI" },
    { label: "Senior-level / Expert", value: "SE" },
    { label: "Executive-level / Director", value: "EX" },
];

// Generate Year Range from 2015 to 2025
const yearOptions = Array.from({ length: 2025 - 2015 + 1 }, (_, index) => {
    const year = 2015 + index;
    return { label: year.toString(), value: year };
});

// Colors for each experience level
const lineColors = {
    "EN": "#42A5F5", // Blue
    "MI": "#66BB6A", // Green
    "SE": "#FFA726", // Orange
    "EX": "#AB47BC", // Purple
};

const TimeSeriesModel = () => {
    const [formData, setFormData] = useState({
        start_year: null,
        end_year: null,
        experience_level: "",
    });
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({});
    const toast = useRef(null);

    const handleDropdownChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const { start_year, end_year, experience_level } = formData;

        try {
            if (!start_year || !end_year || !experience_level) {
                throw new Error("Please fill out all fields before submitting.");
            }

            if (start_year > end_year) {
                throw new Error("Start year cannot be greater than end year.");
            }

            let predictions = [];
            for (let year = start_year; year <= end_year; year++) {
                const response = await fetch("http://127.0.0.1:5000/timeseries_predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ work_year: year, experience_level }),
                });

                if (!response.ok) {
                    throw new Error(`Error fetching data for year ${year}`);
                }

                const data = await response.json();
                predictions.push({ year, salary: data.predicted_salary });
            }

            updateChart(predictions, experience_level);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message,
            });
        }
        setLoading(false);
    };

    const updateChart = (predictions, experience_level) => {
        const years = predictions.map((item) => item.year);
        const salaries = predictions.map((item) => item.salary);

        const chartData = {
            labels: years,
            datasets: [
                {
                    label: `Predicted Salaries for ${experience_level}`,
                    data: salaries,
                    fill: false,
                    borderColor: lineColors[experience_level], // Set a different color for each experience level
                    tension: 0.4,
                },
            ],
        };

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8, // Increased aspect ratio to make the chart larger
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
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData({ data: chartData, options: chartOptions });
    };

    return (
        <div className="p-d-flex p-jc-center p-ai-center p-mt-5">
            <Toast ref={toast} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card
                    title="Time Series Model Salary Prediction"
                    className="p-shadow-4"
                    style={{ width: "70%", maxWidth: "1500px" }}
                >
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6" style={{ padding: "1em" }}>
                            <Panel header="Enter Prediction Details" className="p-p-3" style={{ height: "100%" }}>
                                <div className="p-fluid">
                                    <div className="p-field" style={{ marginBottom: "30px" }}>
                                        <span className="p-float-label">
                                            <Dropdown
                                                value={formData.start_year}
                                                options={yearOptions}
                                                onChange={(e) => handleDropdownChange("start_year", e.value)}
                                            />
                                            <label htmlFor="start_year">Start Year</label>
                                        </span>
                                    </div>
                                    <div className="p-field" style={{ marginBottom: "30px" }}>
                                        <span className="p-float-label">
                                            <Dropdown
                                                value={formData.end_year}
                                                options={yearOptions}
                                                onChange={(e) => handleDropdownChange("end_year", e.value)}
                                            />
                                            <label htmlFor="end_year">End Year</label>
                                        </span>
                                    </div>
                                    <div className="p-field" style={{ marginBottom: "30px" }}>
                                        <span className="p-float-label">
                                            <Dropdown
                                                value={formData.experience_level}
                                                options={experienceLevels}
                                                onChange={(e) => handleDropdownChange("experience_level", e.value)}
                                            />
                                            <label htmlFor="experience_level">Experience Level</label>
                                        </span>
                                    </div>
                                </div>
                                <div className="p-d-flex p-jc-end p-mt-4">
                                    <Button
                                        label="Submit"
                                        icon="pi pi-check"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="p-button-primary"
                                    />
                                    {loading && <ProgressSpinner style={{ marginLeft: "1em" }} />}
                                </div>
                            </Panel>
                        </div>

                        <div className="p-col-12 p-md-6" style={{ padding: "1em" }}>
                            <Panel header="Prediction Result" className="p-p-3" style={{ height: "100%" }}>
                                {chartData.data ? (
                                    <div className="p-d-flex p-flex-column p-ai-center">
                                        <Chart type="line" data={chartData.data} options={chartData.options} style={{ width: '100%', height: '500px' }} />
                                    </div>
                                ) : (
                                    <p className="p-text-center">Submit the form to view prediction results.</p>
                                )}
                            </Panel>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TimeSeriesModel;