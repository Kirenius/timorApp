
import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, ShieldCheck, Zap, Globe, Lock, RefreshCw, Power, Server, Map, Crown, Loader2, Bluetooth, Smartphone, Share2, Radio } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ServerNode, User } from '../types';

interface InternetProps {
  user: User;
  onUpgrade: () => void;
}

export const Internet: React.FC<InternetProps> = ({ user, onUpgrade }) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'authenticating' | 'disconnecting'>('disconnected');
  const [timer, setTimer] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Bluetooth State
  const [btStatus, setBtStatus] = useState<'idle' | 'scanning' | 'active'>('idle');
  const [btDevices, setBtDevices] = useState<Array<{id: number, name: string, location: string, signal: number}>>([]);

  // Server State Management with VIP flags
  const [servers, setServers] = useState<ServerNode[]>([
    { id: 1, country: 'Timor-Leste', code: 'TL', city: 'Dili', latency: '12ms', status: 'Optimal', x: 82, y: 68, isVip: false },
    { id: 2, country: 'Singapore', code: 'SG', city: 'Jurong', latency: '45ms', status: 'Cepat', x: 76, y: 58, isVip: true },
    { id: 3, country: 'Australia', code: 'AU', city: 'Darwin', latency: '58ms', status: 'Cepat', x: 84, y: 75, isVip: true },
    { id: 4, country: 'Indonesia', code: 'ID', city: 'Jakarta', latency: '62ms', status: 'Normal', x: 78, y: 64, isVip: false },
  ]);
  const [activeServerId, setActiveServerId] = useState<number | null>(null);

  // Format timer to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulate Chart Data
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      name: i,
      speed: 0,
    }));
    setChartData(initialData);

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        // If connected, generate high random speed, else 0 or very low
        const newSpeed = status === 'connected' 
          ? Math.floor(Math.random() * (150 - 80 + 1) + 80) // 80-150 Mbps
          : Math.floor(Math.random() * 5); // 0-5 Mbps (idle noise)
        
        newData.push({
          name: prev[prev.length - 1].name + 1,
          speed: newSpeed
        });
        return newData;
      });

      if (status === 'connected') {
        setTimer(t => t + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const handleToggleConnection = (overrideServerId?: number) => {
    // Determine which server ID to use (override takes precedence, then state)
    const targetId = overrideServerId ?? activeServerId;
    
    // If no server selected, or currently selected server is VIP and user is NOT VIP
    const targetServer = servers.find(s => s.id === targetId);
    if (targetId && targetServer?.isVip && !user.isVip) {
      onUpgrade();
      return;
    }

    if (status === 'connected') {
      setStatus('disconnecting');
      // Step 0: Disconnecting animation
      setTimeout(() => {
        setStatus('disconnected');
        setTimer(0);
      }, 1500);
    } else {
      // Step 1: Connecting
      setStatus('connecting');
      
      // Step 2: Authenticating (after 1.5s)
      setTimeout(() => {
        setStatus('authenticating');
        
        // Step 3: Connected (after another 2s)
        setTimeout(() => {
          setStatus('connected');
          
          // Auto-select "Optimal" server if none is currently selected AND no override was provided
          if (targetId === null && !overrideServerId) {
            const optimalServer = servers.find(s => s.status === 'Optimal');
            if (optimalServer) {
              setActiveServerId(optimalServer.id);
            }
          }
        }, 2000);
      }, 1500);
    }
  };

  const handleConnectFastest = () => {
    // Filter servers based on user capabilities
    // If user is Free, only look at Non-VIP servers to find the fastest *accessible* one
    const accessibleServers = user.isVip ? servers : servers.filter(s => !s.isVip);
    
    // Sort by latency (numeric)
    const sortedServers = [...accessibleServers].sort((a, b) => {
      const latA = parseInt(a.latency.replace('ms', ''));
      const latB = parseInt(b.latency.replace('ms', ''));
      return latA - latB;
    });

    if (sortedServers.length > 0) {
      const fastest = sortedServers[0];
      setActiveServerId(fastest.id);
      
      // Trigger connection if not already connected/connecting
      if (status === 'disconnected') {
        handleToggleConnection(fastest.id);
      }
    }
  };

  const handleServerSelect = (id: number) => {
    if (status !== 'disconnected' && status !== 'connected') return; // Prevent change during transitions
    
    const server = servers.find(s => s.id === id);
    if (server?.isVip && !user.isVip) {
      // Allow selection to show it, but connection will be blocked or we show a visual cue
    }
    setActiveServerId(id);
  };

  // Bluetooth Logic
  const handleToggleBluetooth = () => {
    if (btStatus === 'active') {
      setBtStatus('idle');
      setBtDevices([]);
    } else {
      setBtStatus('scanning');
      // Simulate scanning process
      setTimeout(() => {
        setBtStatus('active');
        setBtDevices([
          { id: 1, name: 'iPhone 15 Pro Max', location: 'Tokyo, JP', signal: 95 },
          { id: 2, name: 'Samsung S24 Ultra', location: 'London, UK', signal: 82 },
          { id: 3, name: 'MacBook Air M3', location: 'New York, USA', signal: 78 },
          { id: 4, name: 'Timor Mesh Node #88', location: 'Dili, TL', signal: 100 },
        ]);
      }, 3000);
    }
  };

  const currentServer = servers.find(s => s.id === activeServerId);
  const isVipLocked = currentServer?.isVip && !user.isVip;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Internet Privasi
            {user.isVip && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full border border-yellow-200 font-bold flex items-center"><Crown size={10} className="mr-1 fill-current"/> VIP ACTIVE</span>}
          </h1>
          <p className="text-gray-500">Koneksi berkecepatan tinggi dengan enkripsi tingkat lanjut.</p>
        </div>
        
        {/* Dynamic Status Indicator */}
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border shadow-sm transition-all duration-300 ${
          status === 'connected' 
            ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
            : status === 'connecting'
              ? 'bg-amber-50 border-amber-200'
              : status === 'authenticating'
                ? 'bg-indigo-50 border-indigo-200'
                : status === 'disconnecting'
                  ? 'bg-slate-100 border-slate-200'
                  : 'bg-rose-50 border-rose-200'
        }`}>
          <div className={`p-2 rounded-lg transition-colors duration-300 ${
            status === 'connected' ? 'bg-emerald-100' : 
            status === 'connecting' ? 'bg-amber-100' : 
            status === 'authenticating' ? 'bg-indigo-100' : 
            status === 'disconnecting' ? 'bg-slate-200' :
            'bg-rose-100'
          }`}>
            {status === 'connected' ? (
              <ShieldCheck size={24} className="text-emerald-600 animate-pulse" />
            ) : status === 'connecting' ? (
              <RefreshCw size={24} className="text-amber-600 animate-spin" />
            ) : status === 'authenticating' ? (
              <Lock size={24} className="text-indigo-600 animate-pulse" />
            ) : status === 'disconnecting' ? (
              <Loader2 size={24} className="text-slate-500 animate-spin" />
            ) : (
              <Shield size={24} className="text-rose-600" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                {(status === 'connecting' || status === 'authenticating') && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    status === 'connecting' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-300 ${
                  status === 'connected' ? 'bg-emerald-600' : 
                  status === 'connecting' ? 'bg-amber-600' : 
                  status === 'authenticating' ? 'bg-indigo-600' :
                  status === 'disconnecting' ? 'bg-slate-500' :
                  'bg-rose-600'
                }`}></span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                status === 'connected' ? 'text-emerald-700' : 
                status === 'connecting' ? 'text-amber-700' : 
                status === 'authenticating' ? 'text-indigo-700' :
                status === 'disconnecting' ? 'text-slate-700' :
                'text-rose-700'
              }`}>
                Status Jaringan
              </span>
            </div>
            <span className={`text-sm font-bold leading-tight ${
              status === 'connected' ? 'text-emerald-800' : 
              status === 'connecting' ? 'text-amber-800' : 
              status === 'authenticating' ? 'text-indigo-800' :
              status === 'disconnecting' ? 'text-slate-800' :
              'text-rose-800'
            }`}>
              {status === 'connected' ? 'AMAN & TERENKRIPSI' : 
               status === 'connecting' ? 'MENGHUBUNGKAN...' : 
               status === 'authenticating' ? 'VERIFIKASI KUNCI...' :
               status === 'disconnecting' ? 'MEMUTUSKAN...' :
               'RENTAN / TERBUKA'}
            </span>
          </div>
        </div>
      </div>

      {/* PREMIUM UPGRADE BANNER (Only if NOT VIP) */}
      {!user.isVip && (
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl p-6 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-10">
            <Crown size={120} />
          </div>
          <div className="z-10">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Crown className="fill-current" />
               Upgrade ke Premium
             </h3>
             <p className="text-yellow-50 max-w-lg mt-1">
               Nikmati kecepatan tanpa batas, akses server internasional (Singapore, Australia), dan hilangkan iklan selamanya.
             </p>
             <div className="flex gap-4 mt-3">
               <div className="bg-white/20 px-3 py-1 rounded text-xs font-medium">Personal: $5.00/bln</div>
               <div className="bg-white/20 px-3 py-1 rounded text-xs font-medium">Enterprise: $49.99/bln</div>
             </div>
          </div>
          <Button 
            className="bg-white text-yellow-700 hover:bg-yellow-50 border-0 shadow-lg whitespace-nowrap z-10 font-bold"
            onClick={onUpgrade}
          >
            Mulai Trial Gratis
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Control Card */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${
            status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'
          }`}></div>
          
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Durasi Koneksi</h3>
            <p className={`text-3xl font-mono font-bold mt-2 transition-colors ${
              status === 'connected' ? 'text-emerald-600' : 'text-slate-400'
            }`}>{formatTime(timer)}</p>
          </div>

          <button
            onClick={() => isVipLocked ? onUpgrade() : handleToggleConnection()}
            disabled={status === 'connecting' || status === 'authenticating' || status === 'disconnecting'}
            className={`
              w-40 h-40 rounded-full flex items-center justify-center border-8 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-offset-4 relative
              ${status === 'connected' 
                ? 'border-emerald-500 text-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-emerald-50 scale-105' 
                : isVipLocked 
                  ? 'border-yellow-400 text-yellow-500 bg-yellow-50 hover:bg-yellow-100 cursor-pointer'
                  : status === 'connecting'
                    ? 'border-amber-400 text-amber-500 animate-pulse bg-amber-50'
                    : status === 'authenticating'
                      ? 'border-indigo-400 text-indigo-500 animate-pulse bg-indigo-50'
                      : status === 'disconnecting'
                        ? 'border-slate-300 text-slate-400 bg-slate-50 cursor-not-allowed'
                        : 'border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500 bg-white hover:bg-red-50'
              }
            `}
          >
            {isVipLocked ? (
              <Crown size={64} strokeWidth={1.5} className="fill-yellow-100" />
            ) : status === 'authenticating' ? (
              <Server size={64} strokeWidth={1.5} className="animate-pulse" />
            ) : status === 'disconnecting' ? (
              <Loader2 size={64} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Power size={64} strokeWidth={1.5} />
            )}
            
            {isVipLocked && (
              <div className="absolute -bottom-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                VIP ONLY
              </div>
            )}
          </button>

          <p className="mt-8 text-sm text-center text-gray-500 px-4">
            {status === 'connected' 
              ? `Terhubung ke ${currentServer?.city || 'Server Aman'}. IP asli Anda disembunyikan.` 
              : isVipLocked 
                ? 'Server ini khusus pengguna Premium. Klik tombol untuk Upgrade.'
                : status === 'authenticating'
                  ? 'Memverifikasi kredensial keamanan dengan server...'
                  : status === 'disconnecting'
                    ? 'Memutus sambungan aman...'
                    : 'Klik tombol di atas untuk mengaktifkan terowongan VPN aman.'}
          </p>
        </Card>

        {/* Speed Monitor & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-full mb-3 transition-colors ${status === 'connected' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                <Zap size={24} />
              </div>
              <div className="text-sm text-gray-500">Kecepatan Unduh</div>
              <div className="text-xl font-bold text-gray-900">
                {status === 'connected' ? '142.5' : '0'} <span className="text-xs font-normal text-gray-500">Mbps</span>
              </div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-full mb-3 transition-colors ${status === 'connected' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                <RefreshCw size={24} />
              </div>
              <div className="text-sm text-gray-500">Latency</div>
              <div className="text-xl font-bold text-gray-900">
                {status === 'connected' && currentServer ? currentServer.latency.replace('ms','') : '-'} <span className="text-xs font-normal text-gray-500">ms</span>
              </div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-full mb-3 transition-colors ${status === 'connected' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                <Globe size={24} />
              </div>
              <div className="text-sm text-gray-500">Lokasi Virtual</div>
              <div className="text-xl font-bold text-gray-900">
                {status === 'connected' && currentServer ? `${currentServer.city}, ${currentServer.code}` : '-'}
              </div>
            </Card>
          </div>

          {/* Realtime Graph with Ad placement below */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <CardHeader title="Monitor Trafik" description="Analisis throughput jaringan realtime." />
              {status === 'connected' && (
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Lock size={12} className="mr-1" /> AES-256 ENCRYPTED
                </span>
              )}
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={status === 'connected' ? '#10b981' : '#94a3b8'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={status === 'connected' ? '#10b981' : '#94a3b8'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis hide dataKey="name" />
                  <YAxis hide domain={[0, 200]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value} Mbps`, 'Speed']}
                    labelFormatter={() => ''}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="speed" 
                    stroke={status === 'connected' ? '#10b981' : '#94a3b8'} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorSpeed)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Small Ad inside the card if NOT VIP */}
            {!user.isVip && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 mb-1">Iklan</p>
                <div className="bg-gray-100 rounded h-16 flex items-center justify-center text-gray-400 text-xs">
                  Banner Iklan 600x60
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* BLUETOOTH GLOBAL MESH - MOVED UP HERE FOR VISIBILITY */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-200">
                <Bluetooth size={20} className="fill-current" />
              </div>
              Global Bluetooth Mesh
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">NEW FEATURE</span>
            </h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Terhubung ke internet tanpa kuota menggunakan jaringan mesh Bluetooth global. Berbagi koneksi dengan perangkat terdekat di seluruh dunia.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <Button 
               onClick={handleToggleBluetooth}
               className={`h-12 px-6 rounded-full font-bold shadow-lg transition-all ${
                 btStatus === 'active' 
                   ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 ring-2 ring-blue-100' 
                   : btStatus === 'scanning'
                     ? 'bg-blue-50 text-blue-600 animate-pulse ring-2 ring-blue-200'
                     : 'bg-white border-2 border-blue-100 text-blue-600 hover:bg-blue-50'
               }`}
             >
               {btStatus === 'active' ? 'Nonaktifkan Bluetooth' : btStatus === 'scanning' ? 'Memindai...' : 'Aktifkan Mesh'}
             </Button>
          </div>
        </div>

        {/* Scanning UI / Device List */}
        {(btStatus === 'scanning' || btStatus === 'active') && (
          <div className="mt-4 pt-4 border-t border-blue-100">
            {btStatus === 'scanning' ? (
              <div className="flex flex-col items-center justify-center py-8 text-blue-500 bg-blue-50/50 rounded-xl">
                <div className="relative mb-4">
                  <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20 duration-1000"></span>
                  <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20 duration-1000 delay-300"></span>
                  <div className="bg-white p-3 rounded-full shadow-sm relative z-10">
                     <Bluetooth size={32} className="text-blue-500" />
                  </div>
                </div>
                <p className="text-sm font-bold animate-pulse text-blue-700">Mencari Node Bluetooth Global...</p>
                <p className="text-xs text-blue-400 mt-1">Scanning 2.4GHz Frequency</p>
              </div>
            ) : (
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 px-3 uppercase tracking-wider">
                    <span>Perangkat Ditemukan</span>
                    <span>Kekuatan Sinyal</span>
                 </div>
                 {btDevices.map((dev) => (
                   <div key={dev.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-4">
                       <div className="bg-blue-50 p-2.5 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         {dev.id === 4 ? <Radio size={18} /> : <Smartphone size={18} />}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-gray-800">{dev.name}</p>
                         <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                           <Share2 size={10} /> {dev.location}
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="flex flex-col items-end">
                          <div className="flex gap-0.5 items-end h-4 mb-1">
                             <div className={`w-1 rounded-sm ${dev.signal > 20 ? 'bg-blue-500' : 'bg-gray-200'}`} style={{height: '30%'}}></div>
                             <div className={`w-1 rounded-sm ${dev.signal > 40 ? 'bg-blue-500' : 'bg-gray-200'}`} style={{height: '50%'}}></div>
                             <div className={`w-1 rounded-sm ${dev.signal > 60 ? 'bg-blue-500' : 'bg-gray-200'}`} style={{height: '70%'}}></div>
                             <div className={`w-1 rounded-sm ${dev.signal > 80 ? 'bg-blue-500' : 'bg-gray-200'}`} style={{height: '100%'}}></div>
                          </div>
                          <span className="text-[10px] font-mono text-blue-600 font-bold">{dev.signal}%</span>
                       </div>
                       <Button variant="ghost" className="h-8 text-xs px-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg">
                         Connect
                       </Button>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Server List */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <CardHeader title="Lokasi Server Pilihan" description="Pilih lokasi server untuk optimasi rute koneksi." />
          <Button 
            variant="outline" 
            onClick={handleConnectFastest}
            disabled={status !== 'disconnected'}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 w-full sm:w-auto"
          >
            <Zap size={16} className="mr-2 fill-current" />
            Koneksi Tercepat
          </Button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {servers.map((server) => {
            const isActive = activeServerId === server.id;
            const isLocked = server.isVip && !user.isVip;
            
            return (
              <div 
                key={server.id} 
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer ${isActive ? 'bg-red-50 hover:bg-red-50' : ''}`}
                onClick={() => handleServerSelect(server.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive && status === 'connected'
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                      : isActive 
                        ? 'bg-red-500' 
                        : 'bg-gray-300'
                  }`}></div>
                  <div className="bg-slate-100 p-2 rounded-lg relative">
                    <Globe size={20} className="text-slate-600" />
                    {server.isVip && (
                       <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-white">
                         <Crown size={8} className="text-black fill-current" />
                       </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      {server.city}, {server.country}
                      {server.isVip && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">VIP</span>}
                    </h4>
                    <p className="text-xs text-gray-500">Latency: {server.latency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${server.status === 'Optimal' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {server.status}
                  </span>
                  
                  {isLocked ? (
                     <Button 
                       variant="ghost" 
                       className="text-xs py-1 h-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                       onClick={(e) => {
                         e.stopPropagation();
                         onUpgrade();
                       }}
                     >
                       <Lock size={12} className="mr-1" /> Upgrade
                     </Button>
                  ) : (
                    <Button 
                        variant={isActive ? "primary" : "outline"} 
                        className="text-xs py-1 h-8"
                        disabled={status === 'connecting' || status === 'authenticating' || status === 'disconnecting'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServerSelect(server.id);
                        }}
                      >
                      {isActive ? 'Terpilih' : 'Pilih'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Interactive World Map */}
      <Card className="p-0 overflow-hidden bg-slate-900 border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Map size={20} className="text-red-500" />
            Peta Jaringan Global
          </h3>
          <p className="text-slate-400 text-sm mt-1">Distribusi node server di wilayah Asia-Pasifik.</p>
        </div>
        
        <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] bg-[#0f172a]">
          {/* Simple SVG World Map (Simplified Paths) */}
          <svg
            viewBox="0 0 1000 450"
            className="w-full h-full opacity-30 pointer-events-none"
            fill="#334155"
          >
             {/* Simplified World/Asia-Pacific Landmasses */}
             <path d="M720,200 L730,190 L750,210 L740,240 Z" /> 
             <rect x="0" y="0" width="1000" height="450" fill="transparent" />
             <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#grid)" />
             
             <path d="M680,180 Q720,180 750,220 T780,280 T750,320 Q700,340 650,300 T680,180" fill="#1e293b" stroke="#334155" strokeWidth="2" /> 
             <path d="M600,150 Q640,180 680,200 T720,220" fill="none" stroke="#334155" strokeWidth="2" /> 
             <circle cx="720" cy="220" r="80" fill="#1e293b" opacity="0.5" />
          </svg>

          {/* Render Server Markers */}
          {servers.map((server) => {
            const isActive = activeServerId === server.id;
            const isLocked = server.isVip && !user.isVip;
            const isConnected = status === 'connected';

            return (
              <button
                key={server.id}
                onClick={() => handleServerSelect(server.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${server.x}%`, top: `${server.y}%` }}
              >
                {/* Ping Effect for Active Server */}
                {isActive && (
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'animate-ping' : ''} ${
                    isConnected ? 'bg-emerald-500' : 'bg-red-500'
                  }`} style={{ transform: 'scale(2.5)', animationDuration: '1.5s' }}></span>
                )}

                {/* Subtle Pulse for Inactive Servers when connected */}
                {!isActive && isConnected && !isLocked && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-pulse" style={{ transform: 'scale(1.8)' }}></span>
                )}
                
                {/* Marker Dot */}
                <div className={`relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isActive 
                    ? (isConnected ? 'bg-emerald-500 border-emerald-300 scale-125' : 'bg-red-600 border-red-400 scale-125')
                    : isLocked 
                      ? 'bg-slate-800 border-yellow-500' 
                      : isConnected
                        ? 'bg-slate-800 border-emerald-500/30' // Subtle green tint border when connected
                        : 'bg-slate-700 border-slate-500 group-hover:bg-slate-600'
                }`}>
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  {isLocked && !isActive && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>}
                </div>

                {/* Tooltip Label */}
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-opacity flex items-center gap-1 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {server.city}
                  {isLocked && <Lock size={10} className="text-yellow-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
