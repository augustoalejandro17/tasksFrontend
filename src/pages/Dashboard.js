import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import taskService from '../services/taskService';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setCurrentTask(null);
    setIsEditing(false);
    setOpenForm(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      fetchTasks();
      setAlert({
        open: true,
        message: 'Task created successfully!',
        severity: 'success'
      });
    } catch (err) {
      setAlert({
        open: true,
        message: 'Failed to create task. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(currentTask._id, taskData);
      fetchTasks();
      setAlert({
        open: true,
        message: 'Task updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      setAlert({
        open: true,
        message: 'Failed to update task. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      setAlert({
        open: true,
        message: 'Task deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      setAlert({
        open: true,
        message: 'Failed to delete task. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      if (taskToUpdate) {
        await taskService.updateTask(taskId, { ...taskToUpdate, status: newStatus });
        fetchTasks();
        setAlert({
          open: true,
          message: 'Task status updated successfully!',
          severity: 'success'
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        message: 'Failed to update task status. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSubmit = (taskData) => {
    if (isEditing) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Add Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No tasks found</Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Task" to create your first task
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <TaskCard 
                task={task} 
                onEdit={handleEditTask} 
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <TaskForm 
        open={openForm} 
        handleClose={handleCloseForm} 
        task={currentTask}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 