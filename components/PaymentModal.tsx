import React, { useState } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planPrice: string;
}

type PaymentMethod = 'card' | 'mobile' | 'visa';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, planPrice }) => {
  const [method, setMethod] = useState<PaymentMethod>('visa');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('Telemor');

  if (!isOpen) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate API processing
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      
      // Auto close after 5 seconds to allow reading receipt
      setTimeout(() => {
        // Check if modal is still open/step is success to avoid double triggering if user clicked button
        onSuccess();
        setStep('form'); 
      }, 5000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in transform transition-all">
        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-gray-900">Upgrade ke Premium VIP</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Price Summary */}
              <div className="mb-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Paket VIP Bulanan</p>
                  <p className="text-xs text-yellow-600">Akses server global & tanpa iklan</p>
                </div>
                <span className="text-xl font-bold text-gray-900">{planPrice}</span>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {/* Dedicated VISA Button */}
                <button
                  onClick={() => setMethod('visa')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    method === 'visa' 
                      ? 'border-blue-700 bg-blue-50 text-blue-800 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <div className="h-6 flex items-center mb-1">
                    <span className="font-serif italic font-black text-xl tracking-tight text-blue-800">VISA</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide">Visa Card</span>
                </button>

                {/* General Card Button */}
                <button
                  onClick={() => setMethod('card')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    method === 'card' 
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <div className="h-6 flex items-center mb-1">
                    <CreditCard size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide">Master / Other</span>
                </button>

                {/* Mobile Button */}
                <button
                  onClick={() => setMethod('mobile')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    method === 'mobile' 
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <div className="h-6 flex items-center mb-1">
                    <Smartphone size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide">E-Wallet</span>
                </button>
              </div>

              {/* Payment Forms */}
              <form onSubmit={handlePayment} className="space-y-4">
                {(method === 'card' || method === 'visa') ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nomor Kartu {method === 'visa' ? '(Visa Only)' : ''}</label>
                      <div className="relative">
                        <CreditCard className={`absolute left-3 top-3 ${method === 'visa' ? 'text-blue-500' : 'text-gray-400'}`} size={16} />
                        <input
                          type="text"
                          required
                          placeholder={method === 'visa' ? "4000 0000 0000 0000" : "0000 0000 0000 0000"}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                            method === 'visa' 
                              ? 'border-blue-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Kadaluarsa</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                            method === 'visa' 
                              ? 'border-blue-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">CVC</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 outline-none transition-all ${
                            method === 'visa' 
                              ? 'border-blue-200 focus:ring-blue-500 focus:border-blue-500' 
                              : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Provider</label>
                      <select 
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white"
                      >
                        <option value="Telemor">Telemor (Mosan)</option>
                        <option value="Timor Telecom">Timor Telecom (T-Pay)</option>
                        <option value="Telkomcel">Telkomcel (T-Money)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nomor Handphone</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                          type="tel"
                          required
                          placeholder="+670 77xx xxxx"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Kode verifikasi akan dikirim ke nomor ini.</p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    fullWidth 
                    disabled={processing} 
                    className={`h-12 text-base ${method === 'visa' ? '!bg-blue-700 hover:!bg-blue-800 focus:!ring-blue-500' : ''}`}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Bayar Sekarang <ShieldCheck className="ml-2" size={18} />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Pembayaran Terenkripsi & Aman
                  </p>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
             {/* Gradient Line Top */}
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-green-600"></div>

             {/* Animated Icon */}
             <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm animate-[bounce_1s_infinite]">
               <CheckCircle size={40} className="text-emerald-600" />
             </div>

             <h2 className="text-2xl font-bold text-gray-900 mb-1">Pembayaran Sukses!</h2>
             <p className="text-gray-500 text-sm mb-8">Layanan Premium aktif.</p>

             {/* Digital Receipt Card */}
             <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 relative">
                {/* Decorative dots simulating ticket */}
                <div className="absolute -left-1.5 top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-white border border-slate-200"></div>
                <div className="absolute -right-1.5 top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-white border border-slate-200"></div>
                
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Paket Layanan</span>
                     <span className="font-bold text-gray-900">VIP Premium Member</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Metode Bayar</span>
                     <span className="font-medium text-gray-900 uppercase flex items-center gap-1">
                       {method === 'visa' ? 'Visa Direct' : method === 'card' ? 'Credit Card' : 'E-Wallet'}
                     </span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">ID Transaksi</span>
                     <span className="font-mono text-xs text-gray-600 tracking-wider">TRX-{Math.floor(Math.random()*1000000)}</span>
                   </div>
                   <div className="border-t border-slate-200 border-dashed my-2 pt-2 flex justify-between items-center">
                     <span className="font-bold text-gray-700">Total Dibayar</span>
                     <span className="font-bold text-lg text-emerald-600">{planPrice}</span>
                   </div>
                </div>
             </div>

             <Button onClick={onSuccess} fullWidth className="bg-slate-900 hover:bg-slate-800 text-white h-11 shadow-lg shadow-slate-200">
               Selesai & Lanjutkan
             </Button>
             
             <p className="text-[10px] text-gray-400 mt-4 text-center">
               Resi digital telah dikirim ke email terdaftar anda.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};