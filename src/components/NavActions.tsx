import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const NavActionsContent = () => {
  const [currentLang, setCurrentLang] = useState('EN');

  useEffect(() => {
    // 1. Define the global callback
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ur,en',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element_hidden');
    };

    // 2. Add the script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // 3. Add styles to hide the clunky UI
    if (!document.getElementById('google-translate-styles')) {
      const style = document.createElement('style');
      style.id = 'google-translate-styles';
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon, .goog-te-gadget-simple img { display: none !important; }
        body { top: 0px !important; }
        .goog-te-menu-value span:nth-child(5) { display:none !important; }
        .goog-te-gadget-simple { background-color: transparent !important; border: none !important; padding: 0 !important; }
        #google_translate_element_hidden { display: none !important; }
        .skiptranslate iframe { visibility: hidden !important; display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `;
      document.head.appendChild(style);
    }

    // 4. Polling for cookie
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
      alert('AI Translation is loading... Please wait a few seconds.');
      return;
    }

    const targetLang = currentLang === 'EN' ? 'ur' : 'en';
    googleCombo.value = targetLang;
    googleCombo.dispatchEvent(new Event('change'));
    setCurrentLang(targetLang === 'ur' ? 'UR' : 'EN');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
      <div id="google_translate_element_hidden"></div>
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
        title={currentLang === 'EN' ? "Translate to Urdu" : "Back to English"}
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
