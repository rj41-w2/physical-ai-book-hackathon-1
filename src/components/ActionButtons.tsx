import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ActionButtonsContent = () => {
  const handleAction = (actionName: string) => {
    alert(`Connecting to AI Agent for: ${actionName}`);
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      margin: '25px 0',
      padding: '20px',
      background: 'rgba(0, 242, 255, 0.05)',
      border: '2px solid var(--ifm-color-primary)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      zIndex: 10
    }}>
      <button 
        className="button button--primary button--lg" 
        onClick={() => handleAction('Personalize Content')}
        style={{ flex: 1 }}
      >
        ✨ Personalize
      </button>
      <button 
        className="button button--secondary button--lg" 
        onClick={() => handleAction('Translate to Urdu')}
        style={{ flex: 1 }}
      >
        🌐 Translate
      </button>
    </div>
  );
};

export default function ActionButtons() {
  return (
    <BrowserOnly fallback={<div>Loading Actions...</div>}>
      {() => <ActionButtonsContent />}
    </BrowserOnly>
  );
}
