import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TasksListPage from './TasksListPage';
import tasksService from '../services/tasksService';

// Mock the tasks service
jest.mock('../services/tasksService');

describe('TasksListPage Component', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo'
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in_progress'
    }
  ];

  beforeEach(() => {
    // Reset all mock implementations
    jest.clearAllMocks();
    
    // Setup getAllTasks mock implementation
    tasksService.getAllTasks.mockResolvedValue(mockTasks);
    
    // Setup createTask mock implementation
    tasksService.createTask.mockImplementation((task) => 
      Promise.resolve({ _id: '3', ...task })
    );
    
    // Setup updateTask mock implementation
    tasksService.updateTask.mockImplementation((id, task) => 
      Promise.resolve({ _id: id, ...task })
    );
    
    // Setup deleteTask mock implementation
    tasksService.deleteTask.mockResolvedValue({ success: true });
  });

  test('renders and loads tasks', async () => {
    render(<TasksListPage />);
    
    // Check for loading indicator
    expect(screen.getByText(/sistema de gestión de tareas/i)).toBeInTheDocument();
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(tasksService.getAllTasks).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('creates a new task', async () => {
    render(<TasksListPage />);
    
    // Wait for initial tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
    
    // Fill and submit the new task form
    const titleInput = screen.getByTestId('title-input').querySelector('input');
    const descriptionInput = screen.getByTestId('description-input').querySelector('textarea');
    const submitButton = screen.getByTestId('submit-button');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);
    
    // Verify service was called with correct data
    await waitFor(() => {
      expect(tasksService.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        status: 'todo'
      });
    });
  });

  test('updates task status', async () => {
    render(<TasksListPage />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
    
    // Find all status select components and choose the first one
    const statusSelects = screen.getAllByTestId('status-select');
    fireEvent.mouseDown(statusSelects[0]);
    
    // Find and click on the 'Completada' option
    const completedOption = screen.getByText('Completada');
    fireEvent.click(completedOption);
    
    // Verify service was called with correct data
    await waitFor(() => {
      expect(tasksService.updateTask).toHaveBeenCalledWith('1', {
        _id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'completed'
      });
    });
  });

  test('deletes a task', async () => {
    render(<TasksListPage />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
    
    // Find all delete buttons and click the first one
    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);
    
    // Verify service was called with correct ID
    await waitFor(() => {
      expect(tasksService.deleteTask).toHaveBeenCalledWith('1');
    });
  });

  test('shows error when tasks fail to load', async () => {
    // Override the mock to simulate an error
    tasksService.getAllTasks.mockRejectedValue(new Error('Failed to fetch'));
    
    render(<TasksListPage />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/error al cargar las tareas/i)).toBeInTheDocument();
    });
  });
}); 