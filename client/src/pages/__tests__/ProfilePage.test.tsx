import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../ProfilePage';

test('ProfilePage renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );

  expect(container.firstChild).toBeTruthy();
});
