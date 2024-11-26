'use client'

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CountryContextType {
    country: string;
    setCountry: (country: string) => void;
    isInChina: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider = ({
    children,
    initialCountry,
}: {
    children: ReactNode;
    initialCountry: string;
}) => {
    const [country, setCountry] = useState<string>(initialCountry);

    const isInChina = useMemo(() => country === 'CN', [country])
    return (
        <CountryContext.Provider value={{ country, setCountry, isInChina }}>
            {children}
        </CountryContext.Provider>
    );
};

export const useCountry = () => {
    const context = useContext(CountryContext);
    if (!context) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
};
