import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";
import data from '../data/salaries.json';

export default function Dashboard() {
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [jsonSalariesData, setJsonSalariesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setJsonSalariesData(data);
      } catch (error) {
        console.error("Error fetching Json file: ", error);
      }
    };

    fetchData();
    initFilters();
  }, []);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      company_location: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      company_size: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      employee_residence: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      employment_type: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      experience_level: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      job_title: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      remote_ratio: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      salary: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      salary_currency: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      salary_in_usd: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      work_year: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <>
      <div className="card">
        <DataTable
          value={jsonSalariesData}
          paginator
          showGridlines
          rows={10}
          loading={loading}
          dataKey="id"
          filters={filters}
          globalFilterFields={[
            "company_location",
            "job_title",
            "salary",
            "work_year",
            "company_size",
          ]}
          header={header}
          emptyMessage="No data found."
          onFilter={(e) => setFilters(e.filters)}
        >
          <Column
            field="company_location"
            header="Company Location"
            filterPlaceholder="Search by Company Location"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="company_size"
            header="Company Size"
            filterPlaceholder="Search by Company Size"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="employee_residence"
            header="Employee Residence"
            filterField="Employee Residence"
            showFilterMatchModes={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="employment_type"
            header="Employment Type"
            filterField="Employment Type"
            dataType="date"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="experience_level"
            header="Experience Level"
            filterField="Experience Level"
            dataType="numeric"
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="job_title"
            header="Job Title"
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="remote_ratio"
            header="Remote Ratio"
            showFilterMatchModes={false}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="salary"
            header="Salary"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "8rem" }}
          />
          <Column
            field="salary_currency"
            header="Salary Currency"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "8rem" }}
          />
          <Column
            field="salary_in_usd"
            header="Salary In USD"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "8rem" }}
          />
          <Column
            field="work_year"
            header="Work Year"
            dataType="boolean"
            bodyClassName="text-center"
            style={{ minWidth: "8rem" }}
          />
        </DataTable>
      </div>
    </>
  );
}
