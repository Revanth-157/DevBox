import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SnippetsPage from '../SnippetsPage';

test('SnippetsPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <SnippetsPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
