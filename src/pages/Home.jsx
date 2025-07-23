import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tasks from './task/Tasks.jsx';
import ProfileDashboard from '../users/profile/ProfileDashboard.jsx';
import Users from './admin/UserManagement.jsx';
import { useAuth, getExternalLogout } from '../context/AuthContext.jsx';

import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

function CustomTabPanel({ children = null, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: '100%', width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 0, m: 0, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function TaskTabs() {
  const [value, setValue] = useState(0);
  const { user } = useAuth(); // Get user info
  const [anchorEl, setAnchorEl] = useState(null);

  const isAdmin = user?.role === 'admin';

  const handleTabClick = (index) => {
    setValue(index);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      getExternalLogout()(); // triggers logout and clears auth
      window.location.href = '/login'; // redirect after logout
    }
  };

  const handleProfileClick = () => {
    setValue(2); // Profile index
    handleMenuClose();
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Top navigation bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#555',
          color: '#fff',
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 2,
          height: '64px',
        }}
      >
        {/* Left Tabs */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => handleTabClick(0)}
            sx={{
              color: value === 0 ? '#fff' : '#bbb',
              borderBottom: value === 0 ? '2px solid white' : 'none',
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: value === 0 ? 'bold' : 'normal',
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => handleTabClick(1)}
            sx={{
              color: value === 1 ? '#fff' : '#bbb',
              borderBottom: value === 1 ? '2px solid white' : 'none',
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: value === 1 ? 'bold' : 'normal',
            }}
          >
           {isAdmin ? 'All Tasks' : 'My Tasks'}
          </Button>

          {isAdmin && (
            <Button
              onClick={() => handleTabClick(3)} // User Management index
              sx={{
                color: value === 3 ? '#fff' : '#bbb',
                borderBottom: value === 3 ? '2px solid white' : 'none',
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: value === 3 ? 'bold' : 'normal',
              }}
            >
              User Management
            </Button>
          )}
        </Box>

        {/* Right: Profile Dropdown */}
        <Box>
          <Button
            onClick={handleMenuClick}
            sx={{
              color: '#fff',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            {user?.name || 'Profile'}
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ pt: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <CustomTabPanel value={value} index={0}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Howdy! Welcome to TaskMan (beta)
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your tasks efficiently and easily.
              </Typography>
            </Box>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Tasks />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <ProfileDashboard />
        </CustomTabPanel>

        {isAdmin && (
          <CustomTabPanel value={value} index={3}>
            <Users />
          </CustomTabPanel>
        )}
      </Box>
    </Box>
  );
}
