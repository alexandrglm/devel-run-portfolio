
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const ServerManagement = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Server Management</h1>

      <p>
        wg-autoconf supports creating and managing WireGuard servers with multiple clients.
        This section covers server creation, client management, and monitoring.
      </p>

      <h2>Creating a Server</h2>

      <h3>Server Create (Interactive)</h3>
      <div className="code-block">
        <pre><code>{`wg-autoconf server create

# Prompts for:
# Server name: myserver
# Subnet [10.99.0.0/24]: 10.99.0.0/24
# DNS [10.99.0.1]: 10.99.0.1
# Listen port [51820]: 51820
# Endpoint [vpn.example.com]: vpn.example.com

# Creates:
# - Server interface: wg_server_myserver
# - Firewall zone: wg_server_myserver
# - Config directory: /usr/libexec/wg-autoconf/configs/myserver/`}</code></pre>
      </div>

      <h2>Client Management</h2>

      <h3>Add Client</h3>
      <div className="code-block">
        <pre><code>{`# Add client (auto-assigns IP)
wg-autoconf server add myserver alice

# Output:
# User Details:
#   Name:   alice
#   IP:     10.99.0.2
#   Config: /usr/libexec/wg-autoconf/configs/myserver/alice.conf`}</code></pre>
      </div>

      <h3>Add Multiple Clients</h3>
      <div className="code-block">
        <pre><code>{`# Add multiple clients
wg-autoconf server add myserver alice
wg-autoconf server add myserver bob
wg-autoconf server add myserver charlie

# IPs auto-assigned:
# alice: 10.99.0.2
# bob:   10.99.0.3
# charlie: 10.99.0.4`}</code></pre>
      </div>

      <h2>Server Monitoring</h2>

      <h3>List Servers and Clients</h3>
      <div className="code-block">
        <pre><code>{`# List all servers and clients
wg-autoconf server list

# Output:
# Server: myserver
#   Subnet: 10.99.0.0/24
#   Clients: 2
#     - alice (10.99.0.2)
#     - bob (10.99.0.3)`}</code></pre>
      </div>

      <h3>Server Statistics</h3>
      <div className="code-block">
        <pre><code>{`# Show detailed statistics
wg-autoconf server stats myserver

# Output:
# Server Info:
#   Public Key: GHyXLa7n1gGPN/...
#   Subnet: 10.99.0.0/24
#   Total Clients: 2
#   Active: 2
# 
# Clients:
#   [1] alice
#       IP: 10.99.0.2
#       Status: Connected
#       Transfer: 12.4 KiB RX, 8.2 KiB TX`}</code></pre>
      </div>

      <h2>Client Management</h2>

      <h3>Revoke Client</h3>
      <div className="code-block">
        <pre><code>{`# Revoke client (requires confirmation)
wg-autoconf server revoke myserver alice

# Actions taken:
# - Removed peer from server
# - Deleted client config
# - Updated state`}</code></pre>
      </div>

      <h3>Remove Server</h3>
      <div className="code-block">
        <pre><code>{`# Remove entire server (auto-revokes all clients)
wg-autoconf server remove myserver

# Actions taken:
# - Revoked all clients
# - Removed UCI interface
# - Removed firewall zone
# - Cleaned state
# - Deleted config directory`}</code></pre>
      </div>

      <h2>Export Client Configs</h2>
      <div className="code-block">
        <pre><code>{`# View client config
cat /usr/libexec/wg-autoconf/configs/myserver/alice.conf

# Transfer to client device:
# - USB stick
# - Email
# - QR code in WireGuard app
# - Direct file transfer

# Client imports .conf in WireGuard app
# Client connects → handshake appears in stats`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">📊</span>
        <div>
          <strong>Server Architecture:</strong>
          <pre style={{ marginTop: '8px' }}>
            <code>{`wg_server_myserver (10.99.0.0/24)
  ├─→ client1 (10.99.0.2)
  ├─→ client2 (10.99.0.3)
  └─→ client3 (10.99.0.4)

wg_server_work (10.98.0.0/24)
  ├─→ emp_user1 (10.98.0.2)
  └─→ emp_user2 (10.98.0.3)`}</code>
          </pre>
        </div>
      </div>

      <WikiCommandDemo
      title="Try Server Management Commands"
      commands={[
      'help',
      'server create',
      'server list',
      'server stats myserver',
      'server add myserver alice']} />



      <div className="wiki-navigation-links">
        <Link to="/wiki/routing" className="nav-link prev">
          ← Routing
        </Link>
        <Link to="/wiki/architecture" className="nav-link next">
          Architecture →
        </Link>
      </div>
    </motion.div>);

};

export default ServerManagement;