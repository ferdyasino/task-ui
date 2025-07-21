import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

const ProfileDashboard = () => {
  const { isAuthenticated, authData, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authData?.token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [authData]);

  if (!authData?.token) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Please log in to view your profile.
        </Typography>
        <Button variant="contained" color="primary" href="/login">
          Go to Login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userData?.name || "User"}
      </Typography>
      <Typography>Email: {userData?.email}</Typography>
      <Typography>User ID: {userData?.id}</Typography>

      <Box mt={4} component={Paper} p={2} elevation={2}>
        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>

        <Typography>Role: {userData?.role || "N/A"}</Typography>

        {userData?.birthDate ? (
          <Typography>
            Birth Date: {new Date(userData.birthDate).toLocaleDateString()}
          </Typography>
        ) : (
          <Typography>Birth Date: Not provided</Typography>
        )}

        <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
          Account Created:{" "}
          {userData?.createdAt
            ? new Date(userData.createdAt).toLocaleString()
            : "Unknown"}
        </Typography>
      </Box>

      {/* <Box mt={3}>
        <Button variant="contained" color="primary" onClick={logout}>
          Logout
        </Button>
      </Box> */}
    </Box>
  );
};

export default ProfileDashboard;
