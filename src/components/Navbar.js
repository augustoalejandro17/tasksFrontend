import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import authService from '../services/authService';

const Navbar = ({ onLogout }) => {
  const currentUser = authService.getCurrentUser();
  const username = currentUser ? currentUser.username : 'User';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <AssignmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management System
          </Typography>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<AssignmentIcon />}
          >
            Tasks
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/statistics"
            startIcon={<BarChartIcon />}
          >
            Statistics
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <AccountCircleIcon sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ mr: 2 }}>
              {username}
            </Typography>
            <Button 
              color="inherit" 
              onClick={onLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar; 