import React, { useRef, useEffect } from 'react';
import { useMockTerminal } from '../../hooks/useMockTerminal';
import { DEFAULT_MOCK_SHELL_DATA } from './mockShellData';
import TerminalOutput from '../pages/Projects/7WebShell/TerminalOutput';
import TerminalInput from '../pages/Projects/7WebShell/TerminalInput';

const MockHeader = ({ currentDirectory = '~' }) => (
  <div className="terminal-header mock-shell">
    <div className="terminal-controls">
      <span className="control close disabled" title="disabled"></span>
      <span className="control minimize disabled"></span>
      <span className="control maximize disabled"></span>
    </div>

    <div className="terminal-title">MockShell (Wiki) - read-only controls</div>

    <div className="terminal-status">
      <span className="status-indicator connected">●</span>
    </div>
  </div>
);

const MockShell = ({
  className = '',
  title = 'MockShell',
  mockData = DEFAULT_MOCK_SHELL_DATA,
  getMockResponse = null,
  initialOutput,
  commandHistoryKey = 'mockshell_command_history'
}) => {
  const terminalInputRef = useRef(null);
  const resolvedMockData = mockData ?? DEFAULT_MOCK_SHELL_DATA;

  useEffect(() => {
    if (terminalInputRef.current) {
      terminalInputRef.current.setAttribute('autocomplete', 'off');
    }
  }, []);

  const responseProvider = getMockResponse || ((cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed.startsWith('echo ')) {
      return cmd.substring(5).trim();
    }

    return resolvedMockData[trimmed] || resolvedMockData.error || 'Command not found.';
  });

  const terminalOptions = {
    getMockResponse: responseProvider,
    mockData: resolvedMockData,
    commandHistoryKey
  };

  if (initialOutput !== undefined) {
    terminalOptions.initialOutput = initialOutput;
  }

  const {
    output,
    currentCommand,
    setCurrentCommand,
    isExecuting,
    isWaitingForInput,
    isPtyActive,
    outputRef,
    executeCommand,
    navigateHistory
  } = useMockTerminal(terminalOptions);

  return (
    <div className={`webshell mock-shell-container ${className}`}>
      <div className="terminal-container">
        <MockHeader currentDirectory="~" />

        <div className="terminal-body" ref={outputRef}>
          <TerminalOutput
            output={output}
            isExecuting={isExecuting}
            isWaitingForInput={isWaitingForInput}
            outputRef={outputRef}
          />

          <TerminalInput
            currentCommand={currentCommand}
            setCurrentCommand={setCurrentCommand}
            onExecuteCommand={executeCommand}
            onNavigateHistory={navigateHistory}
            isExecuting={isExecuting}
            isWaitingForInput={isWaitingForInput}
            isPtyActive={isPtyActive}
            isAuthenticated={true}
            terminalInputRef={terminalInputRef}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MockShell;
