



export class SecurityManager {
  constructor(config = {}) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      lockoutTime: config.lockoutTime || 300000,
      cleanupInterval: config.cleanupInterval || 600000,
      socketRateLimit: {
        guest: {
          maxRequests: 3,
          windowMs: 1000,
          blockDuration: 3600000000
        },
        authenticated: {
          maxRequests: 20,
          windowMs: 1000,
          blockDuration: 0
        }
      }
    };

    this.ipAttempts = new Map();
    this.socketRateLimit = new Map();

    this.startCleanupInterval();
  }





  getClientIP(socket) {
    return socket.handshake.headers['x-forwarded-for']?.split(',')[0] ||
    socket.handshake.headers['x-real-ip'] ||
    socket.handshake.address ||
    socket.conn.remoteAddress;
  }

  isIPLocked(ip) {
    const record = this.ipAttempts.get(ip);
    if (!record) return false;

    const now = Date.now();

    if (record.lockTime && now > record.lockTime) {
      this.ipAttempts.delete(ip);
      return false;
    }

    return record.attempts >= this.config.maxAttempts;
  }

  recordFailedAttempt(ip) {
    const now = Date.now();
    const record = this.ipAttempts.get(ip) || {
      attempts: 0,
      lockTime: null,
      firstAttempt: now
    };

    record.attempts++;

    if (record.attempts >= this.config.maxAttempts) {
      record.lockTime = now + this.config.lockoutTime;
      console.log(`[SECURITY] IP LOCKDOWN: ${ip} (${record.attempts} attempts)`);
    }

    this.ipAttempts.set(ip, record);
    return record;
  }

  clearIPRecord(ip) {
    this.ipAttempts.delete(ip);
  }

  getRemainingAttempts(ip) {
    const record = this.ipAttempts.get(ip);
    if (!record) return this.config.maxAttempts;

    return Math.max(0, this.config.maxAttempts - record.attempts);
  }

  getLockoutInfo(ip) {
    const record = this.ipAttempts.get(ip);
    if (!record || !record.lockTime) return null;

    const remainingTime = Math.max(0, record.lockTime - Date.now());

    return {
      locked: remainingTime > 0,
      remainingTime: remainingTime,
      remainingMinutes: Math.ceil(remainingTime / 60000)
    };
  }





  checkSocketRateLimit(ip, isAuthenticated = false) {
    if (isAuthenticated) {
      return { allowed: true, remaining: 999999 };
    }

    const config = this.config.socketRateLimit.guest;
    const now = Date.now();
    const record = this.socketRateLimit.get(ip) || {
      count: 0,
      resetTime: now + config.windowMs,
      blocked: false
    };

    if (record.blocked && now < record.blockUntil) {
      return {
        allowed: false,
        remaining: Math.ceil((record.blockUntil - now) / 1000),
        isBlocked: true
      };
    }

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + config.windowMs;
      record.blocked = false;
    }

    record.count++;

    if (record.count > config.maxRequests) {
      record.blocked = true;
      record.blockUntil = now + config.blockDuration;

      this.socketRateLimit.set(ip, record);

      console.log(`[SECURITY ALERT] Socket rate limit exceeded - Possible bot/exploit from ${ip}. Banned.`);

      return {
        allowed: false,
        remaining: 0,
        isBlocked: true,
        shouldDisconnect: true
      };
    }

    this.socketRateLimit.set(ip, record);

    return { allowed: true, remaining: config.maxRequests - record.count };
  }





  isCommandSafe(command, isAuthenticated = false, guestCommands = []) {
    const cmd = command.toLowerCase().trim();

    if (command.length > 200) return false;

    if (!isAuthenticated) {
      const forbiddenCommands = [
      'rm', 'rmdir', 'mv', 'cp', 'dd', 'mkfs', 'mount', 'umount',
      'chmod', 'chown', 'sudo', 'su', 'passwd', 'usermod',
      'kill', 'killall', 'pkill', 'reboot', 'shutdown', 'halt',
      'iptables', 'ufw', 'systemctl', 'service',
      'crontab', 'at', 'ssh', 'scp', 'rsync',
      ':(){ :|:& };:', 'bash', 'sh', 'zsh', '/bin/', '/usr/', '/etc/'];


      const forbiddenPatterns = [
      /\$\(.*\)/, /`.*`/, /&&/, /\|\|/, /;/,
      /\.\.\//, /\/dev\//, /\/proc\//, /\/sys\//,
      />/, /</, /\|/];


      for (const forbidden of forbiddenCommands) {
        if (cmd.startsWith(forbidden)) return false;
      }

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(command)) return false;
      }

      const baseCommand = cmd.split(' ')[0];
      return guestCommands.includes(baseCommand);
    }

    return true;
  }

  sanitizeCommand(command) {
    return command.substring(0, 200);
  }





  startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [ip, record] of this.ipAttempts.entries()) {
        const isExpired = record.lockTime && now > record.lockTime;
        const isTooOld = now - record.firstAttempt > this.config.cleanupInterval;

        if (isExpired || isTooOld) {
          this.ipAttempts.delete(ip);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[SECURITY] Cleaned ${cleaned} expired IP locks`);
      }
    }, this.config.cleanupInterval);
  }





  validateEventName(eventName) {
    const allowedEvents = [
    'authenticate',
    'execute_command',
    'cancel_command',
    'command_input',
    'disconnect'];


    return allowedEvents.includes(eventName);
  }

  validateData(data, requiredFields = []) {
    if (!data || typeof data !== 'object') return false;

    for (const field of requiredFields) {
      if (typeof data[field] !== 'string') return false;
    }

    return true;
  }


}