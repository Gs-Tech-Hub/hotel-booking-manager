'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type CurrencyCode = 'USD' | 'NGN' | 'EUR';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('NGN');

  useEffect(() => {
    const storedCurrency = localStorage.getItem('currency') as CurrencyCode | null;
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = (currency: CurrencyCode) => {
    setCurrencyState(currency);
    localStorage.setItem('currency', currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
