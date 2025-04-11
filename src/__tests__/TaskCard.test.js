import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';

describe('TaskCard Component', () => {
  const mockTask = {
    _id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'TODO',
    dueDate: '2023-12-31'
  };
  
  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onStatusChange: jest.fn()
  };

  test('renders task details correctly', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const editButton = screen.getByLabelText('edit task');
    fireEvent.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    const deleteButton = screen.getByLabelText('delete task');
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  test('displays proper buttons based on task status', () => {
    // For TODO status
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    expect(screen.getByText('Start Task')).toBeInTheDocument();
    expect(screen.getByText('Mark Complete')).toBeInTheDocument();
    
    // For IN_PROGRESS status
    const inProgressTask = { ...mockTask, status: 'IN_PROGRESS' };
    render(<TaskCard task={inProgressTask} {...mockHandlers} />);
    expect(screen.getByText('Move to Todo')).toBeInTheDocument();
    expect(screen.getByText('Mark Complete')).toBeInTheDocument();
    
    // For COMPLETED status
    const completedTask = { ...mockTask, status: 'COMPLETED' };
    render(<TaskCard task={completedTask} {...mockHandlers} />);
    expect(screen.queryByText('Mark Complete')).not.toBeInTheDocument();
  });

  test('calls onStatusChange with correct parameters when status buttons are clicked', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    
    // Test "Start Task" button
    const startButton = screen.getByText('Start Task');
    fireEvent.click(startButton);
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith('1', 'IN_PROGRESS');
    
    // Test "Mark Complete" button
    const completeButton = screen.getByText('Mark Complete');
    fireEvent.click(completeButton);
    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith('1', 'COMPLETED');
  });
}); 