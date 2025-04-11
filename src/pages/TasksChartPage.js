import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Box, CircularProgress } from '@mui/material';
import { 
  PieChart, Pie, Cell, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import tasksService from '../services/tasksService';

const COLORS = ['#0088FE', '#FFBB28', '#00C49F'];
const STATUS_LABELS = {
  'todo': 'Por Hacer',
  'in_progress': 'En Progreso',
  'completed': 'Completada'
};

const TasksChartPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskStats, setTaskStats] = useState([]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getAllTasks();
      setTasks(data);
      calculateStats(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los datos. Por favor intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskData) => {
    // Count tasks by status
    const statusCounts = {
      'todo': 0,
      'in_progress': 0,
      'completed': 0
    };

    taskData.forEach(task => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      } else {
        // Default to 'todo' if status is unknown
        statusCounts.todo++;
      }
    });

    // Convert to array for recharts
    const stats = Object.keys(statusCounts).map(status => ({
      name: STATUS_LABELS[status] || status,
      value: statusCounts[status],
      status: status
    }));

    setTaskStats(stats);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} data-testid="tasks-chart-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Estadísticas de Tareas
      </Typography>

      {tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No hay tareas disponibles para mostrar estadísticas.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }} elevation={3}>
              <Typography variant="h6" gutterBottom align="center">
                Distribución de Tareas por Estado
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} tareas`, 'Cantidad']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }} elevation={3}>
              <Typography variant="h6" gutterBottom align="center">
                Cantidad de Tareas por Estado
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskStats}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Cantidad de Tareas">
                      {taskStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TasksChartPage; 