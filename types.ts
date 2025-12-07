import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isVip: boolean;
  pin?: string;
  antiPhishingCode?: string;
  auditLog?: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  device: string;
  status: 'success' | 'warning';
}

export interface ServerNode {
  id: number;
  country: string;
  code: string;
  city: string;
  latency: string;
  status: 'Optimal' | 'Cepat' | 'Normal';
  x: number; 
  y: number;
  isVip: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit'; // credit = uang masuk, debit = uang keluar
  status: 'completed' | 'pending';
  method?: string;
}

export interface Withdrawal {
  amount: number;
  destination: string;
  method: 'visa' | 'bank';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export type ViewState = 'login' | 'dashboard' | 'profile' | 'internet' | 'wallet' | 'ai';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}