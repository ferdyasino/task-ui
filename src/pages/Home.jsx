import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tasks from './task/Tasks.jsx';
import ProfileDashboard from '../users/profile/ProfileDashboard.jsx';
import { getExternalLogout } from '../context/AuthContext.jsx';
import {
  Box,
  Typography,
  Button,
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

  const handleTabClick = (index) => {
    setValue(index);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      getExternalLogout()(); // triggers logout and clears auth
      window.location.href = '/login'; // redirect after logout
    }
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
        {/* Left tabs */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {['Home', 'My Tasks', 'Profile'].map((label, index) => (
            <Button
              key={label}
              onClick={() => handleTabClick(index)}
              sx={{
                color: value === index ? '#fff' : '#bbb',
                borderBottom: value === index ? '2px solid white' : 'none',
                borderRadius: 0,
                textTransform: 'none',
                fontWeight: value === index ? 'bold' : 'normal',
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Right logout */}
        <Button
          sx={{
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
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
      </Box>
    </Box>
  );
}
