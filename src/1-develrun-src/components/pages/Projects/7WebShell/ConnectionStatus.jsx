



import React from 'react';
import { Icons, faUser, faUserSlash } from '../../../commons/FontAwesome';


const ConnectionStatus = ({ isConnected, className = '' }) => {

  return (

    <div className={`connection-status ${className}`}>
      
      <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? <> <Icons icon={faUser} /> Server Online</> : <> <Icons icon={faUserSlash} /> Server is Offline</>}
      </span>
    
    </div>);

};

export default ConnectionStatus;