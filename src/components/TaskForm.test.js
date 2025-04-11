import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('status-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('shows validation errors when form is submitted with empty fields', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    // Find and click the submit button without filling the form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    // Check that validation errors are shown
    expect(screen.getByText('El título es requerido')).toBeInTheDocument();
    expect(screen.getByText('La descripción es requerida')).toBeInTheDocument();
    
    // Verify that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    // Fill the form
    const titleInput = screen.getByTestId('title-input').querySelector('input');
    const descriptionInput = screen.getByTestId('description-input').querySelector('textarea');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    
    // Submit the form
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    // Verify that onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task description',
      status: 'todo'
    });
  });

  test('pre-fills form when initialData is provided', () => {
    const initialData = {
      _id: '123',
      title: 'Existing Task',
      description: 'Existing description',
      status: 'in_progress'
    };
    
    render(<TaskForm onSubmit={mockOnSubmit} initialData={initialData} />);
    
    // Check that form is pre-filled
    expect(screen.getByText('Editar Tarea')).toBeInTheDocument();
    expect(screen.getByTestId('title-input').querySelector('input').value).toBe('Existing Task');
    expect(screen.getByTestId('description-input').querySelector('textarea').value).toBe('Existing description');
    
    // Find and click the submit button
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    // Verify that onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Existing Task',
      description: 'Existing description',
      status: 'in_progress'
    });
  });
}); 