import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword, birthDate, role } = form;

    if (!name || !email || !password || !confirmPassword || !birthDate) {
      return setError('All fields are required.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    const today = new Date().toISOString().split('T')[0];
    if (birthDate > today) {
      return setError('Birth date cannot be in the future.');
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

      navigate('/');

      setSuccess('Registration successful!');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        role: 'user',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">Register</div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="date-wrapper" style={{ position: 'relative' }}>
        {form.birthDate === '' && (
            <span
            style={{
                position: 'absolute',
                left: 10,
                top: 9,
                color: '#aaa',
                pointerEvents: 'none',
            }}
            >
            Birthdate
            </span>
        )}
        <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            required
            style={{ paddingLeft: '10px' }}
        />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
