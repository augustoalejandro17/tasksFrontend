import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return 'default';
    case 'in_progress':
      return 'primary';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {task.title}
        </Typography>
        
        <Chip 
          label={getStatusLabel(task.status)} 
          color={getStatusColor(task.status)} 
          size="small" 
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>

        {task.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Due: {formatDate(task.dueDate)}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => onEdit(task)} 
              aria-label="edit task"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => onDelete(task._id)} 
              aria-label="delete task"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box>
            {task.status.toLowerCase() !== 'completed' && (
              <Button 
                size="small" 
                color="success" 
                onClick={() => onStatusChange(task._id, 'completed')}
              >
                Mark Complete
              </Button>
            )}
            {task.status.toLowerCase() === 'todo' && (
              <Button 
                size="small" 
                color="primary" 
                onClick={() => onStatusChange(task._id, 'in_progress')}
              >
                Start Task
              </Button>
            )}
            {task.status.toLowerCase() === 'in_progress' && (
              <Button 
                size="small" 
                onClick={() => onStatusChange(task._id, 'todo')}
              >
                Move to Todo
              </Button>
            )}
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default TaskCard; 