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

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { name, email, password, confirmPassword, birthDate, role } = form;

    if (!name || !email || !password || !confirmPassword || !birthDate) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (birthDate > today) {
      setError('Birth date cannot be in the future.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, birthDate, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSuccess('Registration successful! Redirecting...');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        role: 'user',
      });

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
          Register
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Birthdate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date().toISOString().split('T')[0],
            }}
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" underline="hover" color="primary">
              Login here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
