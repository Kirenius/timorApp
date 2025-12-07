import React from 'react';
import { LayoutDashboard, User, LogOut, X, MapPin, ShieldCheck, Crown, Wallet, Share2, Download, Sparkles } from 'lucide-react';
import { ViewState, User as UserType } from '../types';
import { AdBanner } from './ui/AdBanner';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  onShare: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: UserType;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  onLogout,
  onShare,
  isOpen,
  setIsOpen,
  user
}) => {
  const menuItems = [
    { id: 'dashboard' as ViewState, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'ai' as ViewState, label: 'Timor AI', icon: <Sparkles size={20} /> },
    { id: 'internet' as ViewState, label: 'Internet Privasi', icon: <ShieldCheck size={20} /> },
    { id: 'profile' as ViewState, label: 'Profil Saya', icon: <User size={20} /> },
  ];

  // Add Wallet menu ONLY if user is Super Admin
  if (user.role === 'Super Admin') {
    // Insert after dashboard/ai/internet
    menuItems.splice(3, 0, { id: 'wallet' as ViewState, label: 'Keuangan', icon: <Wallet size={20} /> });
  }

  const handleInstallClick = () => {
    // Simulasi install prompt PWA
    alert("Install Timor App ke Home Screen?\n\n(Ini adalah simulasi fitur PWA Install)");
  };

  return (
    <>
      {/* Mobile Overlay - z-index increased to 40 to cover header (z-20) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - z-index increased to 50 */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex shrink-0 items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 text-red-500">
            <MapPin className="fill-current" />
            <span className="text-xl font-bold text-white tracking-wide">TIMOR<span className="text-red-500">APP</span></span>
          </div>
          <button 
            className="ml-auto md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'ai' && (
                <span className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Ad Slot (Only if NOT VIP) */}
        {!user.isVip && (
          <AdBanner variant="sidebar" />
        )}

        {/* User Profile Summary at Bottom */}
        <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
              />
              {user.isVip && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-slate-900">
                  <Crown size={10} className="text-slate-900 fill-current" />
                </div>
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate max-w-[110px]">{user.name}</p>
                {user.isVip ? (
                   <Crown size={14} className="text-yellow-400 fill-yellow-400/20 shrink-0" />
                ) : (
                   <span className="text-[10px] bg-slate-700 text-slate-300 font-bold px-1.5 py-0.5 rounded leading-none">FREE</span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-green-300 transition-colors"
            >
              <Download size={16} />
              Install App
            </button>

            <button
              onClick={onShare}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-blue-300 transition-colors"
            >
              <Share2 size={16} />
              Bagikan App
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};