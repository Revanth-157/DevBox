import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotesPage from '../NotesPage';

test('NotesPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <NotesPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
