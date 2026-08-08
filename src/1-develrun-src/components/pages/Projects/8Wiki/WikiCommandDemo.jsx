import React, { useState } from 'react';
import MockShell from '../../../commons/MockShell';
import { MOCK_SHELL_DATA } from './MockShellData/mockShellData.js';

const WikiCommandDemo = ({
  title = 'Try it yourself!',
  commands = [],
  initialOutput = [
  {
    type: 'system',
    content: [
    '==================================================',
    'wg-autoconf Interactive Demo',
    '==================================================',
    'Type commands below to see how they work.',
    'Available commands: help, list, status, setup, up, routes',
    '',
    'Ready for your command.',
    '']

  }]

}) => {
  const [isExpanded, setIsExpanded] = useState(true);


  const quickCommands = commands.length > 0 ? commands : [
  'help',
  'list',
  'status',
  'status wg_home',
  'setup home',
  'up wg_home',
  'routes set wg_home port3'];


  const handleQuickCommand = (cmd) => {
    const input = document.querySelector('.mock-shell-container .terminal-input');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value').
      set;
      nativeInputValueSetter.call(input, cmd);

      input.dispatchEvent(new Event('input', { bubbles: true }));

      const enterEvent = new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      input.dispatchEvent(enterEvent);
    }
  };

  return (
    <div className="wiki-command-demo">
      <div className="demo-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="demo-header-left">
          <span className="demo-icon">💻</span>
          <span className="demo-title">{title}</span>
        </div>
        <div className="demo-controls">
          <span className="demo-badge">Interactive</span>
          <button className="demo-toggle">
            {isExpanded ? '▾' : '▸'}
          </button>
        </div>
      </div>

      {isExpanded &&
      <div className="demo-body">
          <div className="demo-quick-commands">
            <span className="quick-label">Quick commands:</span>
            {quickCommands.map((cmd, idx) =>
          <button
          key={idx}
          className="quick-command-btn"
          onClick={() => handleQuickCommand(cmd)}>

                <code>{cmd}</code>
              </button>)}

          </div>

          <div className="demo-terminal-wrapper">
            <MockShell
          mockData={MOCK_SHELL_DATA}
          initialOutput={initialOutput}
          commandHistoryKey="wiki_demo_history" />

          </div>
        </div>}

    </div>);

};

export default WikiCommandDemo;