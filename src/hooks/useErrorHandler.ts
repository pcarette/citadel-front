import { useState, useCallback } from 'react';
import { BaseError } from 'viem';

export interface AppError {
  id: string;
  title: string;
  message: string;
  variant: 'error' | 'warning' | 'info';
  dismissible: boolean;
  autoClose: boolean;
  duration?: number;
}

export interface ErrorHandlerReturn {
  errors: AppError[];
  addError: (error: unknown, context?: string) => void;
  addSuccess: (message: string, title?: string) => void;
  addWarning: (message: string, title?: string) => void;
  addInfo: (message: string, title?: string) => void;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
}

export function useErrorHandler(): ErrorHandlerReturn {
  const [errors, setErrors] = useState<AppError[]>([]);

  const generateId = useCallback(() => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addError = useCallback((error: unknown, context?: string) => {
    const parsedError = parseError(error, context);
    const newError: AppError = {
      id: generateId(),
      ...parsedError,
      variant: 'error',
      dismissible: true,
      autoClose: false,
    };

    setErrors(prev => [...prev, newError]);
  }, [generateId]);

  const addSuccess = useCallback((message: string, title?: string) => {
    const newSuccess: AppError = {
      id: generateId(),
      title: title || 'Success',
      message,
      variant: 'info',
      dismissible: true,
      autoClose: true,
      duration: 5000,
    };

    setErrors(prev => [...prev, newSuccess]);
  }, [generateId]);

  const addWarning = useCallback((message: string, title?: string) => {
    const newWarning: AppError = {
      id: generateId(),
      title: title || 'Warning',
      message,
      variant: 'warning',
      dismissible: true,
      autoClose: false,
    };

    setErrors(prev => [...prev, newWarning]);
  }, [generateId]);

  const addInfo = useCallback((message: string, title?: string) => {
    const newInfo: AppError = {
      id: generateId(),
      title: title || 'Information',
      message,
      variant: 'info',
      dismissible: true,
      autoClose: true,
      duration: 4000,
    };

    setErrors(prev => [...prev, newInfo]);
  }, [generateId]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    addSuccess,
    addWarning,
    addInfo,
    removeError,
    clearAllErrors,
  };
}

function parseError(error: unknown, context?: string): { title: string; message: string } {
  // Handle BaseError (from Viem)
  if (error instanceof BaseError) {
    const baseError = error as BaseError;
    
    // User rejected transaction
    if (baseError.shortMessage?.includes('User rejected') || 
        baseError.message?.includes('User rejected') ||
        baseError.name === 'UserRejectedRequestError') {
      return {
        title: 'Transaction Cancelled',
        message: 'You cancelled the transaction in your wallet.',
      };
    }

    // Insufficient funds
    if (baseError.shortMessage?.includes('insufficient funds') ||
        baseError.message?.includes('insufficient funds')) {
      return {
        title: 'Insufficient Balance',
        message: 'You don\'t have enough tokens or BNB for gas fees.',
      };
    }

    // Contract execution reverted
    if (baseError.shortMessage?.includes('execution reverted') ||
        baseError.message?.includes('execution reverted')) {
      return {
        title: 'Transaction Failed',
        message: 'The smart contract rejected your transaction. Please check the transaction parameters.',
      };
    }

    // Slippage errors
    if (baseError.message?.includes('slippage') ||
        baseError.message?.includes('price impact')) {
      return {
        title: 'Slippage Too High',
        message: 'Price moved too much during your transaction. Try increasing slippage tolerance.',
      };
    }

    // Network errors
    if (baseError.shortMessage?.includes('network') ||
        baseError.message?.includes('network') ||
        baseError.shortMessage?.includes('RPC')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the blockchain. Please check your connection and try again.',
      };
    }

    // Allowance/approval errors
    if (baseError.message?.includes('allowance') ||
        baseError.message?.includes('approve') ||
        baseError.message?.includes('ERC20: insufficient allowance')) {
      return {
        title: 'Approval Required',
        message: 'You need to approve the token for spending first.',
      };
    }

    // Gas estimation errors
    if (baseError.message?.includes('gas') && 
        baseError.message?.includes('estimate')) {
      return {
        title: 'Transaction May Fail',
        message: 'Unable to estimate gas. The transaction might fail or you may need more BNB.',
      };
    }

    // Deadline exceeded
    if (baseError.message?.includes('deadline') ||
        baseError.message?.includes('expired')) {
      return {
        title: 'Transaction Expired',
        message: 'The transaction took too long to confirm and expired.',
      };
    }

    // Use the short message if available, otherwise the full message
    return {
      title: 'Transaction Error',
      message: baseError.shortMessage || baseError.message || 'An unknown blockchain error occurred.',
    };
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return {
      title: context ? `${context} Error` : 'Error',
      message: error.message,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      title: context ? `${context} Error` : 'Error',
      message: error,
    };
  }

  // Handle unknown errors
  return {
    title: 'Unknown Error',
    message: 'An unexpected error occurred. Please try again.',
  };
}