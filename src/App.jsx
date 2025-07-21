import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import theme from "./theme";
import "./App.css";
import Login from "./users/login/Login";
import Register from "./users/register/Register";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import Home from "./Home";
import Tasks from "./pages/task/Tasks";
import ProfileDashboard from "./assets/components/ProfileDashboard";
import ForgotPassword from "./users/ForgotPassword";
import ResetPassword from "./users/ResetPassword";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileDashboard />
                </ProtectedRoute>
              }
            />
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
