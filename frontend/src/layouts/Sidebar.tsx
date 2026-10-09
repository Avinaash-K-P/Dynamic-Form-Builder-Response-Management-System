import { NavLink } from "react-router-dom";


import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import DynamicFormOutlined from "@mui/icons-material/DynamicFormOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";

// import QueryStatsOutlined from "@mui/icons-material/QueryStatsOutlined";
// import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
// import GroupsOutlined from "@mui/icons-material/GroupsOutlined";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({
  collapsed,
}: SidebarProps) => {
  return (

    <aside
  className={`home-sidebar ${
    collapsed ? "collapsed" : ""
  }`}
>
    
<nav className="sidebar-navigation">
  {/* Dashboard */}
  <NavLink to="/dashboard" className="sidebar-link">
    <DashboardOutlined />
    <span>Dashboard</span>
  </NavLink>

  {/* Forms */}
  <NavLink to="/forms" className="sidebar-link">
    <DynamicFormOutlined />
    <span>Forms</span>
  </NavLink>

  {/* Responses */}
  <NavLink to="/responses" className="sidebar-link">
    <FactCheckOutlined />
    <span>Responses</span>
  </NavLink>

  {/* Exports */}
  <NavLink to="/exports" className="sidebar-link">
    <FileDownloadOutlined />
    <span>Exports</span>
  </NavLink>

  {/* Notifications */}
  <NavLink to="/notifications" className="sidebar-link">
    <NotificationsNoneOutlined />
    <span>Notifications</span>
  </NavLink>

{/* Profile */}
<NavLink to="/profile" className="sidebar-link">
  <AccountCircleOutlined />
  <span>Profile</span>
</NavLink>

{/* Activity Logs */}
<NavLink to="/activity-logs" className="sidebar-link">
  <HistoryOutlined />
  <span>Activity Logs</span>
</NavLink>


{/* 
  <div className="sidebar-divider" />
  <NavLink to="/settings" className="sidebar-link">
    <SettingsOutlined />
    <span>Settings</span>
  </NavLink>


  <NavLink to="/users" className="sidebar-link">
    <GroupsOutlined />
    <span>Users</span>
  </NavLink> 
*/}

</nav>


    </aside>
  );
};

export default Sidebar;

