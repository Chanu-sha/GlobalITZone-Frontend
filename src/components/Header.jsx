import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

const Header = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  const logoImageUrl = "/GlobalITZone.png";

  // Logo stays the same logic
  const logoLinkTo = isAdmin ? '/admin' : '/'; 

  // Always link to /profile for the user avatar
  const userAvatarLinkTo = '/profile';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to={logoLinkTo} className="flex items-center space-x-2">
            <div
              className="
                w-28 h-auto 
                aspect-[19/6] 
                sm:w-36 sm:h-auto 
                rounded-lg flex items-center justify-center overflow-hidden
              "
            >
              <img
                src={logoImageUrl}
                alt="Global IT Zone Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* User Menu & Auth Links */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors sm:px-4 sm:py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors sm:px-4 sm:py-2"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {/* User Avatar → Always goes to profile */}
                  <Link
                    to={userAvatarLinkTo}
                    className="
                      bg-gradient-to-r from-red-500 to-orange-500 
                      rounded-full flex items-center justify-center 
                      w-10 h-10 sm:w-8 sm:h-8 
                      hover:scale-105 active:scale-95 
                      transition-all duration-200
                    "
                  >
                    <User className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                  </Link>

                  {/* User Name (hidden on mobile) */}
                  <span className="hidden sm:block text-sm text-gray-300">
                    {user.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
