
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
        This section covers server creation, client management, monitoring, and advanced
        server configurations.
      </p>

      <div className="wiki-note">
        <span className="note-icon">🖥️</span>
        <div>
          <strong>Server Architecture:</strong> Each server runs as an independent WireGuard
          interface (<code>wg_server_&lt;name&gt;</code>) with its own subnet, firewall zone,
          and client configurations.
        </div>
      </div>

      <h2>Server Creation</h2>

      <h3>Interactive Server Creation</h3>
      <div className="code-block">
        <pre>
          <code>{`wg-autoconf server create

# Interactive prompts:
# Server name: myserver
# Subnet [10.99.0.0/24]: 10.99.0.0/24
# DNS [10.99.0.1]: 10.99.0.1
# Listen port [51820]: 51820
# Endpoint [vpn.example.com]: vpn.example.com

# Output:
# [OK] Server wg_server_myserver created!
# Server Public Key: GHyXLa7n1gGPN/LJfxbh7EKz92ilepSDzk7jEz5l7DE=
# Subnet: 10.99.0.0/24
# DNS: 10.99.0.1
# Listen Port: 51820
# Endpoint: vpn.example.com`}</code>
        </pre>
      </div>

      <h3>What Gets Created</h3>
      <ul>
        <li><strong>Interface:</strong> <code>wg_server_myserver</code> in UCI</li>
        <li><strong>Firewall Zone:</strong> <code>wg_server_myserver</code> with masquerading</li>
        <li><strong>Firewall Rule:</strong> Allow UDP on listen port from WAN</li>
        <li><strong>Config Directory:</strong> <code>/usr/libexec/wg-autoconf/configs/myserver/</code></li>
        <li><strong>Server Config:</strong> <code>server.conf</code> with server keys</li>
        <li><strong>State Entries:</strong> Server tracked in state machine</li>
      </ul>

      <h2>Client Management</h2>

      <h3>Adding Clients</h3>
      <div className="code-block">
        <pre>
          <code>{`# Add a single client (auto-assigns next available IP)
wg-autoconf server add myserver alice

# Output:
# [OK] User 'alice' added to server 'myserver'
# User Details:
#   Name:          alice
#   IP:            10.99.0.2
#   Public Key:    /BjQMhFdwD410zqUE4hVgM1OJOpPVeKahjzKtXz3Wmk=
#   Created:       2025-02-22 14:35:20
# Config File:    /usr/libexec/wg-autoconf/configs/myserver/alice.conf

# Add multiple clients
wg-autoconf server add myserver bob
wg-autoconf server add myserver charlie

# IPs auto-assigned:
# alice:  10.99.0.2
# bob:    10.99.0.3
# charlie: 10.99.0.4`}</code>
        </pre>
      </div>

      <h3>Client Configuration Files</h3>
      <p>Each client gets a complete WireGuard .conf file ready for distribution:</p>
      <div className="code-block">
        <pre>
          <code>{`# /usr/libexec/wg-autoconf/configs/myserver/alice.conf
[Interface]
PrivateKey = uEcbqUV3DpqVgoElw2EV/m00T0Jwj9173y2nhTjnMnQ=
Address = 10.99.0.2/32
DNS = 10.99.0.1

[Peer]
PublicKey = GHyXLa7n1gGPN/LJfxbh7EKz92ilepSDzk7jEz5l7DE=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = vpn.example.com:51820
PersistentKeepalive = 25`}</code>
        </pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">📤</span>
        <div>
          <strong>Distributing Configs:</strong> Client .conf files can be distributed via:
          <ul>
            <li>USB drive or file transfer</li>
            <li>Email or messaging apps</li>
            <li>QR code scanning in WireGuard mobile app</li>
            <li>Direct file copy to client devices</li>
          </ul>
        </div>
      </div>

      <h2>Server Monitoring</h2>

      <h3>List Servers and Clients</h3>
      <div className="code-block">
        <pre>
          <code>{`# List all servers and their clients
wg-autoconf server list

# Output:
# ==[ Active WireGuard Servers ]=========================
# Server: myserver
#   Subnet: 10.99.0.0/24
#   Clients: 2
#     - alice (10.99.0.2) - Last HS: 5 seconds ago
#     - bob (10.99.0.3) - Last HS: 2 minutes ago
# 
# Server: enterprise
#   Subnet: 10.98.0.0/24
#   Clients: 3
#     - emp_user1 (10.98.0.2) - Last HS: 1 minute ago
#     - emp_user2 (10.98.0.3) - Last HS: 3 minutes ago
#     - emp_user3 (10.98.0.4) - Last HS: 15 minutes ago`}</code>
        </pre>
      </div>

      <h3>Server Statistics</h3>
      <div className="code-block">
        <pre>
          <code>{`# Show detailed server statistics
wg-autoconf server stats myserver

# Output:
# ==[ Server: myserver Statistics ]=======================
# Server Info:
#   Public Key:      GHyXLa7n1gGPN/LJfxbh7EKz92ilepSDzk7jEz5l7DE=
#   Subnet:          10.99.0.0/24
#   Listen Port:     51820
#   Total Clients:   2
#   Active:          2
# 
# Clients:
#   [1] alice
#       IP:          10.99.0.2
#       Status:      ◆ Connected
#       Last HS:     5 seconds ago
#       RX:          12.4 KiB
#       TX:          8.2 KiB
#       
#   [2] bob
#       IP:          10.99.0.3
#       Status:      ◆ Connected
#       Last HS:     2 minutes ago
#       RX:          45.7 KiB
#       TX:          23.1 KiB
#       
# Total Transfer:    57.1 KiB received, 31.3 KiB sent`}</code>
        </pre>
      </div>

      <h2>Client Management</h2>

      <h3>Revoke Client Access</h3>
      <div className="code-block">
        <pre>
          <code>{`# Revoke a client (requires confirmation)
wg-autoconf server revoke myserver alice

# Output:
# [CONFIRM] Are you sure you want to revoke user 'alice'? (yes/no): yes
# [OK] User 'alice' revoked from server 'myserver'
# Actions taken:
#   ✓ Removed peer from wg_server_myserver
#   ✓ Deleted config: /usr/libexec/wg-autoconf/configs/myserver/alice.conf
#   ✓ Updated state machine
# Client alice can no longer connect.`}</code>
        </pre>
      </div>

      <h3>Remove Server Completely</h3>
      <div className="code-block">
        <pre>
          <code>{`# Remove entire server (auto-revokes all clients)
wg-autoconf server remove myserver

# Output:
# [CONFIRM] Are you sure you want to remove server 'myserver' completely? (yes/no): yes
# [OK] Server 'myserver' removed completely
# Actions taken:
#   ✓ Revoked all 2 clients (no confirmation per client)
#   ✓ Removed UCI interface wg_server_myserver
#   ✓ Removed firewall zone
#   ✓ Flushed routing tables
#   ✓ Deleted /usr/libexec/wg-autoconf/configs/myserver/
#   ✓ Cleared state entries
# Server and all configurations removed.`}</code>
        </pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">⚠️</span>
        <div>
          <strong>Warning:</strong> <code>server remove</code> is destructive and cannot be undone.
          It automatically revokes all clients without individual confirmation. Use with caution.
        </div>
      </div>

      <h2>Advanced Server Configuration</h2>

      <h3>Multiple Servers</h3>
      <div className="code-block">
        <pre>
          <code>{`# Create multiple independent servers
wg-autoconf server create
# Server: vpn-us
# Subnet: 10.99.0.0/24
# Port: 51820
# Endpoint: us-vpn.example.com

wg-autoconf server create
# Server: vpn-eu
# Subnet: 10.98.0.0/24
# Port: 51821
# Endpoint: eu-vpn.example.com

# Activate both servers
wg-autoconf up wg_server_vpn-us
wg-autoconf up wg_server_vpn-eu

# List all servers
wg-autoconf server list`}</code>
        </pre>
      </div>

      <h3>Server with Different Ports</h3>
      <div className="code-block">
        <pre>
          <code>{`# Each server can have a different listen port
wg-autoconf server create
# Server: secure
# Port: 51820

wg-autoconf server create
# Server: guest
# Port: 51822

# Both servers can run simultaneously
# Clients connect to their respective ports`}</code>
        </pre>
      </div>

      <h3>Server with Custom DNS</h3>
      <div className="code-block">
        <pre>
          <code>{`# Set custom DNS during creation
wg-autoconf server create
# Server: private
# DNS: 192.168.1.1  (Internal DNS)

# Or modify after creation
uci set network.wg_server_private.dns='192.168.1.1'
uci commit network
ifup wg_server_private`}</code>
        </pre>
      </div>

      <h2>Server State Storage</h2>

      <h3>State File Entries</h3>
      <p>Servers use the same state format as normal interfaces:</p>
      <div className="code-block">
        <pre>
          <code>{`# /usr/libexec/wg-autoconf/states
ID_1_NAME=wg_server_myserver
ID_1_IS_CREATED=1
ID_1_IS_ACTIVE=1
ID_1_IS_RT_TABLES_IN_USE=0

# Server-specific metadata stored in config directory
# /usr/libexec/wg-autoconf/configs/myserver/server.conf`}</code>
        </pre>
      </div>

      <h3>Server Config Files</h3>
      <div className="code-block">
        <pre>
          <code>{`# /usr/libexec/wg-autoconf/configs/myserver/server.conf
# Server configuration
SERVER_NAME=myserver
SERVER_SUBNET=10.99.0.0/24
SERVER_DNS=10.99.0.1
SERVER_PORT=51820
SERVER_ENDPOINT=vpn.example.com
SERVER_PRIVKEY=...
SERVER_PUBKEY=...

# Client tracking
SERVER_NEXT_IP=10.99.0.5
SERVER_USER_COUNT=3

# Client entries
SERVER_USER_1_NAME=alice
SERVER_USER_1_IP=10.99.0.2
SERVER_USER_1_PUBKEY=...
SERVER_USER_1_PRIVKEY=...`}</code>
        </pre>
      </div>

      <h2>Server Management Best Practices</h2>

      <h3>Regular Monitoring</h3>
      <ul>
        <li>Check <code>wg-autoconf server list</code> regularly for client status</li>
        <li>Monitor <code>wg-autoconf server stats &lt;server&gt;</code> for traffic</li>
        <li>Watch for unexpected disconnections</li>
        <li>Review client handshake times</li>
      </ul>

      <h3>Client Lifecycle</h3>
      <ul>
        <li>Add new clients with <code>server add</code> as needed</li>
        <li>Revoke unused clients with <code>server revoke</code></li>
        <li>Keep client count manageable for performance</li>
        <li>Document client assignments (IPs, users, devices)</li>
      </ul>

      <h3>Security Best Practices</h3>
      <ul>
        <li>Use strong private keys (auto-generated by wg-autoconf)</li>
        <li>Regularly review client list (<code>server list</code>)</li>
        <li>Revoke access for departed users immediately</li>
        <li>Monitor server logs for unusual activity</li>
        <li>Keep wg-autoconf updated for security patches</li>
      </ul>

      <div className="wiki-note">
        <span className="note-icon">🔒</span>
        <div>
          <strong>Security Note:</strong> Client private keys are stored in the state directory.
          Ensure <code>/usr/libexec/wg-autoconf/</code> has proper permissions (root:root, 700).
          Restrict access to the configs directory.
        </div>
      </div>

      <h2>Interactive Demo</h2>
      <p>Try server management commands in the terminal below:</p>

      <WikiCommandDemo
        title="Try Server Management Commands"
        commands={[
        'help',
        'server create',
        'server list',
        'server stats myserver',
        'server add myserver alice',
        'server add myserver bob',
        'server list',
        'server stats myserver',
        'server revoke myserver alice',
        'server remove myserver']
        }
        initialOutput={[
        {
          type: 'system',
          content: [
          '==================================================',
          'wg-autoconf Server Management Demo',
          '==================================================',
          'Try these server management commands:',
          '  server create      - Create a new WireGuard server',
          '  server list        - List all servers and clients',
          '  server stats       - Show detailed server statistics',
          '  server add         - Add a client to a server',
          '  server revoke      - Revoke client access',
          '  server remove      - Remove entire server',
          '',
          'Ready for your command.',
          '']

        }]
        } />
      

      <h2>Server Management Commands Reference</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>Command</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>server create</code></td>
            <td>Create a new WireGuard server (interactive)</td>
            <td><code>wg-autoconf server create</code></td>
          </tr>
          <tr>
            <td><code>server add &lt;server&gt; &lt;user&gt;</code></td>
            <td>Add a client to a server</td>
            <td><code>wg-autoconf server add myserver alice</code></td>
          </tr>
          <tr>
            <td><code>server revoke &lt;server&gt; &lt;user&gt;</code></td>
            <td>Revoke a client from a server</td>
            <td><code>wg-autoconf server revoke myserver alice</code></td>
          </tr>
          <tr>
            <td><code>server remove &lt;server&gt;</code></td>
            <td>Remove an entire server</td>
            <td><code>wg-autoconf server remove myserver</code></td>
          </tr>
          <tr>
            <td><code>server list</code></td>
            <td>List all servers and their clients</td>
            <td><code>wg-autoconf server list</code></td>
          </tr>
          <tr>
            <td><code>server stats &lt;server&gt;</code></td>
            <td>Show detailed server statistics</td>
            <td><code>wg-autoconf server stats myserver</code></td>
          </tr>
        </tbody>
      </table>

      <div className="wiki-note wiki-success">
        <span className="note-icon">✅</span>
        <div>
          <strong>Pro Tip:</strong> Use <code>wg-autoconf server list</code> as a quick
          health check for all your servers. Combine with <code>wg-autoconf status</code>
          for complete system overview.
        </div>
      </div>

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