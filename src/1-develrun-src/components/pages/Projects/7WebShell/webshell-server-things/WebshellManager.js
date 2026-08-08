


import { Server as socketIo } from "socket.io";
import rateLimit from "express-rate-limit";

import { SecurityManager } from "./SecurityManager.js";
import { AuthManager } from "./AuthManager.js";
import { SessionManager } from "./SessionManager.js";
import { CommandExecutor } from "./CommandExecution.js";

export class WebShellManager {
  constructor(app, server, config = {}) {
    this.app = app;
    this.server = server;

    this.config = {
      cors: config.cors,
      socketConfig: config.socketConfig || {
        allowEIO3: true,
        transports: ['websocket', 'polling']
      },
      ...config
    };


    this.security = new SecurityManager(config.security);
    this.auth = new AuthManager(config.auth);
    this.sessions = new SessionManager(config.sessions);
    this.executor = new CommandExecutor(config.executor);


    this.io = new socketIo(server, {
      cors: {
        origin: [
        process.env.VITE_FRONTEND_BASE_URL,
        process.env.VITE_SERVER_URL,
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/0\.0\.0\.0(:\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
        /\.onrender\.com$/,
        /^https?:\/\/devel\.run(:\d+)?$/],

        credentials: true,
        methods: ["GET", "POST"]
      },
      ...this.config.socketConfig
    });

    console.log('[WEBSHELL] WebShell Manager initialized');
  }





  initialize() {
    this.setupMiddlewares();
    this.setupSocketHandlers();
    this.setupRoutes();

    console.log('[WEBSHELL] WebShell Manager ready');
  }






  setupMiddlewares() {
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });


    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too Many Attempts. Bye!',
      standardHeaders: true,
      legacyHeaders: false
    });

    this.app.use('/auth', authLimiter);
  }





  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      const clientIP = this.security.getClientIP(socket);
      console.log(`[WEBSHELL] New connection: ${socket.id} - IP: ${clientIP}`);


      const session = this.sessions.createSession(socket.id, clientIP);


      this.setupSocketMiddleware(socket, clientIP);


      this.setupAuthHandler(socket, session, clientIP);
      this.setupCommandHandler(socket, session, clientIP);
      this.setupInputHandler(socket, session, clientIP);
      this.setupCancelHandler(socket, session);
      this.setupDisconnectHandler(socket, session);
    });
  }


  setupSocketMiddleware(socket, clientIP) {

    socket.onAny((eventName, ...args) => {

      if (!this.security.validateEventName(eventName)) {
        console.log(`[SECURITY] Blocked unauthorized event: ${eventName} from ${clientIP}`);
        socket.disconnect(true);
        return;
      }
    });
  }

  setupAuthHandler(socket, session, clientIP) {
    socket.on('authenticate', async (data) => {
      console.log('[WEBSHELL] Authentication attempt from:', clientIP);


      if (!this.auth.validateAuthData(data)) {
        console.log(`[SECURITY] Invalid authenticate data from ${clientIP}`);
        socket.disconnect(true);
        return;
      }

      const { password } = data;


      if (this.security.isIPLocked(clientIP)) {
        const lockoutInfo = this.security.getLockoutInfo(clientIP);

        socket.emit('auth_failed', {
          error: 'Too many failed attempts. Your session is now blocked.',
          lockout: true,
          remainingTime: lockoutInfo.remainingTime
        });

        console.log(`[SECURITY] Blocked lockout IP attempt: ${clientIP}`);
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

        if (remainingAttempts <= 0) {
          const lockoutInfo = this.security.getLockoutInfo(clientIP);

          socket.emit('auth_failed', {
            error: 'Too many attempts!',
            lockout: true,
            attempts: record.attempts,
            remainingTime: lockoutInfo.remainingTime
          });
        } else {
          socket.emit('auth_failed', {
            error: `Wrong credentials! - Remaining attempts: ${remainingAttempts}`,
            lockout: false,
            attempts: record.attempts,
            remainingAttempts: remainingAttempts
          });
        }

        console.log(`[WEBSHELL] Authentication failed: ${socket.id} (IP: ${clientIP})`);
      }
    });
  }

  setupCommandHandler(socket, session, clientIP) {

    socket.on('execute_command', async (data) => {


      if (!this.security.validateData(data, ['command'])) {

        console.log(`[SECURITY] Invalid execute_command data from ${clientIP}`);
        socket.disconnect(true);

        return;
      }

      const { command } = data;


      if (!command || command.length > 500) {

        console.log(`[SECURITY] Command validation failed from ${clientIP}`);
        socket.emit('command_error', { error: 'Invalid command format' });

        return;
      }


      const sessionValidation = this.sessions.validateSession(socket.id, this.auth);
      const hasAuthSession = sessionValidation.valid && sessionValidation.session?.authenticated;

      const rateLimitCheck = this.security.checkSocketRateLimit(clientIP, hasAuthSession);

      if (!rateLimitCheck.allowed) {
        if (rateLimitCheck.shouldDisconnect) {
          console.log(`[SECURITY] Disconnecting ${socket.id} due to rate limit`);
          socket.disconnect(true);
          return;
        }

        socket.emit('command_error', {
          error: `Rate limit exceeded. Try again in ${rateLimitCheck.remaining} seconds.`
        });
        return;
      }


      let workingSession = session;

      if (!hasAuthSession) {

        if (!this.security.isCommandSafe(command, false, this.executor.config.guestCommands)) {
          console.log(`[SECURITY] Unauthorized command attempt from ${clientIP}: ${command.substring(0, 50)}`);
          socket.emit('command_error', { error: 'Authentication required for this command' });
          return;
        }
      } else {
        workingSession = sessionValidation.session;


        if (workingSession.jwtToken) {
          const tokenPayload = this.auth.verifyJWT(workingSession.jwtToken);
          if (!tokenPayload || !this.auth.validateTokenMatch(tokenPayload, socket.id, clientIP)) {
            console.log(`[SECURITY] JWT validation failed from ${clientIP}`);
            this.sessions.deleteSession(socket.id);
            socket.emit('auth_failed', { error: 'Session expired or invalid' });
            socket.disconnect(true);
            return;
          }
        }
      }

      console.log(`[WEBSHELL] Executing command: "${command}" from ${socket.id} (Auth: ${hasAuthSession})`);


      if (await this.handleSpecialCommands(command, workingSession, socket, clientIP, hasAuthSession)) {
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

  setupInputHandler(socket, session, clientIP) {
    socket.on('command_input', (data) => {
      if (!this.security.validateData(data, ['input'])) {
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

  setupCancelHandler(socket, session) {
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

  setupDisconnectHandler(socket, session) {
    socket.on('disconnect', () => {
      console.log(`[WEBSHELL] Disconnection: ${socket.id}`);
      this.sessions.deleteSession(socket.id);
    });
  }





  async handleSpecialCommands(command, session, socket, clientIP, isAuthenticated) {
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





  setupRoutes() {

    this.app.get('/status', this.auth.createJWTMiddleware(), (req, res) => {
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


    this.app.get('/', (req, res) => {
      const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
      const sessionStats = this.sessions.getStats();

      res.json({
        status: 'WebShell Server Running',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        sessions: sessionStats,
        blockedIPs: Array.from(this.security.ipAttempts.keys()).
        filter((ip) => this.security.isIPLocked(ip)).length,
        yourIP: clientIP
      });
    });
  }





  getStats() {
    return {
      sessions: this.sessions.getStats(),
      blockedIPs: Array.from(this.security.ipAttempts.keys()).
      filter((ip) => this.security.isIPLocked(ip)).length
    };
  }
}