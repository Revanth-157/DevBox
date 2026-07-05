import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage';

test('DashboardPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
