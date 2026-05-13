import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { authClient } from '@site/src/lib/auth-client';

const NavbarUserNameMobileContent = () => {
  const { data: session } = authClient.useSession();
  const [showLogout, setShowLogout] = React.useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <div className="navbar__user-name-mobile">
      {session ? (
        <div style={{ position: 'relative' }}>
          <span 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            onClick={() => setShowLogout(!showLogout)}
          >
            Hi, {session.user.name.split(' ')[0]} ▾
          </span>
          
          {showLogout && (
            <div style={{
              position: 'absolute',
              top: '120%',
              left: 0,
              backgroundColor: 'var(--ifm-background-color)',
              border: '1px solid var(--card-border)',
              borderRadius: '4px',
              padding: '8px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              minWidth: '100px'
            }}>
              <button 
                onClick={handleLogout}
                className="button button--sm button--link"
                style={{ 
                  padding: '4px 8px', 
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
      ) : (
        'AI & Robotics'
      )}
      <style>{`
        @media (min-width: 997px) {
          .navbar__user-name-mobile { display: none; }
        }
        @media (max-width: 996px) {
          .navbar__brand { display: none !important; }
          .navbar__user-name-mobile {
            display: flex;
            align-items: center;
            font-weight: bold;
            color: var(--ifm-color-primary);
            font-size: 0.9rem;
            margin-left: 4px;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default function NavbarUserNameMobile() {
  return (
    <BrowserOnly>
      {() => <NavbarUserNameMobileContent />}
    </BrowserOnly>
  );
}
