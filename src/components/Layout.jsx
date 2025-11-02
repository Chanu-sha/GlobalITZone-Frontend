import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className={`${isAuthPage ? '' : 'pb-20 pt-16'}`}>
        <Outlet />
      </main>
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export default Layout;
