import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, Users, User, ShoppingCart, LayoutDashboard, ListOrdered } from 'lucide-react'; 

const BottomNav = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const commonItems = [
    {
      name: 'Products',
      path: '/products',
      icon: Package,
      isProductTab: true, 
    },
    {
      name: 'About Us',
      path: '/about',
      icon: Users,
    },
  ];

  const customerProtectedItems = [
    {
      name: 'My Orders',
      path: '/orders',
      icon: ShoppingCart,
      protected: true,
      isOrderTab: true,
    },
  ];

  const adminItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      protected: true,
      isAdminItem: true,
    },
    {
      name: 'Manage Orders',
      path: '/admin/orders',
      icon: ListOrdered,
      protected: true,
      isAdminItem: true,
    },
  ];

  const profileItem = {
    name: 'Profile',
    path: '/profile',
    icon: User,
    protected: true,
    isProfileTab: true,
  };
  
  let finalNavItems;
  
  if (isAdmin) {
    finalNavItems = [
      adminItems[0], // Dashboard
      commonItems.find(item => item.name === 'About Us'), // About Us
      adminItems[1], // Manage Orders
      profileItem, // Profile at the end
    ];
  } else {
    finalNavItems = [
      commonItems.find(item => item.name === 'Products'), // Products
      commonItems.find(item => item.name === 'About Us'), // About Us
      ...customerProtectedItems, // My Orders (will be filtered later if not logged in)
      profileItem, // Profile at the end
    ];
  }
  
  const filteredNavItems = finalNavItems.filter(item => item !== undefined);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 bottom-nav">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.protected && !user) {
              return null;
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : ''}`} />
                <span className="text-xs font-medium mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;