import { React } from "react";
import { Menubar } from "primereact/menubar";
export default function Navbar() {
  const items = [
    {
      label: "Raw Data",
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
      url: "/algorithms",
    },
  ];
  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
}
