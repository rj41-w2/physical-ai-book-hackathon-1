import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { authClient } from '@site/src/lib/auth-client';

const PersonalizeButtonContent = () => {
  const { data: session } = authClient.useSession();
  const [isPersonalized, setIsPersonalized] = useState(false);

  if (!session) {
    return null; // Don't show the button if not logged in
  }

  // Retrieve metadata from session
  // Note: Better-Auth metadata is typically in session.user.metadata
  const software = session.user.metadata?.softwareBackground || 'Beginner';
  const hardware = session.user.metadata?.hardwareBackground || 'None';

  const togglePersonalization = async () => {
    setIsPersonalized(!isPersonalized);
    if (!isPersonalized) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch('http://localhost:8000/api/user/preferences', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              software_background: software,
              hardware_background: hardware
            })
          });
          alert(`AI Agent: Preferences saved! Optimizing content for a ${software} software developer with ${hardware} hardware experience.`);
        } catch (err) {
          console.error("Failed to save preferences:", err);
        }
      } else {
        alert(`AI Agent: Optimizing content for a ${software} software developer with ${hardware} hardware experience.`);
      }
    }
  };

  return (
    <div style={{ 
      margin: '1.5rem 0',
      padding: '1.5rem',
      background: isPersonalized ? 'rgba(0, 242, 255, 0.1)' : 'var(--card-bg)',
      border: `1px solid ${isPersonalized ? 'var(--ifm-color-primary)' : 'var(--card-border)'}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, color: 'var(--ifm-color-primary)' }}>
            {isPersonalized ? "✨ Personalized View Active" : "Customize Your Learning"}
          </h4>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--page-secondary-text)' }}>
            Target: <strong>{software} Software</strong> | <strong>{hardware} Hardware</strong>
          </p>
        </div>
        <button 
          className={`button button--${isPersonalized ? 'primary' : 'outline button--secondary'}`}
          onClick={togglePersonalization}
          style={{ fontFamily: 'var(--ifm-heading-font-family)', textTransform: 'uppercase', fontWeight: 'bold' }}
        >
          {isPersonalized ? "Reset View" : "Personalize Content"}
        </button>
      </div>
      
      {isPersonalized && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '10px', 
          borderLeft: '4px solid var(--ifm-color-primary)',
          background: 'rgba(0, 0, 0, 0.2)',
          fontSize: '0.9rem',
          fontStyle: 'italic'
        }}>
          AI Note: We have simplified technical jargon and highlighted relevant {software === 'beginner' ? 'foundational' : 'advanced'} concepts based on your profile.
        </div>
      )}
    </div>
  );
};

export default function PersonalizeButton() {
  return (
    <BrowserOnly>
      {() => <PersonalizeButtonContent />}
    </BrowserOnly>
  );
}
