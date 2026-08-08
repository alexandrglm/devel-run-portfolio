import { useState, useCallback, useRef, useEffect } from 'react';

export const useTerminal = (
  socket,
  isAuthenticated,
  guestMode = false,
  setShowAuthForm = null,
  terminalInputRef = null,
  setCurrentDirectory = null
) => {
  const [output, setOutput] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [isPtyActive, setIsPtyActive] = useState(false);
  const [initialPwdSent, setInitialPwdSent] = useState(false);

  const outputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated || guestMode) {
      const welcomeMessage = isAuthenticated
        ? [
            '🚀 Authenticated access to WebShell',
            '',
            'Type "help" to see available commands.',
            'Type "clear" to clear the screen.',
            'Type "exit" to close the session.',
            ''
          ]
        : [
            '👋 Welcome to WebShell - Guest Mode',
            '',
            'Type "help" to see available commands.',
            'Type "login" to authenticate for full access.',
            'Type "clear" to clear the screen.',
            ''
          ];

      setOutput([{ type: 'system', content: welcomeMessage }]);
    }
  }, [isAuthenticated, guestMode]);

  useEffect(() => {
    if (!socket || !(isAuthenticated || guestMode)) return;

    const handleCommandOutput = (data) => {
      if (data.currentDirectory && setCurrentDirectory) {
        setCurrentDirectory(data.currentDirectory);
      }

      if (data.output && data.output.trim() !== '' && data.output !== 'Command OK') {
        setOutput(prev => [...prev, {
          type: 'response',
          content: data.output.split('\n')
        }]);
      }

      setIsExecuting(false);
    };

    const handleCommandError = (data) => {
      setOutput(prev => [...prev, {
        type: 'error',
        content: [data.error || 'Error executing command']
      }]);
      setIsExecuting(false);
    };

    const handleCommandStream = (data) => {
      if (data.type === 'stdout' || data.type === 'stderr') {
        setOutput(prev => {
          const lastItem = prev[prev.length - 1];
          if (lastItem && lastItem.type === 'streaming') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastItem,
                content: [...lastItem.content, data.data]
              }
            ];
          }
          return [...prev, { type: 'streaming', content: [data.data] }];
        });
      }
    };

    const handleCommandComplete = () => {
      setIsExecuting(false);
      setIsWaitingForInput(false);
      setIsPtyActive(false);
    };

    const handlePtyInputReady = () => {
      setIsWaitingForInput(true);
      setIsExecuting(false);
    };

    const handlePtySessionStarted = () => {
      setIsPtyActive(true);
      setIsExecuting(true);
    };

    const handleCommandCancel = () => {
      setIsExecuting(false);
      setIsWaitingForInput(false);
      setIsPtyActive(false);
      setOutput(prev => [...prev, {
        type: 'error',
        content: ['^C - Command canceled']
      }]);
    };

    socket.on('command_output', handleCommandOutput);
    socket.on('command_error', handleCommandError);
    socket.on('command_stream', handleCommandStream);
    socket.on('command_complete', handleCommandComplete);
    socket.on('pty_input_ready', handlePtyInputReady);
    socket.on('pty_session_started', handlePtySessionStarted);
    socket.on('command_cancel', handleCommandCancel);

    return () => {
      socket.off('command_output', handleCommandOutput);
      socket.off('command_error', handleCommandError);
      socket.off('command_stream', handleCommandStream);
      socket.off('command_complete', handleCommandComplete);
      socket.off('pty_input_ready', handlePtyInputReady);
      socket.off('pty_session_started', handlePtySessionStarted);
      socket.off('command_cancel', handleCommandCancel);
    };
  }, [socket, isAuthenticated, guestMode, setCurrentDirectory]);

  useEffect(() => {
    if (socket && (isAuthenticated || guestMode) && !initialPwdSent) {
      executeCommand('pwd');
      setInitialPwdSent(true);
    }
  }, [socket, isAuthenticated, guestMode, initialPwdSent]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (!isExecuting && terminalInputRef?.current && (isAuthenticated || guestMode)) {
      terminalInputRef.current.focus();
    }
  }, [isExecuting, terminalInputRef, isAuthenticated, guestMode]);

  const executeCommand = useCallback((command) => {
    if (!command.trim() || isExecuting || !socket || !(isAuthenticated || guestMode)) return;

    if (isPtyActive && isWaitingForInput) {
      socket.emit('command_input', { input: command.trim() });
      setCurrentCommand('');
      setHistoryIndex(-1);
      return;
    }

    if (isExecuting) return;

    if (command && !commandHistory.includes(command)) {
      setCommandHistory(prev => [command, ...prev].slice(0, 50));
    }

    const cmd = command.toLowerCase().trim();

    if (cmd === 'login') {
      if (guestMode && setShowAuthForm) {
        setShowAuthForm(true);
        setCurrentCommand('');
        setHistoryIndex(-1);
        return;
      } else if (isAuthenticated) {
        setOutput(prev => [...prev, {
          type: 'error',
          content: ['Already authenticated']
        }]);
        setCurrentCommand('');
        setHistoryIndex(-1);
        return;
      }
    }

    if (cmd === 'clear') {
      setOutput([]);
      setCurrentCommand('');
      setHistoryIndex(-1);
      return;
    }

    if (cmd === 'exit') {
      socket.disconnect();
      setCurrentCommand('');
      setHistoryIndex(-1);
      return;
    }

    setIsExecuting(true);
    socket.emit('execute_command', { command });
    setCurrentCommand('');
    setHistoryIndex(-1);
  }, [socket, isAuthenticated, guestMode, isExecuting, commandHistory, setShowAuthForm, isPtyActive, isWaitingForInput]);

  const navigateHistory = useCallback((direction) => {
    if (direction === 'up' && historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[newIndex]);
    } else if (direction === 'down') {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  }, [historyIndex, commandHistory]);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  return {
    output,
    currentCommand,
    setCurrentCommand,
    commandHistory,
    historyIndex,
    isExecuting,
    isWaitingForInput,
    isPtyActive,
    outputRef,
    executeCommand,
    navigateHistory,
    clearOutput
  };
};
