
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
