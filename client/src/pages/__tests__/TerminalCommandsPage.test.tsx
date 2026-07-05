import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TerminalCommandsPage from '../TerminalCommandsPage';

test('TerminalCommandsPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <TerminalCommandsPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
