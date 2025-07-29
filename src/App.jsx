import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme";
import "./App.css";

import Login from "./users/login/Login";
import Register from "./users/register/Register";
import ProtectedRoute from "./assets/components/ProtectedRoute";
// import TaskTabs from "./pages/TaskTabs"; // Navbar layout
import Home from "./pages/Home";
import TaskTabs from "./pages/TaskTabs";
import Tasks from "./pages/task/Tasks";
import ProfileDashboard from "./users/profile/ProfileDashboard";
import ForgotPassword from "./users/ForgotPassword";
import ResetPassword from "./users/ResetPassword";
import Users from "./pages/admin/UserManagement"; // if needed for admin

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Authenticated Layout with Navbar */}
            <Route
              element={
                <ProtectedRoute>
                  <TaskTabs />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/profile" element={<ProfileDashboard />} />
              <Route path="/users" element={<Users />} /> {/* Admin only */}
            </Route>

            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
