import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient, useBackendUrl } from '@site/src/lib/auth-client';
import styles from './auth.module.css';

export default function Signup() {
  const backendUrl = useBackendUrl();
  const [formData, setForm] = useState({
    email: '',
    password: '',
    name: '',
    softwareBackground: '',
    hardwareBackground: '',
  });
  const [notice, setNotice] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setNotice(null);
    setIsSubmitting(true);
    try {
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        metadata: {
          softwareBackground: formData.softwareBackground,
          hardwareBackground: formData.hardwareBackground,
        },
        callbackURL: '/',
      }, {
        onSuccess: () => {
          setNotice({ text: 'Account created! Redirecting…', kind: 'success' });
          window.setTimeout(() => window.location.assign('/'), 1200);
        },
        onError: (ctx) => setNotice({ text: ctx.error.message, kind: 'error' }),
      }, backendUrl);
    } catch (err: any) {
      setNotice({ text: `Sign up failed: ${err.message || 'Unknown error'}`, kind: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout title="Sign Up">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1>Create Your Account</h1>
          <p>Join the Physical AI & Robotics community.</p>

          {notice && <div className={`${styles.notice} ${notice.kind === 'success' ? styles.success : styles.error}`} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.text}</div>}

          <form onSubmit={handleSignup} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="signup-name">Full Name</label>
              <input id="signup-name" name="name" type="text" placeholder="Rehan Jamil" onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="signup-email">Email Address</label>
              <input id="signup-email" name="email" type="email" placeholder="rehanjamil@gmail.com" onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <hr className={styles.divider} />
            <h3>Personalization Details</h3>
            <p className={styles.hint}>Tell us about your background to customize your learning experience.</p>

            <div className={styles.formGroup}>
              <label htmlFor="software-background">Software Background</label>
              <select id="software-background" name="softwareBackground" onChange={handleChange} required defaultValue="">
                <option value="" disabled>Select experience level</option>
                <option value="beginner">Beginner (No coding)</option>
                <option value="intermediate">Intermediate (Python/JS)</option>
                <option value="advanced">Advanced (C++/Systems)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hardware-background">Hardware Background</label>
              <select id="hardware-background" name="hardwareBackground" onChange={handleChange} required defaultValue="">
                <option value="" disabled>Select experience level</option>
                <option value="none">No experience</option>
                <option value="hobbyist">Hobbyist (Arduino/Raspberry Pi)</option>
                <option value="professional">Professional (Industrial/PCB Design)</option>
              </select>
            </div>

            <button type="submit" className="button button--primary button--lg" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account…' : 'Sign Up & Personalize'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
