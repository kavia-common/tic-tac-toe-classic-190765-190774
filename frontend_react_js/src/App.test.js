import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and status', () => {
  render(<App />);
  expect(screen.getByText(/Tic/i)).toBeInTheDocument();
  expect(screen.getByText(/Current Player/i)).toBeInTheDocument();
});
