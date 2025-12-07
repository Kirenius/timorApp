import React, { useState } from 'react';
import { X, CreditCard, Landmark, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, destination: string) => void;
  balance: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onWithdraw, balance }) => {
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [method, setMethod] = useState<'visa' | 'bank'>('visa');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || val > balance) return;

    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onWithdraw(val, destination);
      setProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setDestination('');
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {success ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Penarikan Berhasil</h3>
            <p className="text-gray-500 mt-2">Dana sedang diproses ke Merchantrade / Bank anda.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-gray-900">Tarik Dana (Payout)</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-slate-900 text-white p-4 rounded-xl mb-4">
                <p className="text-slate-400 text-xs uppercase font-semibold">Saldo Tersedia</p>
                <p className="text-3xl font-mono font-bold mt-1">${balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Metode Penarikan</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod('visa')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                      method === 'visa' ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <CreditCard className="mb-1" />
                    <span className="text-xs font-bold text-center">Visa / Merchantrade</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('bank')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center transition-all ${
                      method === 'bank' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Landmark className="mb-1" />
                    <span className="text-xs font-bold text-center">Bank Transfer</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  {method === 'visa' ? 'Nomor Kartu (Merchantrade/Visa)' : 'Nomor Rekening Bank'}
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={method === 'visa' ? "4848 xxxx xxxx xxxx" : "123-456-7890"}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {method === 'visa' && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    *Mendukung Visa Merchantrade Money dan kartu Visa standar.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Jumlah Penarikan ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={balance}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
                />
              </div>

              <Button 
                type="submit" 
                fullWidth 
                disabled={processing || parseFloat(amount) > balance || parseFloat(amount) <= 0}
                className="mt-2 bg-slate-900 hover:bg-slate-800 text-white"
              >
                {processing ? (
                  <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Memproses...</>
                ) : (
                  <>Konfirmasi Penarikan <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};