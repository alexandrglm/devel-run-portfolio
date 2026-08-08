


import React, { useEffect, useRef, useState } from 'react';

import { useSocket } from '../../../../hooks/useSocket';
import { useAuth } from '../../../../hooks/useAuth';
import { useTerminal } from '../../../../hooks/useTerminal';


import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import AuthForm from './modals/AuthModal';

import { Icons, faHeartCrack } from '../../../commons/FontAwesome';

const Terminal = ({ className = '', isStandalone = false }) => {

  const { socket, isConnected, connect, disconnect, emit } = useSocket();


  const [showAuthForm, setShowAuthForm] = useState(false);
  const [guestMode, useGuestMode] = useState(true);

  const [showReconnectModal, setShowReconnectModal] = useState(false);


  const [currentDirectory, setCurrentDirectory] = useState('~');



  const terminalInputRef = useRef(null);



  const {

    isAuthenticated,
    isAuthenticating,
    authError,
    remainingAttempts,
    isLockedOut,
    authenticate,
    logout

  } = useAuth(socket, () => setShowAuthForm(false));

  const {
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

  } = useTerminal(socket, isAuthenticated, guestMode, setShowAuthForm, terminalInputRef, setCurrentDirectory);




  useEffect(() => {

    connect();
    return () => disconnect();

  }, []);





  useEffect(() => {

    if (socket) {

      const handleDisconnect = () => {
        logout();
        clearOutput();
      };

      socket.on('disconnect', handleDisconnect);

      return () => socket.off('disconnect', handleDisconnect);
    }

  }, [socket]);



  useEffect(() => {
    if (socket) {

      const handleDisconnect = (reason) => {

        console.log('[DEBUG] Socket disconnected:', reason);

        setShowReconnectModal(true);
        logout();
        clearOutput();

      };

      socket.on('disconnect', handleDisconnect);

      return () => socket.off('disconnect', handleDisconnect);
    }
  }, [socket, logout, clearOutput]);






  const handleWebshellFocus = () => {

    if (terminalInputRef.current && (isAuthenticated || guestMode)) {

      terminalInputRef.current.focus();

    }

  };



  return (

    <div className={`webshell ${className} ${isStandalone ? 'standalone-mode' : ''}`}>
    
      <div className="terminal-container" onClick={handleWebshellFocus}>
    
        <TerminalHeader
        isConnected={isConnected}
        onLogout={() => {socket?.disconnect();logout();}}
        currentDirectory={currentDirectory}
        socket={socket}
        executeCommand={executeCommand}
        setShowAuthForm={setShowAuthForm} />

        
        <div className="terminal-body" ref={outputRef}>
    
          <TerminalOutput
          output={output}
          isExecuting={isExecuting}
          isWaitingForInput={isWaitingForInput}
          outputRef={outputRef} />

          
          <TerminalInput
          currentCommand={currentCommand}
          setCurrentCommand={setCurrentCommand}
          onExecuteCommand={executeCommand}
          onNavigateHistory={navigateHistory}
          isExecuting={isExecuting}
          isWaitingForInput={isWaitingForInput}
          isPtyActive={isPtyActive}
          isAuthenticated={isAuthenticated || guestMode}
          terminalInputRef={terminalInputRef}
          socket={socket}
          disabled={showAuthForm} />

    
        </div>

        {}


        {showAuthForm &&


        <div className="auth-modal">
            
            <div className="auth-overlay" onClick={() => setShowAuthForm(false)}></div>
            <AuthForm
          onAuthenticate={authenticate}
          isAuthenticating={isAuthenticating}
          authError={authError}
          remainingAttempts={remainingAttempts}
          isLockedOut={isLockedOut}
          isConnected={isConnected}
          onBack={() => setShowAuthForm(false)} />

          </div>}



        {}
        {showReconnectModal &&

        <div className="auth-modal">
          
            <div className="auth-overlay"></div>
          
            <div className="auth-container">

              <div className="auth-icon red">
                <Icons icon={faHeartCrack} />
              </div>
          
              <h2>Connection Ended</h2>
              <p>Your session has ended, but you can reconnect by signing in again.  
              If you did not sign out yourself, please check your connection.</p>
          
          
              <button
            type="button"
            onClick={() => {
              setShowReconnectModal(false);
              connect();
            }}
            className="auth-button">

                Sign In Again
              </button>
          
            </div>
          
          </div>}



        
      </div>
    </div>);

};

export default Terminal;