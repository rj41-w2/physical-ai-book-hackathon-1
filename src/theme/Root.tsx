import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      {children}
      <ChatWidget />
    </>
  );
}
