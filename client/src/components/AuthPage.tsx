import type { ReactNode } from 'react';

interface AuthPageProps {
  title: string;
  description: string;
  children: ReactNode;
}

const AuthPage = ({ title, description, children }: AuthPageProps) => (
  <main className="auth-page">
    <section className="auth-card">
      <div className="auth-hero">
        <p className="auth-kicker">DevBox</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  </main>
);

export default AuthPage;
