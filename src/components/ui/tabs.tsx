import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface TabsContextType {
    value: string;
    setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className = '', children }) => {
    return (
        <TabsContext.Provider value={{ value, setValue: onValueChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

interface TabsListProps {
    className?: string;
    children: ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
    return <div className={className} role="tablist">{children}</div>;
};

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value: triggerValue, className = '', children }) => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('TabsTrigger must be used within Tabs');
    const { value, setValue } = ctx;
    const isActive = value === triggerValue;

    const handleClick = useCallback(() => {
        setValue(triggerValue);
    }, [setValue, triggerValue]);

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={className + (isActive ? ' data-[state=active]:bg-blue-600' : '')}
            onClick={handleClick}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    className?: string;
    children: ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value: contentValue, className = '', children }) => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('TabsContent must be used within Tabs');
    const { value } = ctx;
    if (value !== contentValue) return null;
    return (
        <div role="tabpanel" className={className}>
            {children}
        </div>
    );
};
