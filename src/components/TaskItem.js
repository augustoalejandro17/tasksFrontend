import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [status, setStatus] = useState(task.status || 'todo');
  
  const statusLabels = {
    'todo': 'Por Hacer',
    'in_progress': 'En Progreso',
    'completed': 'Completada'
  };
  
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    onUpdate(task._id, { ...task, status: newStatus });
  };
  
  const handleDelete = () => {
    onDelete(task._id);
  };
  
  return (
    <Card 
      sx={{ 
        minWidth: 275, 
        margin: 2,
        boxShadow: 3,
        borderLeft: 6,
        borderColor: status === 'completed' ? 'success.main' : 
                    status === 'in_progress' ? 'warning.main' : 
                    'info.main'
      }}
      data-testid="task-item"
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="task-status-label">Estado</InputLabel>
            <Select
              labelId="task-status-label"
              id="task-status"
              value={status}
              label="Estado"
              onChange={handleStatusChange}
              data-testid="status-select"
            >
              <MenuItem value="todo">Por Hacer</MenuItem>
              <MenuItem value="in_progress">En Progreso</MenuItem>
              <MenuItem value="completed">Completada</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          color="error" 
          onClick={handleDelete}
          data-testid="delete-button"
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskItem; 