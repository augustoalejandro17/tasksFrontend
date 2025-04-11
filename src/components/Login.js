import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert
} from '@mui/material';
import authService from '../services/authService';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: 'admin@example.com',
    password: 'password123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use authService to log in
      await authService.login(credentials.email, credentials.password);
      
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      setError('Error logging in. Please check your credentials and make sure the backend server is running.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        data-testid="login-form"
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={handleChange}
            data-testid="email-input"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            data-testid="password-input"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            For demonstration purposes, you can use the default credentials.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 