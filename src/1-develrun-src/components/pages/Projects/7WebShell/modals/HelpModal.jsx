



import React from "react";
import { Icons, faCircleInfo, faArrowUp, faArrowDown } from '../../../../commons/FontAwesome';



const HelpModal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (

    <div className="auth-modal">
      
      <div className="auth-overlay" onClick={onClose}></div>
      
      <div className="auth-container">
        
        <div className="auth-header">
          
          <div className="info auth-icon">
            <Icons icon={faCircleInfo} />
          </div>
          
          <h2>WebShell Help</h2>
        </div>

        <div className="help-content">

        <div className="help-section">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li><kbd><><Icons icon={faArrowUp} /></></kbd>/<kbd><Icons icon={faArrowDown} /></kbd> - Navigate command history</li>
              <li><kbd>Ctrl+D</kbd> - Send EOF / Cancel command</li>
              <li><kbd>Enter</kbd> - Execute command</li>
            </ul>
          </div>
          
          <div className="help-section">
            <h3>Basic Commands</h3>
            <ul>
              <li><code>help</code> - Show this help screen</li>
              <li><code>clear</code> - Clear terminal screen</li>
              <li><code>login</code> - Authenticate for full access</li>
              <li><code>exit</code> - Disconnect from server</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>Guest Mode Commands</h3>
            <ul>
              <li><code>ls</code> - List directory contents</li>
              <li><code>pwd</code> - Show current directory</li>
              <li><code>whoami</code> - Show current user</li>
              <li><code>date</code> - Show current date/time</li>
              <li><code>uptime</code> - Show system uptime</li>
            </ul>
          </div>


        </div>

        <button
        type="button"
        onClick={onClose}
        className="auth-button">

          Close
        </button>

      </div>
    </div>);

};

export default HelpModal;