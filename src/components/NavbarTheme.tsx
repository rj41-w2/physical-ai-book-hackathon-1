import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';

const NavbarThemeContent = () => {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <div className="navbar__item" style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
      <div style={{ transform: 'scale(0.8)' }}>
        <ColorModeToggle
          value={colorMode}
          onChange={(val) => setColorMode(val)}
        />
      </div>
    </div>
  );
};

export default function NavbarTheme() {
  return (
    <BrowserOnly>
      {() => <NavbarThemeContent />}
    </BrowserOnly>
  );
}
