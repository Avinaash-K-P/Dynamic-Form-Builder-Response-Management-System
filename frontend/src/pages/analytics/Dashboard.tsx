import { useEffect, useState } from "react";

import {
  Description,
  CheckCircle,
  Cancel,
  Forum,
  Today,
  People,
  HowToReg,
} from "@mui/icons-material";

import { Alert, CircularProgress } from "@mui/material";

import SummaryCard from "../../components/dashboard/SummaryCard";
import ResponseChart from "../../components/dashboard/ResponseChart";
import FormResponseTable from "../../components/dashboard/FormResponseTable";

import {
  getDashboardAnalytics,
} from "../../services/dashboardService";

import type {
  DashboardAnalyticsResponse,
} from "../../services/dashboardService";

import "../../styles/dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardAnalyticsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getDashboardAnalytics();

      setDashboardData(data);
    } catch (error) {
      console.error(
        "Failed to fetch dashboard analytics:",
        error
      );

      setError(
        "Unable to load dashboard analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <CircularProgress />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-error">
        <Alert severity="error">
          {error ||
            "Unable to load dashboard data."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ================================
          Dashboard Header
      ================================= */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of forms, responses and users
          </p>
        </div>
      </div>

      {/* ================================
          Summary Cards
      ================================= */}

      <div className="dashboard-summary-grid">

        <SummaryCard
          title="Total Forms"
          value={dashboardData.total_forms}
          icon={<Description />}
        />

        <SummaryCard
          title="Active Forms"
          value={dashboardData.active_forms}
          icon={<CheckCircle />}
        />

        <SummaryCard
          title="Inactive Forms"
          value={dashboardData.inactive_forms}
          icon={<Cancel />}
        />

        <SummaryCard
          title="Total Responses"
          value={dashboardData.total_responses}
          icon={<Forum />}
        />

        <SummaryCard
          title="Today's Responses"
          value={dashboardData.today_responses}
          icon={<Today />}
        />

        <SummaryCard
          title="Total Users"
          value={dashboardData.total_users}
          icon={<People />}
        />

        <SummaryCard
          title="Active Users"
          value={dashboardData.active_users}
          icon={<HowToReg />}
        />

      </div>

      {/* ================================
          Responses by Form
      ================================= */}

      <div className="dashboard-section">

        <div className="dashboard-section-header">
          <h2>Responses by Form</h2>

          <p>
            Response distribution across all forms
          </p>
        </div>

        <div className="dashboard-response-grid">

          {/* Chart */}

          <div className="dashboard-panel">
            <h3>Response Chart</h3>

            <ResponseChart
              data={
                dashboardData.responses_by_form
              }
            />
          </div>

          {/* Table */}

          <div className="dashboard-panel">
            <h3>Form Response Summary</h3>

            <FormResponseTable
              data={
                dashboardData.responses_by_form
              }
            />
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
