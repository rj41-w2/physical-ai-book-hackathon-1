import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import NavbarTheme from '@site/src/components/NavbarTheme';
import NavbarAuth from '@site/src/components/NavbarAuth';
import NavbarLanguage from '@site/src/components/NavbarLanguage';
import NavbarUserNameMobile from '@site/src/components/NavbarUserNameMobile';

export default function NavbarItemWrapper(props) {
  if (props.type === 'custom-nav-theme') {
    return <div className="custom-nav-item custom-nav-theme-item"><NavbarTheme {...props} /></div>;
  }
  if (props.type === 'custom-nav-auth') {
    return <div className="custom-nav-item custom-nav-auth-item"><NavbarAuth {...props} /></div>;
  }
  if (props.type === 'custom-nav-lang') {
    return <div className="custom-nav-item custom-nav-lang-item"><NavbarLanguage {...props} /></div>;
  }
  if (props.type === 'custom-nav-user-mobile') {
    return <div className="custom-nav-item custom-nav-user-mobile-item"><NavbarUserNameMobile {...props} /></div>;
  }
  return <NavbarItem {...props} />;
}
