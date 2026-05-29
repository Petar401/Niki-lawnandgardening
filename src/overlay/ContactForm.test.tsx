import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  it('renders the required fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email')).toBeRequired();
    expect(screen.getByLabelText('Service')).toBeRequired();
    expect(screen.getByLabelText('Message')).toBeRequired();
  });

  it('caps input length to keep the mailto URL bounded', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('maxlength', '80');
    expect(screen.getByLabelText('Email')).toHaveAttribute('maxlength', '120');
    expect(screen.getByLabelText('Message')).toHaveAttribute('maxlength', '3000');
  });

  it('forces an explicit service choice via a disabled placeholder option', () => {
    render(<ContactForm />);
    const select = screen.getByLabelText('Service') as HTMLSelectElement;
    // The default value is the empty placeholder, not "Mowing".
    expect(select.value).toBe('');
    const placeholder = screen.getByRole('option', { name: /select a service/i }) as HTMLOptionElement;
    expect(placeholder.disabled).toBe(true);
  });
});
