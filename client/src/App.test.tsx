import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

test('renders the home page and displays a create account link', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your developer workspace now includes notes and dashboard workflows.');
  expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
});
