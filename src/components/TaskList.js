import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onUpdateTask, onDeleteTask }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No hay tareas disponibles. ¡Agrega una nueva!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }} data-testid="task-list">
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <TaskItem 
              task={task} 
              onUpdate={onUpdateTask} 
              onDelete={onDeleteTask} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskList; 