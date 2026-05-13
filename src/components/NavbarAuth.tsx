import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { authClient } from '@site/src/lib/auth-client';
import Link from '@docusaurus/Link';

const NavbarAuthContent = () => {
  const { data: session } = authClient.useSession();
  const [showLogout, setShowLogout] = React.useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div className="navbar__item" style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
      {session ? (
        <div className="navbar__auth-desktop-only">
          <div style={{ position: 'relative' }}>
            <span 
              className="navbar__link" 
              style={{ 
                fontSize: '0.85rem', 
                color: 'var(--ifm-color-primary)', 
                whiteSpace: 'nowrap', 
                padding: '0 8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              onClick={() => setShowLogout(!showLogout)}
            >
              Hi, {session.user.name.split(' ')[0]} ▾
            </span>
            
            {showLogout && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                backgroundColor: 'var(--ifm-background-color)',
                border: '1px solid var(--card-border)',
                borderRadius: '4px',
                padding: '4px',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                minWidth: '120px'
              }}>
                <button 
                  onClick={handleLogout}
                  className="button button--sm button--link"
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '0.8rem', 
                    color: 'var(--ifm-color-danger)', 
                    width: '100%', 
                    textAlign: 'left',
                    textDecoration: 'none'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <style>{`
            @media (max-width: 996px) {
              .navbar__auth-desktop-only { display: none; }
            }
          `}</style>
        </div>
      ) : (
        <Link 
          to="/signin" 
          className="button button--sm button--primary"
          style={{ 
            padding: '4px 16px', 
            fontSize: '0.75rem', 
            fontWeight: 'bold',
            minWidth: '100px',
            textAlign: 'center'
          }}
        >
          Sign In
        </Link>
      )}
    </div>
  );
};

export default function NavbarAuth() {
  return (
    <BrowserOnly>
      {() => <NavbarAuthContent />}
    </BrowserOnly>
  );
}
