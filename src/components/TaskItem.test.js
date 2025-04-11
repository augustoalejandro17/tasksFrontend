import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    _id: '123',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'todo'
  };
  
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
  });

  test('renders task information correctly', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });

  test('calls onUpdate when status is changed', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Find and open the select dropdown
    const statusSelect = screen.getByTestId('status-select');
    fireEvent.mouseDown(statusSelect);
    
    // Find and click on the 'Completed' option
    const completedOption = screen.getByText('Completada');
    fireEvent.click(completedOption);
    
    // Verify the onUpdate function was called with correct arguments
    expect(mockOnUpdate).toHaveBeenCalledWith('123', {
      _id: '123',
      title: 'Test Task',
      description: 'This is a test task',
      status: 'completed'
    });
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    // Verify the onDelete function was called with the correct task ID
    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });
}); 