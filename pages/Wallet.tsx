import React, { useState } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Download, CreditCard, Activity, RefreshCw, ChevronDown } from 'lucide-react';
import { Transaction } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface WalletProps {
  balance: number;
  transactions: Transaction[];
  onOpenWithdraw: () => void;
}

// Exchange Rates relative to USD
const EXCHANGE_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: '$', name: 'US Dollar' },
  IDR: { rate: 16250, symbol: 'Rp ', name: 'Indonesian Rupiah' },
  MYR: { rate: 4.75, symbol: 'RM', name: 'Malaysian Ringgit' },
  AUD: { rate: 1.52, symbol: 'A$', name: 'Australian Dollar' },
  SGD: { rate: 1.35, symbol: 'S$', name: 'Singapore Dollar' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro' },
  CNY: { rate: 7.23, symbol: '¥', name: 'Chinese Yuan' },
};

export const Wallet: React.FC<WalletProps> = ({ balance, transactions, onOpenWithdraw }) => {
  const [currency, setCurrency] = useState('USD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Simple data for chart
  const chartData = [
    { name: 'Jan', val: 400 },
    { name: 'Feb', val: 300 },
    { name: 'Mar', val: 550 },
    { name: 'Apr', val: 450 },
    { name: 'May', val: 700 },
    { name: 'Jun', val: balance },
  ];

  const currentRate = EXCHANGE_RATES[currency];
  const convertedBalance = balance * currentRate.rate;
  
  // Helper to format currency
  const formatCurrency = (val: number, curr: string) => {
    const opts = { 
      style: 'currency', 
      currency: curr === 'IDR' ? 'IDR' : (curr === 'MYR' ? 'MYR' : curr), 
      minimumFractionDigits: (curr === 'IDR') ? 0 : 2,
      maximumFractionDigits: (curr === 'IDR') ? 0 : 2,
    };
    
    // Manual fallback for formatting if needed, but Intl is good
    if (curr === 'USD') return `$${val.toFixed(2)}`;
    
    // Custom formatted string
    return new Intl.NumberFormat('en-US', opts).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dompet Admin</h1>
          <p className="text-gray-500">Kelola pendapatan, saldo, dan penarikan dana.</p>
        </div>
        <Button onClick={onOpenWithdraw} className="bg-slate-900 hover:bg-slate-800 text-white">
          <ArrowUpRight className="mr-2 h-4 w-4" /> Tarik Dana (Withdraw)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-xl relative overflow-visible z-10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <WalletIcon size={120} />
          </div>
          
          {/* Currency Switcher */}
          <div className="absolute top-6 right-6 z-20">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors backdrop-blur-sm"
              >
                <RefreshCw size={14} className={isDropdownOpen ? 'animate-spin' : ''} />
                <span>{currency}</span>
                <ChevronDown size={14} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 py-1 animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Pilih Mata Uang
                  </div>
                  {Object.keys(EXCHANGE_RATES).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currency === curr ? 'bg-slate-100 text-blue-600 font-medium' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 text-center font-mono text-xs bg-gray-100 rounded px-1">{EXCHANGE_RATES[curr].symbol}</span>
                        {curr}
                      </span>
                      {currency === curr && <Activity size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="relative z-10 mt-2">
            <p className="text-slate-400 font-medium mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Total Saldo Aktif
            </p>
            
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-5xl font-mono font-bold tracking-tight">
                {formatCurrency(convertedBalance, currency)}
              </h2>
            </div>
            
            {currency !== 'USD' && (
              <p className="text-slate-400 text-xs font-mono mb-6 flex items-center gap-1">
                Rate: 1 USD = {formatCurrency(currentRate.rate, currency)}
              </p>
            )}
            
            <div className={`flex gap-8 ${currency === 'USD' ? 'mt-8' : 'mt-2'}`}>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Pemasukan (Bulan Ini)</p>
                <p className="text-xl font-semibold flex items-center mt-1 text-green-400">
                  <ArrowDownLeft className="mr-1 h-4 w-4" /> {formatCurrency(1245.00 * currentRate.rate, currency)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase font-bold">Pengeluaran (Bulan Ini)</p>
                <p className="text-xl font-semibold flex items-center mt-1 text-red-400">
                  <ArrowUpRight className="mr-1 h-4 w-4" /> {formatCurrency(320.00 * currentRate.rate, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
           <Card className="flex-1 flex flex-col justify-center relative overflow-hidden">
             <div className="flex items-center gap-4 mb-4 relative z-10">
               {/* Red/Orange background specifically for Merchantrade branding feel */}
               <div className="p-3 bg-red-100 text-red-600 rounded-lg shadow-sm border border-red-200">
                 <CreditCard size={24} strokeWidth={2} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 uppercase font-semibold">Rekening Terhubung</p>
                 <p className="font-bold text-gray-900 leading-tight">Visa Merchantrade</p>
                 <p className="text-xs font-mono text-gray-500">•••• 8821</p>
               </div>
             </div>
             <Button variant="outline" className="w-full text-xs relative z-10">Ubah Rekening</Button>
             
             {/* Decorative watermark */}
             <div className="absolute -bottom-4 -right-4 opacity-5">
               <CreditCard size={100} />
             </div>
           </Card>

           <Card className="flex-1">
             <p className="text-sm font-medium text-gray-500 mb-2">Tren Pendapatan ({currency})</p>
             <div className="h-24 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#10b981" 
                      fill="#d1fae5" 
                      strokeWidth={2} 
                      // Transform values for chart based on rate
                    />
                    <Tooltip contentStyle={{border:0, borderRadius: 8}} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader title="Riwayat Transaksi" description={`Catatan lengkap dalam ${currency === 'USD' ? 'USD ($)' : `konversi ${currency} (Estimasi)`}.`} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Transaksi ID</th>
                <th className="px-6 py-3">Keterangan</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Jumlah ({currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           {tx.type === 'credit' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        </div>
                        <span className="font-medium text-gray-900">{tx.description}</span>
                      </div>
                      {tx.method && <p className="text-xs text-gray-400 mt-0.5 ml-7">{tx.method}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount * currentRate.rate, currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};