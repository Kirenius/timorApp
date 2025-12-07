import { User } from './types';

export const APP_CONFIG = {
  name: 'Timor App',
  ownerEmail: 'kirenius.kollo@timorapp.com',
  url: 'https://timorapp.com/join',
  pricing: {
    personal: '$5.00/bln',
    enterprise: '$49.99/bln'
  }
};

export const INITIAL_USER_CONFIG: User = {
  id: 'u-001',
  name: 'Kirenius Kollo',
  email: APP_CONFIG.ownerEmail,
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  isVip: true,
};