import { useState, useEffect } from 'react';

const API_URL = "http://localhost:8000/api/auth";

export const authClient = {
  signUp: {
    email: async (data: any, hooks: any) => {
      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            full_name: data.name,
            software_background: data.metadata?.softwareBackground,
            hardware_background: data.metadata?.hardwareBackground,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("user_email", result.email);
          localStorage.setItem("user_name", result.full_name);
          // Store background info for UI consistency
          localStorage.setItem("software_background", data.metadata?.softwareBackground || "");
          localStorage.setItem("hardware_background", data.metadata?.hardwareBackground || "");
          hooks.onSuccess();
        } else {
          hooks.onError({ error: { message: result.detail || "Signup failed" } });
        }
      } catch (err) {
        console.error("Signup error:", err);
        throw err;
      }
    },
  },
  signIn: {
    email: async (data: any, hooks: any) => {
      try {
        const response = await fetch(`${API_URL}/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("user_email", result.email);
          localStorage.setItem("user_name", result.full_name);
          hooks.onSuccess();
        } else {
          hooks.onError({ error: { message: result.detail || "Signin failed" } });
        }
      } catch (err) {
        console.error("Signin error:", err);
        throw err;
      }
    },
  },
  signOut: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("software_background");
    localStorage.removeItem("hardware_background");
    window.location.href = "/";
  },
  getUser: () => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    return email ? { email, name } : null;
  },
  useSession: () => {
    const [session, setSession] = useState<{ data: any }>({ data: null });
    
    useEffect(() => {
      const email = localStorage.getItem("user_email");
      const name = localStorage.getItem("user_name");
      if (email) {
        setSession({
          data: {
            user: {
              email,
              name,
              metadata: {
                softwareBackground: localStorage.getItem("software_background"),
                hardwareBackground: localStorage.getItem("hardware_background"),
              }
            }
          }
        });
      }
    }, []);
    
    return session;
  }
};
