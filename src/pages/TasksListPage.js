import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar, Paper } from '@mui/material';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import tasksService from '../services/tasksService';

const TasksListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getAllTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las tareas. Por favor intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await tasksService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      showNotification('Tarea creada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al crear la tarea', 'error');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await tasksService.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      showNotification('Tarea actualizada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al actualizar la tarea', 'error');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await tasksService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      showNotification('Tarea eliminada exitosamente', 'success');
    } catch (err) {
      showNotification('Error al eliminar la tarea', 'error');
      console.error(err);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} data-testid="tasks-list-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Sistema de Gestión de Tareas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <TaskForm onSubmit={handleCreateTask} />
      </Box>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Mis Tareas
        </Typography>
        <TaskList 
          tasks={tasks} 
          loading={loading} 
          onUpdateTask={handleUpdateTask} 
          onDeleteTask={handleDeleteTask} 
        />
      </Paper>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TasksListPage; 