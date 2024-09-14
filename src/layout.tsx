import React, { ReactNode } from 'react';
import Header from './components/navbar/Header';
import Footer from './components/footer/Footer';

interface LayoutProps {
  children: ReactNode; // Use 'children' as it's standard in React
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      {children} 
      <Footer />
    </div>
  );
};

export default Layout;
