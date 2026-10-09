import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import "../styles/layout.css";

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(
      (previous) => !previous
    );
  };

  return (
    <div
      className={`home-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >
      <Header
        onMenuClick={toggleSidebar}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
      />

      <main className="home-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Home;

