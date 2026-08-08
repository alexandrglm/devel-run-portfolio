



export class ShellSession {

  constructor(socketId, ip) {

    this.socketId = socketId;
    this.ip = ip;
    this.authenticated = false;
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    this.commandCount = 0;
    this.currentDirectory = process.cwd();
    this.jwtToken = null;
    this.currentProcess = null;
    this.isPtyMode = false;

  }

  updateActivity() {

    this.lastActivity = Date.now();

  }


  isExpired(timeout = 3600000) {

    return Date.now() - this.lastActivity > timeout;
  }


  incrementCommands() {

    this.commandCount++;
    this.updateActivity();
  }



  setAuthenticated(token) {

    this.authenticated = true;
    this.jwtToken = token;
    this.updateActivity();
  }

  logout() {

    this.authenticated = false;
    this.jwtToken = null;
    this.currentProcess = null;
    this.isPtyMode = false;
  }
}



export class SessionManager {

  constructor(config = {}) {

    this.config = {
      sessionTimeout: config.sessionTimeout || 3600000,
      cleanupInterval: config.cleanupInterval || 300000
    };

    this.sessions = new Map();
    this.startCleanupInterval();
  }






  createSession(socketId, ip) {

    const session = new ShellSession(socketId, ip);

    this.sessions.set(socketId, session);

    console.log(`[SESSION] Created session: ${socketId} (IP: ${ip})`);
    return session;

  }

  getSession(socketId) {

    return this.sessions.get(socketId);

  }

  deleteSession(socketId) {

    const session = this.sessions.get(socketId);

    if (session) {

      if (session.currentProcess) {


        try {
          session.currentProcess.kill('SIGTERM');

        } catch (error) {
          console.error('[SESSION] Error killing process:', error.message);
        }
      }

      this.sessions.delete(socketId);
      console.log(`[SESSION] Deleted session: ${socketId}`);
    }
  }

  authenticateSession(socketId, token) {

    const session = this.sessions.get(socketId);

    if (session) {
      session.setAuthenticated(token);
      console.log(`[SESSION] Authenticated session: ${socketId}`);
    }
  }





  validateSession(socketId, authManager) {
    const session = this.sessions.get(socketId);
    if (!session) return { valid: false, reason: 'No session found' };


    if (session.authenticated && session.isExpired(this.config.sessionTimeout)) {

      session.logout();

      return { valid: false, reason: 'Session expired' };

    }


    if (session.authenticated && session.jwtToken) {

      const tokenPayload = authManager.verifyJWT(session.jwtToken);

      if (!tokenPayload) {
        session.logout();
        return { valid: false, reason: 'Invalid token' };
      }


      if (!authManager.validateTokenMatch(tokenPayload, socketId, session.ip)) {

        session.logout();
        return { valid: false, reason: 'Token mismatch' };

      }
    }

    return { valid: true, session };
  }






  setSessionProcess(socketId, process, isPty = false) {

    const session = this.sessions.get(socketId);

    if (session) {
      session.currentProcess = process;
      session.isPtyMode = isPty;
      session.updateActivity();
    }
  }

  clearSessionProcess(socketId) {

    const session = this.sessions.get(socketId);

    if (session) {
      session.currentProcess = null;
      session.isPtyMode = false;
      session.updateActivity();
    }
  }

  cancelSessionProcess(socketId) {

    const session = this.sessions.get(socketId);

    if (session && session.currentProcess) {

      try {

        session.currentProcess.kill('SIGTERM');
        console.log(`[SESSION] Canceled process for session: ${socketId}`);
        return true;


      } catch (error) {

        console.error(`[SESSION] Error canceling process: ${error.message}`);
        return false;
      }
    }

    return false;
  }






  updateDirectory(socketId, newDirectory) {

    const session = this.sessions.get(socketId);

    if (session) {

      session.currentDirectory = newDirectory;
      session.updateActivity();
    }
  }






  getSessionInfo(socketId) {

    const session = this.sessions.get(socketId);

    if (!session) return null;


    return {

      socketId: session.socketId,
      ip: session.ip,
      authenticated: session.authenticated,
      startTime: new Date(session.startTime).toLocaleString(),
      lastActivity: new Date(session.lastActivity).toLocaleString(),
      commandCount: session.commandCount,
      currentDirectory: session.currentDirectory,
      hasActiveProcess: !!session.currentProcess,
      isPtyMode: session.isPtyMode
    };
  }





  startCleanupInterval() {

    setInterval(() => {

      let cleaned = 0;

      for (const [socketId, session] of this.sessions.entries()) {

        if (session.isExpired(this.config.sessionTimeout)) {

          this.deleteSession(socketId);
          cleaned++;
        }
      }

      if (cleaned > 0) {

        console.log(`[SESSION] Cleaned ${cleaned} expired sessions`);

      }
    }, this.config.cleanupInterval);
  }






  getStats() {

    const totalSessions = this.sessions.size;

    const authenticatedSessions = Array.from(this.sessions.values()).
    filter((session) => session.authenticated).length;
    const activeSessions = Array.from(this.sessions.values()).
    filter((session) => !!session.currentProcess).length;

    return {

      total: totalSessions,
      authenticated: authenticatedSessions,
      active: activeSessions

    };
  }
}