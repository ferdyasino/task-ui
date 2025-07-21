import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    localStorage.removeItem('token');

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      // const response = await fetch('http://localhost:4000/api/users/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // const data = await response.json();

      // if (!response.ok || !data.token) {
      //   throw new Error(data.error || 'Login failed.');
      // }

      // localStorage.setItem('token', data.token);
      // setSuccess('Login successful! Redirecting...');
      // setFormData({ email: '', password: '' });

      // setTimeout(() => navigate('/'), 1000);
      await login(formData);
      setSuccess('Login successful! Redirecting...');
      setFormData({ email: '', password: '' });
      setTimeout(() => navigate('/'), 1000);  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 3, border: '1px solid #333' }}>
        <Box
          sx={{
            backgroundColor: '#555',
            color: 'white',
            py: 1.5,
            textAlign: 'center',
            borderRadius: '4px 4px 0 0',
            fontWeight: 'bold',
            fontSize: '1.4rem',
            mb: 2,
          }}
        >
          Login
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(to right, #4a90e2, #0052cc)',
              '&:hover': {
                background: 'linear-gradient(to right, #0052cc, #4a90e2)',
              },
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <MuiLink component={Link} to="/forgot-password" underline="hover" color="primary">
            Forgot your password?
          </MuiLink>
        </Box>

        <Box mt={1} textAlign="center">
          <Typography variant="body2">
            Don’t have an account?{' '}
            <MuiLink component={Link} to="/register" underline="hover" color="primary">
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
