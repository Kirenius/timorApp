import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon, Sparkles, MoreHorizontal, Trash2 } from 'lucide-react';
import { ChatMessage, User } from '../types';

interface TimorAIProps {
  user: User;
}

export const TimorAI: React.FC<TimorAIProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Halo ${user.name}! Saya Timor AI. Ada yang bisa saya bantu terkait aplikasi ini, koneksi internet, atau informasi lainnya?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (text: string): string => {
    const lower = text.toLowerCase();
    
    if (lower.includes('internet') || lower.includes('koneksi') || lower.includes('vpn')) {
      return "Anda dapat mengelola koneksi aman di menu 'Internet Privasi'. Kami menyediakan server di Timor-Leste, Singapura, dan Australia dengan enkripsi tingkat tinggi.";
    }
    if (lower.includes('vip') || lower.includes('premium') || lower.includes('bayar')) {
      return "Fitur VIP memberikan akses ke server premium (SG/AU), kecepatan tanpa batas, dan pengalaman bebas iklan. Anda bisa upgrade mulai dari $5.00/bulan.";
    }
    if (lower.includes('pemilik') || lower.includes('owner') || lower.includes('siapa')) {
      return "Aplikasi ini dimiliki dan dikelola oleh Kirenius Kollo (CEO & Founder).";
    }
    if (lower.includes('uang') || lower.includes('saldo') || lower.includes('dompet')) {
      return user.role === 'Super Admin' 
        ? "Sebagai Super Admin, Anda dapat melihat saldo dan menarik dana di menu 'Keuangan'." 
        : "Menu Keuangan hanya tersedia untuk Admin. Silakan hubungi dukungan jika Anda memiliki kendala pembayaran.";
    }
    if (lower.includes('timor') || lower.includes('dili')) {
      return "Timor App adalah platform digital kebanggaan Timor-Leste yang bertujuan untuk memajukan infrastruktur teknologi bangsa.";
    }
    if (lower.includes('hello') || lower.includes('hai') || lower.includes('halo')) {
      return `Halo ${user.name}! Senang bertemu Anda. Ada yang ingin ditanyakan?`;
    }
    
    return "Maaf, saya masih belajar. Bisakah Anda mengulangi pertanyaan dengan topik spesifik seputar aplikasi ini?";
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const responseText = generateResponse(newUserMsg.text);
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      text: "Chat telah dibersihkan. Ada lagi yang bisa saya bantu?",
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] md:h-[calc(100vh-theme(spacing.32))] flex flex-col animate-fade-in gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-purple-600 fill-current" />
            Timor AI
          </h1>
          <p className="text-gray-500">Asisten virtual cerdas untuk membantu Anda.</p>
        </div>
        <Button variant="ghost" onClick={clearChat} className="text-gray-400 hover:text-red-500">
          <Trash2 size={18} />
        </Button>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-lg bg-slate-50 relative">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                    isUser ? 'bg-slate-200 border-slate-300' : 'bg-gradient-to-br from-purple-600 to-indigo-600 border-transparent'
                  }`}>
                    {isUser ? (
                      <UserIcon size={16} className="text-gray-600" />
                    ) : (
                      <Bot size={18} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start w-full">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                   <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all shadow-sm"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pesan untuk Timor AI..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder:text-gray-400 py-2"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">Timor AI mungkin membuat kesalahan. Pertimbangkan untuk memverifikasi informasi penting.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};