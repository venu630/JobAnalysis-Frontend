import { React } from "react";
import { Menubar } from "primereact/menubar";
export default function Navbar() {
  const items = [
    {
      label: "Historical Data",
      icon: "pi pi-home",
      url: "/",
    },
    {
      label: "Data Visualizations",
      icon: "pi pi-chart-bar",
      url: "/data_visualization",
    },
    {
      label: "Algorithms",
      icon: "pi pi-lightbulb",
      items: [
        {
          label: "KNN Classification",
          url: "/algorithms/knn_classification",
        },
        {
          label: "K-Means Clustering",
          url: "/algorithms/kmeans_clustering",
        },
        {
          label: "Time Series Analysis",
          url: "/algorithms/time_series_analysis",
        },
        {
          label: "Outlier Detection",
          url: "/algorithms/outlier_detection",
        },
      ],
    },
  ];
  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
}
