import { useState, useEffect, useRef, useCallback } from 'react';
import { getMockResponse as defaultGetMockResponse } from '../components/pages/Projects/8Wiki/mockData';

const DEFAULT_INITIAL_OUTPUT = [
  {
    type: 'system',
    content: [
      '==================================================',
      'wg-autoconf v1.0.0-r1 - WireGuard Automation Tool',
      '==================================================',
      'Type \'help\' for available commands',
      ''
    ]
  }
];

const DEFAULT_COMMAND_HISTORY_KEY = 'webshell_command_history';

const getResponseFromMap = (cmd, responses = {}) => {
  const trimmed = cmd.trim().toLowerCase();
  if (!trimmed) return '';

  if (responses[trimmed]) {
    return responses[trimmed];
  }

  if (trimmed.startsWith('echo ')) {
    return cmd.substring(5).trim();
  }

  return responses.error || 'Command not found.';
};

export const useMockTerminal = (options = {}) => {
  const {
    getMockResponse = null,
    mockData = null,
    initialOutput = DEFAULT_INITIAL_OUTPUT,
    commandHistoryKey = DEFAULT_COMMAND_HISTORY_KEY
  } = options;

  const [output, setOutput] = useState(initialOutput);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [isPtyActive, setIsPtyActive] = useState(false);

  const outputRef = useRef(null);

  const resolveMockResponse = useCallback((cmd) => {
    if (typeof getMockResponse === 'function') {
      return getMockResponse(cmd);
    }

    if (mockData) {
      return getResponseFromMap(cmd, mockData);
    }

    return defaultGetMockResponse(cmd);
  }, [getMockResponse, mockData]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(commandHistoryKey);
      if (saved) {
        setCommandHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('[TERMINAL] Failed to load command history:', e);
    }
  }, [commandHistoryKey]);

  const saveToHistory = useCallback((cmd) => {
    if (!cmd.trim()) return;

    setCommandHistory(prev => {
      const newHistory = prev[prev.length - 1] === cmd ? prev : [...prev, cmd].slice(-50);
      try {
        localStorage.setItem(commandHistoryKey, JSON.stringify(newHistory));
      } catch (e) {
        console.warn('[TERMINAL] Failed to save command history:', e);
      }
      return newHistory;
    });
  }, [commandHistoryKey]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = useCallback((content, type = 'stdout') => {
    setOutput(prev => [...prev, { type, content }]);
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([
      {
        type: 'system',
        content: [
          ''
        ]
      }
    ]);
  }, []);

  const executeCommand = useCallback(async (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) {
      setCurrentCommand('');
      return;
    }

    addOutput(`$ ${cmd}`, 'command');
    saveToHistory(trimmedCmd);
    setHistoryIndex(-1);
    setCurrentCommand('');
    setIsExecuting(true);

    try {
      if (trimmedCmd.toLowerCase() === 'clear') {
        clearOutput();
        setIsExecuting(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      const response = resolveMockResponse(trimmedCmd);

      if (response) {
        if (Array.isArray(response)) {
          addOutput(response, 'stdout');
        } else if (typeof response === 'string' && response.includes('\n')) {
          addOutput(response.split('\n'), 'stdout');
        } else {
          addOutput(response, 'stdout');
        }
      }
    } catch (error) {
      addOutput(`Error: ${error.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  }, [addOutput, saveToHistory, clearOutput, resolveMockResponse]);

  const navigateHistory = useCallback((direction) => {
    if (commandHistory.length === 0) return;
    let newIndex;
    if (direction === 'up') {
      newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) return;
    } else {
      newIndex = historyIndex - 1;
      if (newIndex < -1) return;
    }
    setHistoryIndex(newIndex);
    if (newIndex === -1) {
      setCurrentCommand('');
    } else {
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  }, [commandHistory, historyIndex]);

  return {
    output,
    currentCommand,
    setCurrentCommand,
    isExecuting,
    isWaitingForInput,
    isPtyActive,
    outputRef,
    executeCommand,
    navigateHistory,
    clearOutput
  };
};
