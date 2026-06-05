import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient, useBackendUrl } from '@site/src/lib/auth-client';
import { useHistory } from '@docusaurus/router';
import styles from './auth.module.css';

export default function Signup() {
  const backendUrl = useBackendUrl();
  const [formData, setForm] = useState({
    email: '',
    password: '',
    name: '',
    softwareBackground: '',
    hardwareBackground: ''
  });
  const history = useHistory();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        // Custom metadata for personalization
        metadata: {
          softwareBackground: formData.softwareBackground,
          hardwareBackground: formData.hardwareBackground
        },
        callbackURL: "/",
      }, {
        onSuccess: () => {
          alert('Signup Successful!');
          window.location.href = '/';
        },
        onError: (ctx) => alert(ctx.error.message),
      }, backendUrl);
    } catch (err: any) {
      alert(`Signup Failed: ${err.message || "Unknown error"}`);
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
          
          <form onSubmit={handleSignup} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input name="name" type="text" placeholder="Rehan Jamil" onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input name="email" type="email" placeholder="rehanjamil@gmail.com" onChange={handleChange} required />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <hr className={styles.divider} />
            <h3>Personalization Details</h3>
            <p className={styles.hint}>Tell us about your background to customize your learning experience.</p>

            <div className={styles.formGroup}>
              <label>Software Background</label>
              <select name="softwareBackground" onChange={handleChange} required defaultValue="">
                <option value="" disabled>Select experience level</option>
                <option value="beginner">Beginner (No coding)</option>
                <option value="intermediate">Intermediate (Python/JS)</option>
                <option value="advanced">Advanced (C++/Systems)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Hardware Background</label>
              <select name="hardwareBackground" onChange={handleChange} required defaultValue="">
                <option value="" disabled>Select experience level</option>
                <option value="none">No experience</option>
                <option value="hobbyist">Hobbyist (Arduino/Raspberry Pi)</option>
                <option value="professional">Professional (Industrial/PCB Design)</option>
              </select>
            </div>

            <button type="submit" className="button button--primary button--lg">
              Sign Up & Personalize
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
