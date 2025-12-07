import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = APP_CONFIG.url;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Timor App',
          text: 'Kelola data dan privasi dengan mudah.',
          url: appUrl,
        });
        onClose();
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-green-500 text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      ),
      link: `https://wa.me/?text=Coba aplikasi Timor App! Kelola data dan privasi dengan mudah: ${appUrl}`
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ),
      link: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}`
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
      link: `https://twitter.com/intent/tweet?text=Coba aplikasi Timor App!&url=${appUrl}`
    },
    {
      name: 'YouTube',
      color: 'bg-red-600 text-white',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      link: `https://www.youtube.com/results?search_query=Timor+App`
    },
    {
      name: 'Email',
      color: 'bg-gray-600 text-white',
      icon: <Mail size={24} />,
      link: `mailto:?subject=Undangan Timor App&body=Halo, coba aplikasi ini: ${appUrl}`
    }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Share2 className="text-red-500" size={24} />
              Bagikan App
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Ajak teman atau rekan kerja anda untuk menggunakan platform Timor App.
          </p>
          
          {/* Native Share Button for Mobile */}
          {navigator.share && (
            <div className="mb-4">
              <button
                 onClick={handleShare}
                 className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                <Share2 size={18} />
                Buka Menu Share
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Atau salin link manual</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {shareOptions.map((opt) => (
              <a 
                key={opt.name}
                href={opt.link}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 group w-16"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${opt.color}`}>
                  {opt.icon}
                </div>
                <span className="text-xs font-medium text-gray-600">{opt.name}</span>
              </a>
            ))}
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-1 truncate text-sm text-gray-600 font-mono">
                {appUrl}
              </div>
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-md transition-colors ${
                  copied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            {copied && (
              <span className="absolute -top-8 right-0 text-xs bg-black text-white px-2 py-1 rounded animate-fade-in">
                Tersalin!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};