import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className, title }: CardProps) {
  return (
    <div className={clsx('bg-white rounded-lg shadow p-6', className)}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      {children}
    </div>
  );
}
