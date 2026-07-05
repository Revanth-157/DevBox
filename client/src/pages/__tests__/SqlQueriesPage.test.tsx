import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SqlQueriesPage from '../SqlQueriesPage';

test('SqlQueriesPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <SqlQueriesPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
