import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { authClient } from '@site/src/lib/auth-client';
import Link from '@docusaurus/Link';

const NavActionsContent = () => {
  const [currentLang, setCurrentLang] = useState('EN');
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Polling for Google Translate cookie
    const interval = setInterval(() => {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      if (match && match[1] === 'ur') {
        setCurrentLang('UR');
      } else {
        setCurrentLang('EN');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (!googleCombo) {
      alert('AI Translation is loading... Please wait.');
      return;
    }
    const targetLang = currentLang === 'EN' ? 'ur' : 'en';
    googleCombo.value = targetLang;
    googleCombo.dispatchEvent(new Event('change'));
    setCurrentLang(targetLang === 'ur' ? 'UR' : 'EN');
  };

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
      {/* Auth State */}
      {session ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--page-secondary-text)' }}>
            Hi, {session.user.name.split(' ')[0]}
          </span>
          <button 
            onClick={handleLogout}
            className="button button--sm button--outline button--secondary"
            style={{ padding: '2px 8px', fontSize: '0.7rem' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link 
          to="/signin" 
          className="button button--sm button--primary"
          style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 'bold' }}
        >
          Sign In
        </Link>
      )}

      <div id="google_translate_element_hidden"></div>
      
      {/* Language Toggle */}
      <span 
        onClick={toggleLanguage}
        style={{ 
          cursor: 'pointer',
          fontSize: '0.85rem', 
          fontWeight: 700,
          fontFamily: 'var(--ifm-heading-font-family)',
          color: 'var(--ifm-color-primary)',
          letterSpacing: '0.05em',
          padding: '4px 8px',
          userSelect: 'none'
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {currentLang}
      </span>
    </div>
  );
};

export default function NavActions() {
  return (
    <BrowserOnly>
      {() => <NavActionsContent />}
    </BrowserOnly>
  );
}
