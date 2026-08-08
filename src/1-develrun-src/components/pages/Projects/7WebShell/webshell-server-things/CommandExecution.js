


import { spawn } from 'child_process';
import pty from 'node-pty';
import fs from 'fs';
import path from 'path';

export class CommandExecutor {

  constructor(config = {}) {

    this.config = {

      maxCommandLength: config.maxCommandLength || 200,
      commandTimeout: config.commandTimeout || 30000,
      guestCommands: config.guestCommands || [
      'ls', 'pwd', 'whoami', 'date', 'uptime',
      'help', 'clear', 'echo', 'session']

    };

    this.builtinCommands = ['cd'];
  }





  async executeCommand(command, session, socket, isAuthenticated = false) {

    return new Promise(async (resolve) => {

      const sanitized = this.sanitizeCommand(command);

      if (!this.isCommandValid(sanitized, isAuthenticated)) {

        resolve({
          success: false,
          error: `Command not allowed: ${command.split(' ')[0]}`
        });

        return;
      }


      if (this.isBuiltinCommand(sanitized)) {

        const result = await this.handleBuiltinCommand(sanitized, session);
        session.incrementCommands();
        resolve(result);

        return;
      }


      this.executeSystemCommand(sanitized, session, socket, resolve);

    });
  }






  sanitizeCommand(command) {

    return command.substring(0, this.config.maxCommandLength);

  }

  isCommandValid(command, isAuthenticated) {

    const cmd = command.toLowerCase().trim();

    if (command.length > this.config.maxCommandLength) {

      return false;

    }

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

      return this.config.guestCommands.includes(baseCommand);
    }

    return true;
  }







  isBuiltinCommand(command) {

    const cmd = command.toLowerCase().trim().split(' ')[0];
    return this.builtinCommands.includes(cmd);
  }

  async handleBuiltinCommand(command, session) {

    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'cd') {

      return this.handleCdCommand(args, session);

    }


    return {
      success: false,
      error: `${cmd}: Command not supported in WebShell`
    };
  }

  handleCdCommand(args, session) {

    const targetPath = args[0] || process.env.HOME || '/';

    let newPath;

    if (targetPath.startsWith('/')) {
      newPath = targetPath;
    } else {
      newPath = path.join(session.currentDirectory, targetPath);
    }

    if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
      session.currentDirectory = newPath;
      return {
        success: true,
        output: `Changed directory to: ${newPath}`
      };
    } else {
      return {
        success: false,
        error: `cd: ${targetPath}: No such file or directory`
      };
    }
  }







  executeSystemCommand(command, session, socket, resolve) {

    const hasRedirection = /[>|<&;]/.test(command);
    let cmd, args;

    if (hasRedirection) {

      console.log('[EXEC] Using bash for redirection:', command);
      cmd = 'bash';
      args = ['-c', command];

    } else {
      args = command.split(' ');
      cmd = args.shift();
    }

    const childProcess = spawn(cmd, args, {

      cwd: session.currentDirectory,
      timeout: this.config.commandTimeout,

      env: {
        ...process.env,
        PATH: process.env.PATH,
        USER: 'webshell',
        HOME: '/tmp',
        SHELL: '/bin/bash'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.setupProcessHandlers(childProcess, session, socket, command, resolve);
  }

  setupProcessHandlers(childProcess, session, socket, originalCommand, resolve) {
    let stdout = '';
    let stderr = '';


    childProcess.stdout.on('data', (data) => {

      stdout += data.toString();
      console.log('[EXEC STDOUT]:', data.toString());

      socket.emit('command_stream', {
        type: 'stdout',
        data: data.toString()
      });
    });



    childProcess.stderr.on('data', (data) => {

      stderr += data.toString();
      console.log('[EXEC STDERR]:', data.toString());

      socket.emit('command_stream', {
        type: 'stderr',
        data: data.toString()
      });
    });


    session.currentProcess = childProcess;


    const needsPtyTimeout = setTimeout(() => {
      if (session.currentProcess && !session.currentProcess.killed && stdout === '' && stderr === '') {

        console.log('[EXEC] Command might need PTY, retrying...');

        session.currentProcess.kill('SIGKILL');
        session.currentProcess = null;

        clearTimeout(needsPtyTimeout);
        this.executePtyCommand(originalCommand, session, socket);

        return;
      }
    }, 3000);





    childProcess.on('close', (code) => {
      clearTimeout(needsPtyTimeout);
      clearTimeout(killTimeout);

      if (session.currentProcess === childProcess) {

        session.currentProcess = null;

        socket.emit('command_complete', {
          success: code === 0,
          exitCode: code,
          currentDirectory: session.currentDirectory
        });

        resolve({
          success: true,
          output: ''
        });
      }
    });




    childProcess.on('error', (error) => {

      clearTimeout(needsPtyTimeout);
      clearTimeout(killTimeout);

      if (session.currentProcess === childProcess) {
        session.currentProcess = null;

        if (error.code === 'ENOENT' || error.message.includes('spawn')) {

          console.log(`[EXEC] Spawn failed for "${originalCommand}", falling back to PTY:`, error.message);
          this.executePtyCommand(originalCommand, session, socket);
          return;
        }

        resolve({
          success: false,
          error: `Shell error: ${error.message}`
        });
      }
    });





    const killTimeout = setTimeout(() => {

      if (!childProcess.killed) {

        childProcess.kill('SIGKILL');
        resolve({
          success: false,
          error: 'Command timed out (30s)'
        });
      }
    }, this.config.commandTimeout);
  }









  executePtyCommand(command, session, socket) {

    return new Promise((resolve) => {

      console.log('[EXEC PTY] Executing with PTY:', command);

      socket.emit('pty_session_started');

      const ptyProcess = pty.spawn('bash', ['-c', command], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: session.currentDirectory,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          USER: 'webshell',
          HOME: '/tmp'
        }
      });

      console.log('[EXEC PTY] Process PID:', ptyProcess.pid);

      session.currentProcess = ptyProcess;
      session.isPtyMode = true;

      ptyProcess.onData((data) => {

        console.log('[EXEC PTY OUTPUT]:', data);

        socket.emit('command_stream', {
          type: 'stdout',
          data: data
        });

        if (data.includes(':') || data.includes('$') || data.includes('#')) {
          socket.emit('pty_input_ready');
          console.log('[EXEC PTY] Input ready');
        }
      });

      ptyProcess.onExit(({ exitCode, signal }) => {

        console.log('[EXEC PTY EXIT] Code:', exitCode, 'Signal:', signal);

        clearTimeout(statusTimeout);

        session.currentProcess = null;
        session.isPtyMode = false;
        session.incrementCommands();

        socket.emit('command_complete', {

          success: exitCode === 0,
          exitCode: exitCode,
          currentDirectory: session.currentDirectory

        });


        resolve({

          success: true,
          output: ''
        });
      });

      ptyProcess.on('error', (error) => {
        console.log('[EXEC PTY ERROR]:', error);
      });

      const statusTimeout = setTimeout(() => {
        console.log('[EXEC PTY STATUS] Still alive after 5s, PID:', ptyProcess.pid);
      }, 5000);
    });
  }








  cancelCommand(session) {

    if (session.currentProcess) {

      console.log('[EXEC] Canceling active process');
      session.currentProcess.kill('SIGTERM');
      session.currentProcess = null;

      return true;
    }

    return false;
  }


  sendInput(session, input) {
    if (!session.currentProcess) {
      return false;
    }


    if (input === '\x04') {
      console.log('[EXEC] Processing EOF (CTRL+D)');

      if (session.isPtyMode && session.currentProcess.write) {

        session.currentProcess.write(input);
        return true;
      } else {

        console.log('[EXEC] Terminating SPAWN process with SIGTERM');
        session.currentProcess.kill('SIGTERM');
        return true;
      }
    }


    if (session.isPtyMode && session.currentProcess.write) {
      session.currentProcess.write(input + '\n');
      console.log(`[EXEC PTY INPUT] -> "${input}" sent to PTY`);
      return true;
    } else if (session.currentProcess.stdin) {
      session.currentProcess.stdin.write(input + '\n');
      console.log(`[EXEC INPUT] -> "${input}" sent to process`);
      return true;
    }

    return false;
  }








  generateHelpText(isAuthenticated, clientIP) {

    const authStatus = isAuthenticated ? 'AUTHENTICATED - All commands available' : 'GUEST - Limited commands only';

    const availableCommands = isAuthenticated ?
    'All system commands (except forbidden for security)' :
    this.config.guestCommands.join(', ');

    return `WebShell Commands v1.0:
=========================
Status: ${authStatus}

Available Commands:
${availableCommands}

Special Commands:
  clear    - Clear screen
  exit     - Log out session  
  help     - This help message
  session  - Socket session info

${isAuthenticated ? '' : 'To access all commands, please authenticate first.'}
[IP INFO] Your IP: ${clientIP}
`;
  }

  generateSessionInfo(sessionInfo, ipAttempts = 0, isIPLocked = false) {

    if (!sessionInfo) {
      return 'No session information available';
    }

    return `Session Information:
========================
Socket ID: ${sessionInfo.socketId}
IP: ${sessionInfo.ip}
Auth: ${sessionInfo.authenticated}
Start Time: ${sessionInfo.startTime}
Last Activity: ${sessionInfo.lastActivity}
Commands Sent: ${sessionInfo.commandCount}
PWD: ${sessionInfo.currentDirectory}
Active Process: ${sessionInfo.hasActiveProcess ? 'YES' : 'NO'}
PTY Mode: ${sessionInfo.isPtyMode ? 'YES' : 'NO'}

IP/AUTH Statistics:
Failed Attempts: ${ipAttempts}
IP Lockdown: ${isIPLocked ? 'YES' : 'NO'}`;
  }
}