import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, getExternalLogout } from '../context/AuthContext.jsx';
import { Box, Button, Menu, MenuItem } from '@mui/material';

export default function TaskTabs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Map route to index for active tab highlighting
  const pathToIndex = {
    '/': 0,
    '/home': 0,
    '/tasks': 1,
    '/profile': 2,
    '/users': 3,
  };
  const indexToPath = {
    0: '/',
    0: '/home',
    1: '/tasks',
    2: '/profile',
    3: '/users',
  };

  const activeTab = pathToIndex[location.pathname] ?? 0;

  const handleTabClick = (index) => {
    navigate(indexToPath[index]);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      getExternalLogout()();
      window.location.href = '/login';
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
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
              color: activeTab === 0 ? '#fff' : '#bbb',
              borderBottom: activeTab === 0 ? '2px solid white' : 'none',
              borderRadius: 0,
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => handleTabClick(1)}
            sx={{
              color: activeTab === 1 ? '#fff' : '#bbb',
              borderBottom: activeTab === 1 ? '2px solid white' : 'none',
              borderRadius: 0,
            }}
          >
            {isAdmin ? 'All Tasks' : 'My Tasks'}
          </Button>

          {isAdmin && (
            <Button
              onClick={() => handleTabClick(3)}
              sx={{
                color: activeTab === 3 ? '#fff' : '#bbb',
                borderBottom: activeTab === 3 ? '2px solid white' : 'none',
                borderRadius: 0,
              }}
            >
              User Management
            </Button>
          )}
        </Box>

        {/* Profile Menu */}
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

      {/* Content Area */}
      <Box sx={{ pt: '64px', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
