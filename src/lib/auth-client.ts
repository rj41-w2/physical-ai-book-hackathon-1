import { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Open-Source Friendly URL Management
export const useBackendUrl = () => {
  const { siteConfig } = useDocusaurusContext();
  
  // 1. Priority: Vercel/Build-time Environment Variable
  const configUrl = siteConfig.customFields?.backendUrl as string;
  
  if (typeof window !== 'undefined') {
    // 2. Localhost detection
    if (window.location.hostname === 'localhost') {
      return "http://localhost:8000";
    }
    // 3. Return the config URL (Hugging Face)
    return configUrl || ""; 
  }
  
  return configUrl || "http://localhost:8000";
};

export const authClient = {
  signUp: {
    email: async (data: any, hooks: any, backendUrl: string) => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/signup`, {
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

        let result;
        try {
          result = await response.json();
        } catch (e) {
          throw new Error(`Server returned non-JSON response: ${response.status}`);
        }

        if (response.ok) {
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("user_email", result.email);
          localStorage.setItem("user_name", result.full_name);
          localStorage.setItem("software_background", result.software_background || data.metadata?.softwareBackground || "");
          localStorage.setItem("hardware_background", result.hardware_background || data.metadata?.hardwareBackground || "");
          hooks.onSuccess();
        } else {
          hooks.onError({ error: { message: result.detail || "Signup failed" } });
        }
      } catch (err: any) {
        console.error("Signup error:", err);
        throw err;
      }
    },
  },
  signIn: {
    email: async (data: any, hooks: any, backendUrl: string) => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        let result;
        try {
          result = await response.json();
        } catch (e) {
          throw new Error(`Server returned non-JSON response: ${response.status}`);
        }

        if (response.ok) {
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("user_email", result.email);
          localStorage.setItem("user_name", result.full_name);
          localStorage.setItem("software_background", result.software_background || "");
          localStorage.setItem("hardware_background", result.hardware_background || "");
          hooks.onSuccess();
        } else {
          hooks.onError({ error: { message: result.detail || "Signin failed" } });
        }
      } catch (err: any) {
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
