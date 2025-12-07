import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
  </div>
);