import { useState, useCallback } from 'react';

const AUTH_CONFIG = {
  maxAttempts: 3,
  lockoutTime: 9999999999999999999999999999999999
};

export const useAuth = (socket, onAuthSuccess = null) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const authenticate = useCallback(async (password) => {
    if (!socket || !password.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    const handleAuthSuccess = (data) => {
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      setAttempts(0);
      setAuthError(null);

      if (onAuthSuccess) onAuthSuccess();
      socket.off('auth_success', handleAuthSuccess);
      socket.off('auth_failed', handleAuthFailed);
    };

    const handleAuthFailed = (data) => {
      if (data.lockout) {
        setIsLockedOut(true);
        setAuthError(data.error);
      } else {
        setAuthError(data.error);
        setAttempts(prev => prev + 1);
      }

      setIsAuthenticating(false);
      socket.off('auth_success', handleAuthSuccess);
      socket.off('auth_failed', handleAuthFailed);
    };

    socket.on('auth_success', handleAuthSuccess);
    socket.on('auth_failed', handleAuthFailed);
    socket.emit('authenticate', { password });
  }, [socket, onAuthSuccess]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAuthError(null);
    setAttempts(0);
    setIsLockedOut(false);
  }, []);

  return {
    isAuthenticated,
    isAuthenticating,
    authError,
    attempts,
    isLockedOut,
    authenticate,
    logout,
    remainingAttempts: AUTH_CONFIG.maxAttempts - attempts
  };
};