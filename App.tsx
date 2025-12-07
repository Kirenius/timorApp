import React, { useState, useEffect } from 'react';
import { ViewState, User, Transaction } from './types';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Internet } from './pages/Internet';
import { Wallet } from './pages/Wallet';
import { TimorAI } from './pages/TimorAI';
import { PaymentModal } from './components/PaymentModal';
import { WithdrawModal } from './components/WithdrawModal';
import { ShareModal } from './components/ShareModal';
import { Menu, DollarSign, TrendingUp } from 'lucide-react';
import { INITIAL_USER_CONFIG } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authStatus = localStorage.getItem('timor_auth');
    return authStatus !== 'false'; 
  });
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User>(INITIAL_USER_CONFIG);
  
  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Monetization & Wallet State
  const [adStats, setAdStats] = useState({ impressions: 0, revenue: 0 });
  const [walletBalance, setWalletBalance] = useState(450.00);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-8821', date: '2024-05-20', description: 'VIP Subscription - User #221', amount: 5.00, type: 'credit', status: 'completed', method: 'Visa' },
    { id: 'TX-8820', date: '2024-05-19', description: 'Ad Revenue Payout (Google)', amount: 12.50, type: 'credit', status: 'completed' },
  ]);

  useEffect(() => {
    localStorage.setItem('timor_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // AD IMPRESSION TRACKING LOGIC
  useEffect(() => {
    if (isAuthenticated && !user.isVip) {
      if (['dashboard', 'internet'].includes(currentView)) {
        const timer = setTimeout(() => {
          setAdStats(prev => {
            const newImpressions = prev.impressions + 1;
            const cpm = 2.50; 
            const revenueInc = cpm / 1000;
            const newRevenue = prev.revenue + revenueInc;
            
            console.log(`[MONETIZATION] Ad Impression Recorded. Revenue: +$${revenueInc}`);
            return { impressions: newImpressions, revenue: newRevenue };
          });
          
          setWalletBalance(prev => prev + 0.0025);
        }, 500); 

        return () => clearTimeout(timer);
      }
    }
  }, [currentView, isAuthenticated, user.isVip]);

  const handleLogin = (email: string) => {
    const isAdmin = email === 'admin@timor.tl';
    const isOwner = email === 'kirenius.kollo@timorapp.com';
    
    // Override user based on login
    if (isOwner) {
       setUser(INITIAL_USER_CONFIG); // Owner
    } else if (isAdmin) {
       setUser({ ...INITIAL_USER_CONFIG, name: 'Admin Staff', email, role: 'Admin', isVip: true });
    } else {
       setUser({ ...INITIAL_USER_CONFIG, name: 'Pengguna Baru', email, role: 'User', isVip: false });
    }

    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSidebarOpen(false);
    setAdStats({ impressions: 0, revenue: 0 });
  };

  const handleUpgradeClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setUser({ ...user, isVip: true, role: user.role === 'User' ? 'VIP Member' : user.role });
    setIsPaymentModalOpen(false);
    
    setWalletBalance(prev => prev + 5.00);
    setTransactions(prev => [
      {
        id: `TX-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        description: `Upgrade VIP - ${user.name}`,
        amount: 5.00,
        type: 'credit',
        status: 'completed',
        method: 'Visa'
      },
      ...prev
    ]);
  };

  const handleWithdraw = (amount: number, destination: string) => {
    setWalletBalance(prev => prev - amount);
    const methodLabel = destination.length > 12 ? 'Visa Merchantrade' : 'Bank Transfer';
    
    setTransactions(prev => [
      {
        id: `WD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        description: `Withdrawal to ${destination}`,
        amount: amount,
        type: 'debit',
        status: 'completed',
        method: methodLabel
      },
      ...prev
    ]);
  };

  const toggleUserRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'Super Admin' ? 'User' : 'Super Admin'
    }));
    if (user.role === 'Super Admin' && currentView === 'wallet') {
      setCurrentView('dashboard');
    }
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-gray-900 relative">
      <Sidebar 
        currentView={currentView}
        onChangeView={setCurrentView}
        onLogout={handleLogout}
        onShare={() => setIsShareModalOpen(true)}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />

      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-20 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-gray-900 text-lg">Timor App</span>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'ai' && <TimorAI user={user} />}
          {currentView === 'internet' && <Internet user={user} onUpgrade={handleUpgradeClick} />}
          {currentView === 'profile' && (
            <Profile 
              user={user} 
              onToggleRole={toggleUserRole} 
              onUpdateProfile={handleUpdateProfile}
            />
          )}
          {currentView === 'wallet' && user.role === 'Super Admin' && (
            <Wallet 
              balance={walletBalance} 
              transactions={transactions} 
              onOpenWithdraw={() => setIsWithdrawModalOpen(true)} 
            />
          )}
        </main>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        planPrice="$5.00/bln"
      />

      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        balance={walletBalance}
      />

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {isAuthenticated && !user.isVip && adStats.impressions > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-none">
           <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm bg-opacity-95 max-w-xs transform transition-all hover:scale-105 pointer-events-auto">
              <div className="flex items-center justify-between mb-2 gap-4">
                 <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Live Revenue</span>
                 <span className="flex items-center text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Active
                 </span>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <DollarSign size={20} />
                 </div>
                 <div>
                    <div className="text-2xl font-bold font-mono tracking-tight leading-none text-white">
                       ${adStats.revenue.toFixed(4)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                       <TrendingUp size={12} className="text-blue-400" />
                       CPM $2.50 • {adStats.impressions} Imps
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;