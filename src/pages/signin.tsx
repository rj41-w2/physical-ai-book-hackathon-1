import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient, useBackendUrl } from '@site/src/lib/auth-client';
import styles from './auth.module.css';

export default function Signin() {
  const backendUrl = useBackendUrl();
  const [formData, setForm] = useState({ email: '', password: '' });
  const [notice, setNotice] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    setNotice(null);
    setIsSubmitting(true);
    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: '/',
      }, {
        onSuccess: () => {
          setNotice({ text: 'Welcome back! Redirecting…', kind: 'success' });
          window.setTimeout(() => window.location.assign('/'), 1200);
        },
        onError: (ctx) => setNotice({ text: ctx.error.message, kind: 'error' }),
      }, backendUrl);
    } catch (err: any) {
      setNotice({ text: `Sign in failed: ${err.message || 'Unknown error'}`, kind: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout title="Sign In">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your Robotics journey.</p>

          {notice && <div className={`${styles.notice} ${notice.kind === 'success' ? styles.success : styles.error}`} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.text}</div>}

          <form onSubmit={handleSignin} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="signin-email">Email Address</label>
              <input id="signin-email" name="email" type="email" placeholder="rehanjamil@gmail.com" onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="signin-password">Password</label>
              <input id="signin-password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <button type="submit" className="button button--primary button--lg" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
