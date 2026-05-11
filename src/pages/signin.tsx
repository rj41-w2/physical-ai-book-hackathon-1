import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient, useBackendUrl } from '@site/src/lib/auth-client';
import { useHistory } from '@docusaurus/router';
import styles from './auth.module.css';

export default function Signin() {
  const backendUrl = useBackendUrl();
  const [formData, setForm] = useState({ email: '', password: '' });
  const history = useHistory();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      }, {
        onSuccess: () => {
          alert('Welcome Back!');
          history.push('/');
        },
        onError: (ctx) => alert(ctx.error.message),
      }, backendUrl);
    } catch (err) {
      alert('Connection to Auth Server failed.');
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
          
          <form onSubmit={handleSignin} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input name="email" type="email" placeholder="zia@panaversity.org" onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <button type="submit" className="button button--primary button--lg">
              Sign In
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
