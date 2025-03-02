import React from 'react';

export interface OktoProviderProps {
  children: React.ReactNode;
}

export const OktoProvider: React.FC<OktoProviderProps> = ({ children }) => {
  return (
    <div>
      {/* Okto provider implementation would go here */}
      {children}
    </div>
  );
}; 