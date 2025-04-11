import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'TODO',
    dueDate: '2023-12-31'
  };
  
  const mockHandlers = {
    handleClose: jest.fn(),
    onSubmit: jest.fn()
  };

  test('renders the form with correct title for new task', () => {
    render(
      <TaskForm 
        open={true} 
        handleClose={mockHandlers.handleClose} 
        onSubmit={mockHandlers.onSubmit} 
        isEditing={false}
      />
    );
    
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('renders the form with correct title for editing task', () => {
    render(
      <TaskForm 
        open={true} 
        handleClose={mockHandlers.handleClose} 
        task={mockTask}
        onSubmit={mockHandlers.onSubmit} 
        isEditing={true}
      />
    );
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  test('loads task data when editing', async () => {
    render(
      <TaskForm 
        open={true} 
        handleClose={mockHandlers.handleClose} 
        task={mockTask}
        onSubmit={mockHandlers.onSubmit} 
        isEditing={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByLabelText('Task Title').value).toBe('Test Task');
      expect(screen.getByLabelText('Description').value).toBe('This is a test task');
    });
  });

  test('submits the form with entered data', async () => {
    render(
      <TaskForm 
        open={true} 
        handleClose={mockHandlers.handleClose} 
        onSubmit={mockHandlers.onSubmit} 
        isEditing={false}
      />
    );
    
    // Fill in the form fields
    fireEvent.change(screen.getByLabelText('Task Title'), {
      target: { value: 'New Task' }
    });
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New task description' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add'));
    
    // Check if onSubmit was called with the correct data
    expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'New task description',
        status: 'TODO'
      })
    );
    
    // Check if handleClose was called
    expect(mockHandlers.handleClose).toHaveBeenCalled();
  });

  test('closes the form when Cancel button is clicked', () => {
    render(
      <TaskForm 
        open={true} 
        handleClose={mockHandlers.handleClose} 
        onSubmit={mockHandlers.onSubmit} 
        isEditing={false}
      />
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandlers.handleClose).toHaveBeenCalled();
  });
}); 