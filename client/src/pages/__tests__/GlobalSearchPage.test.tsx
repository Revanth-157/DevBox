import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GlobalSearchPage from '../GlobalSearchPage';

test('GlobalSearchPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <GlobalSearchPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
