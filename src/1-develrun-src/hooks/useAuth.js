import { useState, useCallback } from 'react';
import NodeRSA from 'node-rsa';

const AUTH_CONFIG = {
  maxAttempts: 3,
  lockoutTime: 9999999999999999999999999999999999
};


const RSA_PUBLIC_KEY = import.meta.env.VITE_RSA_PUBLIC_KEY;

let rsaPublicKey;
try {
  if (RSA_PUBLIC_KEY) {
    rsaPublicKey = new NodeRSA(RSA_PUBLIC_KEY);
    rsaPublicKey.setOptions({ encryptionScheme: 'pkcs1' });
    console.log('[useAuth] ✅ RSA public key loaded');
  } else {
    console.warn('[useAuth] ⚠️ VITE_RSA_PUBLIC_KEY not found');
  }
} catch (error) {
  console.error('[useAuth] ❌ Error loading RSA public key:', error.message);
}

export const useAuth = (socket, onAuthSuccess = null) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const authenticate = useCallback(async (password) => {
    if (!socket || !password.trim()) return;

    if (!rsaPublicKey) {
      setAuthError('Error de configuración de seguridad (RSA key missing)');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    let encryptedPassword;
    try {
      encryptedPassword = rsaPublicKey.encrypt(password, 'base64');
      console.log('[useAuth] 🔐 Password encrypted successfully');
    } catch (encryptError) {
      console.error('[useAuth] ❌ RSA encryption error:', encryptError.message);
      setAuthError('Error al cifrar la contraseña');
      setIsAuthenticating(false);
      return;
    }

    const handleAuthSuccess = (data) => {
      console.log('[useAuth] ✅ Auth success:', data);
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      setAttempts(0);
      setAuthError(null);

      if (onAuthSuccess) onAuthSuccess();
      socket.off('auth_success', handleAuthSuccess);
      socket.off('auth_failed', handleAuthFailed);
    };

    const handleAuthFailed = (data) => {
      console.log('[useAuth] ❌ Auth failed:', data);
      if (data.lockout) {
        setIsLockedOut(true);
        setAuthError(data.error);
      } else {
        setAuthError(data.error);
        setAttempts((prev) => prev + 1);
      }

      setIsAuthenticating(false);
      socket.off('auth_success', handleAuthSuccess);
      socket.off('auth_failed', handleAuthFailed);
    };

    socket.on('auth_success', handleAuthSuccess);
    socket.on('auth_failed', handleAuthFailed);
    socket.emit('authenticate', { password: encryptedPassword });
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