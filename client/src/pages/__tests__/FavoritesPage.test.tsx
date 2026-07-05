import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FavoritesPage from '../FavoritesPage';

test('FavoritesPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
