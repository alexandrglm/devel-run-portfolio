


import React, { useRef, useEffect } from 'react';

const TerminalInput = ({

  currentCommand,
  setCurrentCommand,
  onExecuteCommand,
  onNavigateHistory,
  isExecuting,
  isWaitingForInput,
  isPtyActive,
  isAuthenticated,
  terminalInputRef,
  socket,
  disabled

}) => {





  useEffect(() => {

    if (isAuthenticated && terminalInputRef.current) {

      terminalInputRef.current.focus();

    }

  }, [isAuthenticated]);


  const handleKeyPress = (e) => {

    if (e.key === 'Enter') {

      if (isWaitingForInput && socket) {



        socket.emit('command_input', { input: currentCommand });
        setCurrentCommand('');


      } else {

        onExecuteCommand(currentCommand);

      }
    }
  };

  const handleKeyDown = (e) => {

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onNavigateHistory('up');

    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onNavigateHistory('down');

    } else if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();


      if (isExecuting && !isPtyActive && socket) {
        console.log('[DEBUG] CTRL+D: Canceling spawn command');
        socket.emit('cancel_command');
        return;
      }


      if (isPtyActive && socket) {
        console.log('[DEBUG] Sending EOF (CTRL+D) to PTY process');
        socket.emit('command_input', { input: '\x04' });
      }
    }

  };






  return (

    <div className="terminal-input-container">
    
      {!isPtyActive &&
      <div className="terminal-prompt">
      
          <span className="prompt-user">user@webshell</span>
          <span className="prompt-separator">:</span>
          <span className="prompt-path">~</span>
          <span className="prompt-symbol">$</span>
      
        </div>}


      <input

      ref={terminalInputRef}
      type="text"
      value={currentCommand}
      onChange={(e) => setCurrentCommand(e.target.value)}
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyDown}
      className="terminal-input"
      disabled={disabled}
      autoComplete="off"
      spellCheck="false"
      placeholder={isExecuting ? 'Executing ...' : isWaitingForInput ? '' : ''} />


    
    </div>);

};

export default TerminalInput;