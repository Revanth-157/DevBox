import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import RegisterPage from '../RegisterPage';

test('Auth pages render without crashing', () => {
  const { container: loginContainer } = render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
  const { container: registerContainer } = render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );

  expect(loginContainer.firstChild).toBeTruthy();
  expect(registerContainer.firstChild).toBeTruthy();
});
