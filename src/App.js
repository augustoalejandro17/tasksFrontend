import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import TaskStatistics from './pages/TaskStatistics';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Container from '@mui/material/Container';
import authService from './services/authService';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h5: {
      fontWeight: 500,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <TaskStatistics />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
