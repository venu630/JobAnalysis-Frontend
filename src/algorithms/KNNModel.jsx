import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { jobTitles, residencies } from './dropdown_options/DropDownOptions'; // Import job titles and residencies

const employmentTypes = [
  { label: "Full-time", value: "FT" },
  { label: "Part-time", value: "PT" },
  { label: "Contract", value: "CT" },
];

const remoteRatios = [
  { label: "0% (On-site)", value: 0 },
  { label: "50% (Hybrid)", value: 50 },
  { label: "100% (Remote)", value: 100 },
];

const companySizes = [
  { label: "Small", value: "S" },
  { label: "Medium", value: "M" },
  { label: "Large", value: "L" },
];

// Mapping experience levels to full names
const experienceLevelMapping = {
  'EN': 'Entry-level / Junior',
  'MI': 'Mid-level / Intermediate',
  'SE': 'Senior-level / Expert',
  'EX': 'Executive-level / Director'
};

const KNNModel = () => {
  const [formData, setFormData] = useState({
    job_title: "",
    employment_type: "",
    salary_in_usd: "",
    employee_residence: "",
    remote_ratio: "",
    company_size: "",
  });
  const [loading, setLoading] = useState(false);
  const [predictedExperience, setPredictedExperience] = useState(null);
  const [imageData, setImageData] = useState(null);
  const toast = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/knn_predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data = await response.json();
      setPredictedExperience(experienceLevelMapping[data.predicted_experience_level] || data.predicted_experience_level);
      setImageData(data.pca_plot);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center p-mt-5">
      <Toast ref={toast} />
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Card
        title="KNN Model Experience Prediction"
        className="p-shadow-4"
        style={{ width: "50%", maxWidth: "1200px" }}
      >
        <div className="p-grid">
          <div className="p-col-12 p-md-6" style={{ padding: "1em" }}>
            <Panel header="Enter Job Details" className="p-p-3" style={{ height: "100%" }}>
              <div className="p-fluid">
                <div className="p-field" style={{ marginTop: '10px', marginBottom: "30px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      value={formData.job_title}
                      options={jobTitles.map((title) => ({ label: title, value: title }))}
                      onChange={(e) => handleDropdownChange("job_title", e.value)}
                      filter
                      filterPlaceholder="Search job titles"
                    />
                    <label htmlFor="job_title">Job Title</label>
                  </span>
                </div>
                <div className="p-field" style={{ marginBottom: "30px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      value={formData.employment_type}
                      options={employmentTypes}
                      onChange={(e) => handleDropdownChange("employment_type", e.value)}
                    />
                    <label htmlFor="employment_type">Employment Type</label>
                  </span>
                </div>
                <div className="p-field" style={{ marginBottom: "30px" }}>
                  <span className="p-float-label">
                    <InputText
                      id="salary_in_usd"
                      name="salary_in_usd"
                      value={formData.salary_in_usd}
                      onChange={handleChange}
                      type="number"
                    />
                    <label htmlFor="salary_in_usd">Salary (USD)</label>
                  </span>
                </div>
                <div className="p-field" style={{ marginBottom: "30px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      value={formData.employee_residence}
                      options={residencies.map((country) => ({ label: country, value: country }))}
                      onChange={(e) => handleDropdownChange("employee_residence", e.value)}
                      filter
                      filterPlaceholder="Search country"
                    />
                    <label htmlFor="employee_residence">Residence (Country)</label>
                  </span>
                </div>
                <div className="p-field" style={{ marginBottom: "30px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      value={formData.remote_ratio}
                      options={remoteRatios}
                      onChange={(e) => handleDropdownChange("remote_ratio", e.value)}
                    />
                    <label htmlFor="remote_ratio">Remote Ratio</label>
                  </span>
                </div>
                <div className="p-field" style={{ marginBottom: "30px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      value={formData.company_size}
                      options={companySizes}
                      onChange={(e) => handleDropdownChange("company_size", e.value)}
                    />
                    <label htmlFor="company_size">Company Size</label>
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
              {predictedExperience ? (
                <div className="p-d-flex p-flex-column p-ai-center">
                  <p>
                    <strong>Predicted Experience Level:</strong> {predictedExperience}
                  </p>
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

export default KNNModel;
