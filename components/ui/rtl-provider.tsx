'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

interface RTLContextType {
  direction: 'rtl' | 'ltr';
  isRTL: boolean;
  locale: string;
}

const RTLContext = createContext<RTLContextType>({
  direction: 'rtl',
  isRTL: true,
  locale: 'fa',
});

interface RTLProviderProps {
  children: ReactNode;
  locale?: string;
}

export function RTLProvider({ children, locale = 'fa' }: RTLProviderProps) {
  const isRTL = locale === 'fa' || locale === 'ar';
  
  useEffect(() => {
    // Set document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    
    // Add RTL class to body for additional styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Add Persian number support class
    if (locale === 'fa') {
      document.body.classList.add('persian-numbers');
    }
  }, [isRTL, locale]);

  return (
    <RTLContext.Provider 
      value={{ 
        direction: isRTL ? 'rtl' : 'ltr', 
        isRTL, 
        locale 
      }}
    >
      {children}
    </RTLContext.Provider>
  );
}

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
};

// Hook for getting RTL-aware styles
export const useRTLStyles = () => {
  const { isRTL } = useRTL();
  
  return {
    textAlign: isRTL ? 'right' as const : 'left' as const,
    float: {
      left: isRTL ? 'right' as const : 'left' as const,
      right: isRTL ? 'left' as const : 'right' as const,
    },
    margin: {
      left: (value: string) => isRTL ? { marginRight: value } : { marginLeft: value },
      right: (value: string) => isRTL ? { marginLeft: value } : { marginRight: value },
    },
    padding: {
      left: (value: string) => isRTL ? { paddingRight: value } : { paddingLeft: value },
      right: (value: string) => isRTL ? { paddingLeft: value } : { paddingRight: value },
    },
    border: {
      left: (value: string) => isRTL ? { borderRight: value } : { borderLeft: value },
      right: (value: string) => isRTL ? { borderLeft: value } : { borderRight: value },
    },
  };
};
