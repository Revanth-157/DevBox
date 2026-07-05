import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResourcesPage from '../ResourcesPage';

test('ResourcesPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <ResourcesPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
