



import React from 'react';
import MockShell from '../../../commons/MockShell';












const WebshellWidget = ({
  title = 'wg-autoconf Interactive CLI',
  height = '600px',
  className = '',
  mockData = undefined,
  getMockResponse = null,
  initialOutput,
  commandHistoryKey = 'mockshell_command_history'
}) => {
  return (
    <div
      className={`webshell-widget ${className}`}
      style={{
        height,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-secondary)',
        marginBottom: 'var(--spacing-xl)'
      }}>
      
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {title &&
        <div
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'var(--text-secondary)'
          }}>
          
            {title}
          </div>
        }
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MockShell
            className="wiki-widget-terminal"
            title={title}
            mockData={mockData}
            getMockResponse={getMockResponse}
            initialOutput={initialOutput}
            commandHistoryKey={commandHistoryKey} />
          
        </div>
      </div>
    </div>);

};

export default WebshellWidget;