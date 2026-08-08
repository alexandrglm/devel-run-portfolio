


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthManager {

  constructor(config = {}) {

    this.config = {

      jwtSecret: config.jwtSecret || process.env.JWT_SECRET,
      jwtExpiresIn: config.jwtExpiresIn || '1h',
      jwtIssuer: config.jwtIssuer || 'webshell-server',
      shellPassword: config.shellPassword || process.env.SHELL_HASHWORD

    };

    this.validateConfig();
  }

  validateConfig() {


    if (!this.config.jwtSecret) {

      console.error("[AUTH] FATAL: JWT secret missing (process.env.JWT_SECRET)");
      process.exit(1);

    }

    if (!this.config.shellPassword) {

      console.error("[AUTH] SHELL_HASHWORD is missing or empty. Authentication WILL FAIL.");

    } else {

      console.log("[AUTH] SHELL_HASHWORD length:", this.config.shellPassword.length);

    }
  }





  async validatePassword(password) {

    try {

      if (!password || typeof password !== 'string') {

        console.warn('[AUTH] Missing or invalid incoming password:', typeof password);
        return false;
      }

      const hash = this.config.shellPassword;

      if (!hash || typeof hash !== 'string') {

        console.error('[AUTH] Stored password hash missing or invalid.');
        return false;

      }

      return await bcrypt.compare(password, hash);

    } catch (err) {

      console.error('[AUTH] Password validation error:', err?.message);
      return false;

    }
  }









  generateJWT(socketId, ip) {

    const payload = {
      socketId: socketId,
      ip: ip,
      authenticated: true,
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.config.jwtSecret, {

      expiresIn: this.config.jwtExpiresIn,
      issuer: this.config.jwtIssuer

    });
  }


  verifyJWT(token) {

    try {

      console.log('[AUTH] Verifying token:', token);

      return jwt.verify(token, this.config.jwtSecret, {

        issuer: this.config.jwtIssuer

      });


    } catch (error) {

      console.log('[AUTH] Token verification failed:', error.message);
      return null;
    }
  }





  createJWTMiddleware() {

    return (req, res, next) => {

      console.log('[AUTH] JWT Middleware called for:', req.path);

      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {

        console.log('[AUTH] No token provided');
        return res.status(401).json({ error: 'No token provided' });

      }

      const payload = this.verifyJWT(token);

      if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = payload;
      next();
    };
  }







  validateAuthData(data) {

    if (!data || typeof data !== 'object' || typeof data.password !== 'string') {
      return false;
    }

    return true;
  }


  validateTokenMatch(tokenPayload, socketId, clientIP) {

    if (!tokenPayload) return false;

    return tokenPayload.socketId === socketId && tokenPayload.ip === clientIP;
  }
}