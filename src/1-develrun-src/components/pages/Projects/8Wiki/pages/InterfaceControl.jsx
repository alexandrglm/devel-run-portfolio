
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const InterfaceControl = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Interface Control</h1>

      <p>
        Complete guide to managing WireGuard interfaces with wg-autoconf.
        Includes setup, activation, deactivation, and removal.
      </p>

      <h2>Setup Commands</h2>

      <h3>wg-autoconf setup &lt;name&gt;</h3>
      <p>Creates a WireGuard interface from a .conf file:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf setup home
# Result: Interface wg_home created but DOWN`}</code></pre>
      </div>

      <h3>wg-autoconf manual</h3>
      <p>Interactive setup with prompts for all parameters:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf manual
# Prompts for:
# - Interface name
# - Private/Public keys
# - Local address
# - Endpoint
# - AllowedIPs
# - DNS`}</code></pre>
      </div>

      <h2>Activation Commands</h2>

      <h3>wg-autoconf up &lt;iface&gt;</h3>
      <p>Activates a WireGuard interface:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf up wg_home
# Result: Interface wg_home is UP and ready`}</code></pre>
      </div>

      <h3>wg-autoconf down &lt;iface&gt;</h3>
      <p>Deactivates a WireGuard interface:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf down wg_home
# Result: Interface wg_home is DOWN`}</code></pre>
      </div>

      <h2>Status Commands</h2>

      <h3>wg-autoconf status</h3>
      <p>Shows all interfaces and their status:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf status
# Shows:
# - Interface name
# - Status (CREATED/UP/DOWN/ROUTED)
# - Local IP
# - Endpoint
# - Transfer stats`}</code></pre>
      </div>

      <h3>wg-autoconf status &lt;iface&gt;</h3>
      <p>Shows detailed info for a specific interface:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf status wg_home
# Shows:
# - All interface details
# - Peer information
# - Handshake times
# - Transfer statistics`}</code></pre>
      </div>

      <h2>Removal Commands</h2>

      <h3>wg-autoconf remove &lt;iface&gt;</h3>
      <p>Removes an interface and all its configurations:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf remove wg_home
# Removes:
# - UCI configuration
# - Firewall rules
# - Routing tables
# - State entries`}</code></pre>
      </div>

      <h3>wg-autoconf clean &lt;iface&gt;</h3>
      <p>Interactive cleanup with confirmation:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf clean wg_home
# Prompts for confirmation before removal`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">💡</span>
        <div>
          <strong>Lifecycle Flow:</strong>
          <pre style={{ marginTop: '8px' }}>
            <code>{`setup → up → routes set → (active/routed)
                ↓
           down → remove`}</code>
          </pre>
        </div>
      </div>

      <WikiCommandDemo
      title="Try Interface Control Commands"
      commands={[
      'help',
      'list',
      'setup home',
      'up wg_home',
      'status',
      'status wg_home',
      'down wg_home',
      'remove wg_home']} />



      <div className="wiki-navigation-links">
        <Link to="/wiki/config-mgmt" className="nav-link prev">
          ← Configuration Management
        </Link>
        <Link to="/wiki/routing" className="nav-link next">
          Routing →
        </Link>
      </div>
    </motion.div>);

};


export default InterfaceControl;