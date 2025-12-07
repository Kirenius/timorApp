import React from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { AdBanner } from '../components/ui/AdBanner';
import { User } from '../types';

interface DashboardProps {
  user?: User; // Optional to keep backward compatibility if needed, but we'll pass it
}

const data = [
  { name: 'Sen', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Sel', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Rab', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Kam', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Jum', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Sab', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Min', uv: 3490, pv: 4300, amt: 2100 },
];

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <Card className="flex items-center p-6 transition-all hover:shadow-md">
    <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
      <span className="text-xs font-medium text-green-600 flex items-center mt-1">
        <TrendingUp size={12} className="mr-1" /> {trend}
      </span>
    </div>
  </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Ringkasan aktivitas dan performa sistem hari ini.</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-gray-600">
             Last 7 Days
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value="12,453" 
          trend="+12.5% dari minggu lalu" 
          icon={Users} 
          color="bg-blue-600 text-blue-600"
        />
        <StatCard 
          title="Pendapatan" 
          value="Rp 45.2M" 
          trend="+8.2% dari minggu lalu" 
          icon={DollarSign} 
          color="bg-green-600 text-green-600"
        />
        <StatCard 
          title="Aktivitas" 
          value="1,204" 
          trend="+3.1% dari jam lalu" 
          icon={Activity} 
          color="bg-purple-600 text-purple-600"
        />
      </div>

      {/* ADVERTISEMENT AREA (Visible only if NOT VIP) */}
      {user && !user.isVip && (
        <AdBanner />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Analisis Trafik" description="Data pengunjung unik harian." />
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="uv" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Side Chart */}
        <Card>
          <CardHeader title="Perangkat" description="Penggunaan berdasarkan device." />
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mobile', val: 65 },
                { name: 'Desktop', val: 25 },
                { name: 'Tablet', val: 10 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="val" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};