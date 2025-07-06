import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tasks from './pages/task/Tasks.jsx';
import {
  Box,
  Typography,
  Button
} from '@mui/material';

// ---------- CustomTabPanel ----------
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

// ---------- Main Component ----------
export default function TaskTabs() {
  const [value, setValue] = useState(0);

  const handleTabClick = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Fixed Navbar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#5c5c5c',
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => handleTabClick(0)}
            sx={{
              color: value === 0 ? '#fff' : '#bbb',
              borderBottom: value === 0 ? '2px solid white' : 'none',
              borderRadius: 0,
              textTransform: 'none',
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
            }}
          >
            My Tasks
          </Button>
        </Box>
        <Button sx={{ color: '#fff', textTransform: 'none' }}>Logout</Button>
      </Box>

      {/* Tab Content Wrapper */}
      <Box sx={{ pt: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <CustomTabPanel value={value} index={0}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6">
              Howdy! Welcome to TaskMan (beta)
            </Typography>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Tasks />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
