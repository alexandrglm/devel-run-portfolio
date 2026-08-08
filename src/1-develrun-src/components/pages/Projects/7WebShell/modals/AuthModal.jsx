


import React, { useState, useRef, useEffect } from 'react';
import { Icons, faLock } from '../../../../commons/FontAwesome';

import ConnectionStatus from '../ConnectionStatus';


const AuthForm = ({

  onAuthenticate,
  isAuthenticating,
  authError,
  remainingAttempts,
  isLockedOut,
  isConnected,
  onBack

}) => {

  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);


  useEffect(() => {

    if (passwordRef.current) {

      passwordRef.current.focus();

    }

  }, []);

  const handleSubmit = (e) => {

    e.preventDefault();

    if (password.trim() && !isAuthenticating && !isLockedOut) {
      onAuthenticate(password);
      setPassword('');
    }

  };


  const handleKeyPress = (e) => {

    if (e.key === 'Enter') {
      handleSubmit(e);
    }

  };

  return (
    <div className="auth-screen">
      
      <div className="auth-container">
        
        <div className="auth-header">
          
          <div className="auth-icon">
            <Icons icon={faLock} />
          </div>
          
            <h2>WebShell Access</h2>
            <p>Please, provide a valid token for entering WebShell, or take a look inside a limited Guest Mode</p>
        </div>

        <form id="webshell-auth-form" onSubmit={handleSubmit}>

          <div className="auth-form">
              
              <div className="input-group">
                  
                  <input
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Auth ..."
                disabled={isAuthenticating || isLockedOut}
                className="auth-input"
                autoComplete="off" />
              
              
              </div>
              
              <button
              type="submit"
              disabled={isAuthenticating || !password.trim() || isLockedOut}
              className="auth-button">
              
                {isAuthenticating ? 'Checking Token ...' : 'Log in'}
              </button>

              <button
              type="button"
              onClick={() => onBack && onBack()}
              disabled={isAuthenticating || isLockedOut}
              className="auth-button">
              
                Return to Guest Mode
              </button>

          </div>

        </form>


        {authError &&

        <div className="auth-error">
          
            {authError}
          
          </div>
        }




        {isLockedOut}
        <ConnectionStatus isConnected={isConnected} />
      </div>
    </div>);

};

export default AuthForm;