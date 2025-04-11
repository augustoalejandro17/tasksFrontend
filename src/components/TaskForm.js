import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';

const taskStatuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const TaskForm = ({ open, handleClose, task, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: ''
  });

  useEffect(() => {
    if (task && isEditing) {
      // Format the date for the input field (YYYY-MM-DD)
      const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status ? task.status.toLowerCase() : 'todo',
        dueDate: formattedDate
      });
    } else {
      // Reset form when opened for creation
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        dueDate: ''
      });
    }
  }, [task, isEditing, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              required
              margin="dense"
              name="title"
              label="Task Title"
              type="text"
              fullWidth
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                {taskStatuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="dueDate"
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formData.dueDate}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 