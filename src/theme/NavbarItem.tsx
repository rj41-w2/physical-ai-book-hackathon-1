import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import NavActions from '@site/src/components/NavActions';

export default function NavbarItemWrapper(props) {
  if (props.type === 'custom-nav-actions') {
    return <NavActions {...props} />;
  }
  return <NavbarItem {...props} />;
}
