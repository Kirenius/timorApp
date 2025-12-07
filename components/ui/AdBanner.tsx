import React from 'react';
import { X } from 'lucide-react';

interface AdBannerProps {
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  className?: string;
  onClose?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ variant = 'horizontal', className = '', onClose }) => {
  if (variant === 'sidebar') {
    return (
      <div className={`mx-4 mt-auto mb-4 p-4 rounded-lg bg-slate-800 border border-slate-700 text-center relative overflow-hidden group ${className}`}>
        <div className="absolute top-1 right-1 text-[10px] text-slate-500 border border-slate-600 px-1 rounded">IKLAN</div>
        <p className="text-xs text-slate-400 mb-2">Sponsor</p>
        <div className="w-full h-32 bg-slate-700 rounded flex items-center justify-center mb-2 animate-pulse">
           <span className="text-slate-500 text-xs">Space Iklan 250x250</span>
        </div>
        <p className="text-sm font-bold text-white leading-tight mb-2">Hosting Murah & Cepat</p>
        <button className="w-full py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Lihat Promo
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center overflow-hidden ${variant === 'vertical' ? 'w-full h-full min-h-[400px]' : 'w-full py-4'} ${className}`}>
      <div className="absolute top-2 right-2 flex gap-2">
        <span className="text-[10px] text-gray-400 border border-gray-300 px-1 rounded">Ads by TimorAds</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center text-center p-4">
        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
          <img src={`https://picsum.photos/seed/${Math.random()}/100/100`} alt="Ad" className="w-12 h-12 rounded object-cover opacity-80" />
        </div>
        <h4 className="font-bold text-gray-800">Internet Lambat? Ganti Provider!</h4>
        <p className="text-sm text-gray-500 max-w-md mt-1">Dapatkan kecepatan hingga 1Gbps dengan harga spesial hanya untuk hari ini.</p>
        <button className="mt-3 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm hover:bg-blue-700 transition-colors">
          Buka Sekarang
        </button>
      </div>
    </div>
  );
};