import React, { useState, useRef } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, MapPin, Camera, Save, ShieldAlert, Laptop, Check } from 'lucide-react';
import { User as UserType } from '../types';
import { APP_CONFIG } from '../constants';

interface ProfileProps {
  user: UserType;
  onToggleRole?: () => void;
  onUpdateProfile?: (updates: Partial<UserType>) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onToggleRole, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: "+60 14 300 2703",
    location: "Malaysia",
    bio: "Founder & CEO Timor App. Pemilik tunggal dan pengelola infrastruktur jaringan global."
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Text Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: formData.name,
        email: formData.email,
        // In a real app, you would also update phone/location/bio in the global state type
      });
    }
    setIsEditing(false);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update user avatar in App state
        onUpdateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // STRICT SECURITY CHECK: Only Owner can see the Switch Button
  const isOwner = user.email === APP_CONFIG.ownerEmail;
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-500">Kelola informasi profil dan keamanan akun anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Avatar Card */}
        <Card className="lg:col-span-1 flex flex-col items-center text-center p-8">
          <div className="relative group cursor-pointer" onClick={triggerFileInput}>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-gray-200"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-center text-white">
                 <Camera className="mb-1" />
                 <span className="text-xs font-medium">Ubah Foto</span>
              </div>
            </div>
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
          <p className={`text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block ${
             user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-red-50 text-red-600'
          }`}>
            {user.role}
          </p>
          
          <div className="w-full mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
              <span>Status</span>
              <span className="text-green-600 font-medium">Aktif</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-b border-gray-100">
              <span>Bergabung</span>
              <span>Jan 2024</span>
            </div>
          </div>

           {/* DEVELOPER MODE SWITCHER - HIDDEN FOR NON-OWNERS */}
           {onToggleRole && isOwner && (
             <div className="mt-8 pt-4 border-t border-gray-100 w-full">
               <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">Owner Controls</p>
               <button 
                 onClick={onToggleRole}
                 className="w-full flex items-center justify-center gap-2 p-2 text-xs border border-dashed border-purple-300 bg-purple-50 rounded hover:bg-purple-100 text-purple-700 transition-colors"
               >
                 <Laptop size={14} />
                 Switch Mode ({user.role === 'Super Admin' ? 'Admin' : 'User'})
               </button>
               <p className="text-[10px] text-gray-400 mt-2 text-center">
                 Hanya terlihat oleh {user.email}
               </p>
             </div>
           )}
        </Card>

        {/* Right Col: Details Form */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <CardHeader title="Informasi Pribadi" />
            <Button 
              variant={isEditing ? 'ghost' : 'outline'} 
              onClick={() => setIsEditing(!isEditing)}
              className="h-9"
            >
              {isEditing ? 'Batal' : 'Ubah Data'}
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-9 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea 
                rows={4}
                name="bio"
                disabled={!isEditing}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};