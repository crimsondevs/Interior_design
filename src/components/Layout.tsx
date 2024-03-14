// Layout.tsx
import React, { ReactNode } from 'react';
import SideIcons from './SideIcons'; // Adjust the import path as necessary

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <SideIcons />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;