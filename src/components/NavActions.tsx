import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { authClient, useBackendUrl } from '@site/src/lib/auth-client';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';

const NavActionsContent = () => {
  const { data: session } = authClient.useSession();
  const { colorMode, setColorMode } = useColorMode();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
      {/* 1. Theme Toggle */}
      <div style={{ transform: 'scale(0.8)', marginRight: '4px' }}>
        <ColorModeToggle
          value={colorMode}
          onChange={(val) => setColorMode(val)}
        />
      </div>

      {/* 2. Auth State (Sign In Button) */}
      {session ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--page-secondary-text)', whiteSpace: 'nowrap' }}>
            Hi, {session.user.name.split(' ')[0]}
          </span>
          <button 
            onClick={handleLogout}
            className="button button--sm button--outline button--secondary"
            style={{ padding: '4px 12px', fontSize: '0.7rem' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link 
          to="/signin" 
          className="button button--sm button--primary"
          style={{ 
            padding: '4px 16px', 
            fontSize: '0.75rem', 
            fontWeight: 'bold',
            minWidth: '90px',
            textAlign: 'center'
          }}
        >
          Sign In
        </Link>
      )}
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
