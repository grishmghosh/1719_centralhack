import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QRScannerContextType {
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;
  isMedicalSharingOpen: boolean;
  setIsMedicalSharingOpen: (open: boolean) => void;
}

const QRScannerContext = createContext<QRScannerContextType | undefined>(undefined);

export const useQRScanner = () => {
  const context = useContext(QRScannerContext);
  if (!context) {
    throw new Error('useQRScanner must be used within a QRScannerProvider');
  }
  return context;
};

interface QRScannerProviderProps {
  children: ReactNode;
}

export const QRScannerProvider: React.FC<QRScannerProviderProps> = ({ children }) => {
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isMedicalSharingOpen, setIsMedicalSharingOpen] = useState(false);

  return (
    <QRScannerContext.Provider value={{ 
      isQRScannerOpen, 
      setIsQRScannerOpen, 
      isMedicalSharingOpen, 
      setIsMedicalSharingOpen 
    }}>
      {children}
    </QRScannerContext.Provider>
  );
};