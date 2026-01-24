// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { href, Link, useLocation, useNavigate } from 'react-router-dom';
import { FolderIcon } from '@heroicons/react/24/outline';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UserIcon,
  BuildingOfficeIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const DashboardLayout = ({ children }) => {
  const { user, company, logout, isProfessionnel } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
    { name: 'Mon profil', href: '/profile', icon: UserIcon },
    { name: 'Projets', href: '/projects', icon: FolderIcon },
    ...(isProfessionnel ? [{ name: 'Mon entreprise', href: '/company', icon: BuildingOfficeIcon }] : []),
    { name : 'Devis', href: '/quotations', icon: DocumentTextIcon },
    { name: 'Sécurité', href: '/security', icon: KeyIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <Logo size="small" />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-neutral-400 hover:text-neutral-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-neutral-600 hover:bg-primary-50 hover:text-primary'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-primary"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:hidden flex justify-center">
              <Logo size="small" showText={false} />
            </div>

            {/* User menu */}
            <div className="relative ml-auto">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <span className="hidden sm:block text-sm font-medium text-neutral-700">
                  {user?.first_name}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 z-20">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <UserIcon className="w-4 h-4" />
                      Mon profil
                    </Link>
                    <Link
                      to="/security"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <KeyIcon className="w-4 h-4" />
                      Sécurité
                    </Link>
                    <hr className="my-1 border-neutral-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;