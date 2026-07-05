import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ApiCollectionsPage from '../ApiCollectionsPage';

test('ApiCollectionsPage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <ApiCollectionsPage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
