


import cors from "cors";
import rateLimit from "express-rate-limit";
import { Server as SocketIO } from "socket.io";


import { SecurityManager } from './webshell/SecurityManager.js';
import { AuthManager } from './webshell/AuthManager.js';
import { SessionManager } from './webshell/SessionManager.js';
import { CommandExecutor } from './webshell/CommandExecution.js';









export class WebShellServer {









  constructor(app, server, options = {}) {

    this.app = app;
    this.server = server;
    this.options = options;


    this.config = this._buildConfiguration();


    this.security = null;
    this.auth = null;
    this.sessions = null;
    this.executor = null;
    this.io = null;


    console.log('[WEBSHELL] WebShell Server instance created');

  }










  _buildConfiguration() {

    return {
      cors: {
        origin: [
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/0\.0\.0\.0(:\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
        process.env.WEBSHELL_CORS_1 || '',
        /\.onrender\.com$/],

        methods: ['GET', 'POST'],
        credentials: true
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET,
        shellPassword: process.env.SHELL_HASHWORD,
        jwtExpiresIn: '1h',
        jwtIssuer: 'webshell-server'
      },
      security: {
        maxAttempts: 3,
        lockoutTime: 300000,
        cleanupInterval: 600000,
        socketRateLimit: {
          guest: {
            maxRequests: 3,
            windowMs: 1000,
            blockDuration: 9999999999999999999999999999999999
          },
          authenticated: {
            maxRequests: 20,
            windowMs: 1000,
            blockDuration: 0
          }
        }
      },
      sessions: {
        sessionTimeout: 3600000,
        cleanupInterval: 300000
      },
      executor: {
        maxCommandLength: 200,
        commandTimeout: 30000,
        guestCommands: [
        'ls', 'pwd', 'whoami', 'date', 'uptime',
        'help', 'clear', 'echo', 'session']

      },
      server: {
        port: process.env.WEBSHELL_SERVER_PORT || 3001,
        host: process.env.WEBSHELL_SERVER_HOST || '0.0.0.0'
      }
    };
  }







  async initialise() {
    try {
      console.log('[WEBSHELL] Initialising WebShell server...');

      this._initialiseManagers();
      this._setupMiddlewares();
      this._initialiseSocketIO();
      this._setupSocketHandlers();
      this._setupHTTPRoutes();

      console.log('[WEBSHELL] WebShell server initialised successfully');


    } catch (error) {

      console.error('[WEBSHELL] Failed to initialise WebShell server:', error.message);
      throw error;
    }
  }








  _initialiseManagers() {

    console.log('[WEBSHELL] Initialising managers...');

    this.security = new SecurityManager(this.config.security);
    this.auth = new AuthManager(this.config.auth);
    this.sessions = new SessionManager(this.config.sessions);
    this.executor = new CommandExecutor(this.config.executor);

    console.log('[WEBSHELL] All managers initialised');

  }








  _setupMiddlewares() {

    console.log('[WEBSHELL] Setting up middlewares...');


    this.app.use(cors(this.config.cors));


    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too Many Attempts. Bye!',
      standardHeaders: true,
      legacyHeaders: false
    });

    this.app.use('/auth', authLimiter);

    console.log('[WEBSHELL] Middlewares configured');
  }






  _initialiseSocketIO() {

    console.log('[WEBSHELL] Initialising Socket.IO...');

    this.io = new SocketIO(this.server, {
      cors: this.config.cors,
      allowEIO3: true,
      transports: ['websocket', 'polling']
    });

    console.log('[WEBSHELL] Socket.IO initialised');
  }







  _setupSocketHandlers() {

    console.log('[WEBSHELL] Setting up Socket.IO handlers...');

    this.io.on('connection', (socket) => {

      const clientIP = this._getClientIP(socket);
      console.log(`[WEBSHELL] Client connected: ${socket.id} from ${clientIP}`);



      const session = this.sessions.createSession(socket.id, clientIP);


      this._handleAuthentication(socket, session, clientIP);
      this._handleCommandExecution(socket, session, clientIP);
      this._handleCommandInput(socket, session, clientIP);
      this._handleCommandCancel(socket, session);
      this._handleDisconnection(socket, session);
    });

    console.log('[WEBSHELL] Socket.IO handlers configured');
  }











  _getClientIP(socket) {
    return socket.handshake.headers['x-forwarded-for']?.split(',')[0] ||
    socket.handshake.headers['x-real-ip'] ||
    socket.handshake.address ||
    socket.conn.remoteAddress;
  }









  _handleAuthentication(socket, session, clientIP) {

    socket.on('authenticate', async (data) => {

      console.log('[WEBSHELL] Authentication attempt from:', clientIP);


      if (!data || typeof data.password !== 'string') {

        console.log(`[SECURITY] Invalid authenticate data from ${clientIP}`);
        socket.disconnect(true);

        return;
      }


      const { password } = data;



      if (this.security.isIPLocked(clientIP)) {

        const lockoutInfo = this.security.getLockoutInfo(clientIP);

        socket.emit('auth_failed', {
          error: 'Too many failed attempts. Session is now blocked.',
          lockout: true,
          remainingTime: lockoutInfo.remainingTime
        });
        return;
      }



      const isValidPassword = await this.auth.validatePassword(password);

      if (isValidPassword) {


        const token = this.auth.generateJWT(socket.id, clientIP);

        this.sessions.authenticateSession(socket.id, token);
        this.security.clearIPRecord(clientIP);

        socket.emit('auth_success', {
          message: 'Authorised access OK',
          user: 'webshell-user',
          server: `WebShell v0.1 (IP: ${clientIP})`,
          timestamp: new Date().toISOString(),
          token: token
        });


        console.log(`[WEBSHELL] Authentication success: ${socket.id} (IP: ${clientIP})`);


      } else {




        const record = this.security.recordFailedAttempt(clientIP);
        const remainingAttempts = this.security.getRemainingAttempts(clientIP);

        socket.emit('auth_failed', {
          error: `Wrong credentials! - Remaining attempts: ${remainingAttempts}`,
          lockout: false,
          remainingAttempts: remainingAttempts
        });


        console.log(`[WEBSHELL] Authentication failed: ${socket.id} (IP: ${clientIP})`);
      }
    });
  }












  _handleCommandExecution(socket, session, clientIP) {


    socket.on('execute_command', async (data) => {

      if (!data || typeof data.command !== 'string') {
        console.log(`[SECURITY] Invalid execute_command data from ${clientIP}`);
        socket.disconnect(true);
        return;
      }

      const { command } = data;



      const sessionValidation = this.sessions.validateSession(socket.id, this.auth);
      const hasAuthSession = sessionValidation.valid && sessionValidation.session?.authenticated;


      const rateLimitCheck = this.security.checkSocketRateLimit(clientIP, hasAuthSession);

      if (!rateLimitCheck.allowed) {

        socket.emit('command_error', {
          error: `Rate limit exceeded. Try again in ${rateLimitCheck.remaining} seconds.`
        });

        return;
      }



      let workingSession = session;

      if (!hasAuthSession) {


        if (!this.security.isCommandSafe(command, false, this.config.executor.guestCommands)) {
          console.log(`[SECURITY] Unauthorised command attempt from ${clientIP}: ${command.substring(0, 50)}`);
          socket.emit('command_error', { error: 'Authentication required for this command' });
          return;
        }

      } else {

        workingSession = sessionValidation.session;
      }


      console.log(`[WEBSHELL] Executing command: "${command}" from ${socket.id} (Auth: ${hasAuthSession})`);




      if (await this._handleSpecialCommands(command, workingSession, socket, clientIP, hasAuthSession)) {

        return;
      }


      try {

        const result = await this.executor.executeCommand(command, workingSession, socket, hasAuthSession);


        if (result.success) {

          socket.emit('command_output', {
            output: result.output,
            currentDirectory: workingSession.currentDirectory,
            timestamp: new Date().toISOString()
          });

        } else {

          socket.emit('command_error', {
            error: result.error,
            currentDirectory: workingSession.currentDirectory,
            timestamp: new Date().toISOString()
          });

        }


      } catch (error) {

        socket.emit('command_error', {
          error: `Internal error: ${error.message}`,
          timestamp: new Date().toISOString()
        });
      }
    });
  }















  async _handleSpecialCommands(command, session, socket, clientIP, isAuthenticated) {

    const cmd = command.toLowerCase().trim();

    if (cmd === 'help') {

      const helpText = this.executor.generateHelpText(isAuthenticated, clientIP);
      socket.emit('command_output', { output: helpText });

      return true;
    }


    if (cmd === 'session') {

      const sessionInfo = this.sessions.getSessionInfo(session.socketId);
      const ipAttempts = this.security.ipAttempts.get(clientIP)?.attempts || 0;
      const isLocked = this.security.isIPLocked(clientIP);

      const sessionText = this.executor.generateSessionInfo(sessionInfo, ipAttempts, isLocked);

      socket.emit('command_output', { output: sessionText });

      return true;
    }

    return false;
  }











  _handleCommandInput(socket, session, clientIP) {

    socket.on('command_input', (data) => {

      if (!data || typeof data.input !== 'string') {
        console.log(`[SECURITY] Invalid command_input data from ${clientIP}`);
        socket.disconnect(true);

        return;
      }

      const { input } = data;
      const sessionData = this.sessions.getSession(socket.id);

      if (sessionData && sessionData.currentProcess) {

        const success = this.executor.sendInput(sessionData, input);

        if (!success) {

          socket.emit('command_error', {
            error: 'No active process to receive input'
          });
        }

      } else {

        socket.emit('command_error', {
          error: 'No active process to receive input'
        });
      }
    });
  }











  _handleCommandCancel(socket, session) {

    socket.on('cancel_command', () => {

      console.log(`[WEBSHELL] Cancel command request from ${socket.id}`);

      const sessionData = this.sessions.getSession(socket.id);

      if (sessionData) {

        const success = this.executor.cancelCommand(sessionData);

        if (success) {
          socket.emit('command_cancel');
        }
      }
    });
  }








  _handleDisconnection(socket, session) {

    socket.on('disconnect', () => {
      console.log(`[WEBSHELL] Client disconnected: ${socket.id}`);
      this.sessions.deleteSession(socket.id);
    });
  }








  _setupHTTPRoutes() {

    console.log('[WEBSHELL] Setting up HTTP routes...');



    this.app.get('/status', (req, res) => {

      const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
      const sessionStats = this.sessions.getStats();

      res.json({
        server: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        sessions: sessionStats,
        environment: process.env.NODE_ENV || 'development',
        ipLockout: {
          yourIP: clientIP,
          attempts: this.security.ipAttempts.get(clientIP)?.attempts || 0,
          isLocked: this.security.isIPLocked(clientIP),
          remainingAttempts: this.security.getRemainingAttempts(clientIP)
        }
      });
    });


    this.app.post('/auth/validate', async (req, res) => {

      const { password } = req.body;
      const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

      if (this.security.isIPLocked(clientIP)) {

        return res.status(429).json({
          valid: false,
          message: 'IP Lockdown enabled',
          lockout: true
        });
      }


      const isValidPassword = await this.auth.validatePassword(password);


      if (isValidPassword) {

        this.security.clearIPRecord(clientIP);
        res.json({ valid: true, message: 'AUTH OK' });

      } else {

        this.security.recordFailedAttempt(clientIP);

        res.status(401).json({
          valid: false,
          message: 'WRONG PASSWORD',
          remainingAttempts: this.security.getRemainingAttempts(clientIP)
        });
      }
    });

    console.log('[WEBSHELL] HTTP routes configured');
  }








  async start() {


    if (this.options.shouldStart === false) {
      console.log('[WEBSHELL] Skipping server.listen() - managed by multi-host');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

      const { port, host } = this.config.server;

      this.server.listen(port, host, (error) => {

        if (error) {
          console.error('[WEBSHELL] Failed to start server:', error.message);
          reject(error);
          return;
        }

        const stats = this.getStats();

        console.log(`
WebShell Server Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Port: ${port}
Host: ${host}
Setup: ${process.env.NODE_ENV || 'development'}

LOGIN CONFIG:
• Max attempts: 3
• Locktime: 5min
• Cleaning every: 10min

GUEST COMMANDS: ls, pwd, whoami, date, uptime, help, clear

CORS enabled
Active Sessions: ${stats.sessions.total || 0}
Blocked IPs: ${stats.blockedIPs}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                `);

        this._setupErrorHandlers();
        resolve();
      });
    });
  }








  _setupErrorHandlers() {


    process.on('uncaughtException', (error) => {

      console.error('[SERVER ERROR] Uncaught exception:', error.message);
      console.error(error.stack);

    });



    process.on('unhandledRejection', (reason, promise) => {

      console.error('[SERVER ERROR] Unhandled rejection at:', promise, 'reason:', reason);

    });



    process.on('SIGTERM', () => {

      console.log('[SERVER] Received SIGTERM, shutting down gracefully...');

      this.server.close(() => {
        console.log('[SERVER] Server closed successfully');
        process.exit(0);
      });
    });
  }









  getStats() {

    return {

      sessions: this.sessions.getStats(),
      blockedIPs: Array.from(this.security.ipAttempts.keys()).
      filter((ip) => this.security.isIPLocked(ip)).length,
      uptime: process.uptime()
    };
  }







  async shutdown() {

    console.log('[WEBSHELL] Initiating graceful shutdown (WAIT + CTRL+C ONCE!)...');

    return new Promise((resolve) => {

      this.server.close(() => {
        console.log('[WEBSHELL] Server shutdown complete');
        resolve();
      });
    });
  }
}