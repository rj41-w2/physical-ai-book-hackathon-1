import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const NavbarLanguageContent = () => {
  const [currentLang, setCurrentLang] = useState('English');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkCookie = () => {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      if (match && match[1] === 'ur') {
        setCurrentLang('اردو');
      } else {
        setCurrentLang('English');
      }
    };
    
    checkCookie();
    const interval = setInterval(checkCookie, 500);
    return () => clearInterval(interval);
  }, []);

  const setLanguage = (lang: string) => {
    const targetLang = lang === 'English' ? 'en' : 'ur';
    document.cookie = `googtrans=/en/${targetLang}; path=/`;
    const host = window.location.hostname;
    document.cookie = `googtrans=/en/${targetLang}; domain=${host}; path=/`;
    window.location.reload();
  };

  return (
    <div className="dropdown dropdown--hoverable dropdown--right navbar__item" style={{ padding: '0 4px' }}>
      <a
        className="navbar__link lang-link-custom"
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.85rem',
          fontWeight: 700,
          padding: '0 8px',
          minWidth: '40px',
          justifyContent: 'center'
        }}
        onClick={(e) => e.preventDefault()}
      >
        <span className="lang-icon-mobile" style={{ color: 'var(--ifm-color-primary)' }}>
          <svg 
            viewBox="0 0 24 24" 
            width="20" 
            height="20" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </span>
        <span className="lang-text-desktop" style={{ color: 'inherit' }}>{currentLang}</span>
        <style>{`
          .lang-link-custom:hover .lang-text-desktop {
            color: var(--ifm-color-primary) !important;
          }
          @media (min-width: 997px) {
            .lang-icon-mobile { display: none; }
            .navbar__link { min-width: 80px !important; }
          }
          @media (max-width: 996px) {
            .lang-text-desktop { display: none; }
          }
        `}</style>
      </a>
      <ul className="dropdown__menu">
        <li>
          <a className="dropdown__link" onClick={() => setLanguage('English')} style={{ cursor: 'pointer' }}>
            English
          </a>
        </li>
        <li>
          <a className="dropdown__link" onClick={() => setLanguage('اردو')} style={{ cursor: 'pointer' }}>
            اردو
          </a>
        </li>
      </ul>
    </div>
  );
};

export default function NavbarLanguage() {
  return (
    <BrowserOnly>
      {() => <NavbarLanguageContent />}
    </BrowserOnly>
  );
}
