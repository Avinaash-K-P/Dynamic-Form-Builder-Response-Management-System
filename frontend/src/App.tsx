import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./layouts/Home";
import Dashboard from "./pages/analytics/Dashboard";
import Profile from "./pages/profile/Profile";
import Forms from "./pages/form/Form";
import FormBuilder from "./pages/form/FormBuilder";
import Responses from "./pages/response/Response";
import ResponseForm from "./pages/response/ResponseForm";
import Exports from "./pages/export/Export";
import Notifications from "./pages/notification/Notification";
import ActivityLogs from "./pages/activity_log/ActivityLog";


function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* APPLICATION LAYOUT */} 

      <Route element={<Home />}> 
      	
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/forms" element={<Forms />} />
        
        <Route path="/forms/:formId/builder" element={<FormBuilder />} />

        <Route path="/responses" element={<Responses />} />

        <Route path="/responses/fill/:formId" element={<ResponseForm/>} />

        <Route path="/exports" element={<Exports/>} />  

        <Route path="/notifications" element={<Notifications/>} />          

        <Route path="/activity-logs" element={<ActivityLogs/>} />      

      </Route>
        
      {/* Default Route */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* 404 Route */}

      <Route
        path="*"
        element={<div>Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;

