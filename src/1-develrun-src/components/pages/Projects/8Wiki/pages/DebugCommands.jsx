
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const DebugCommands = () => {
  return (
    <motion.div
      className="wiki-page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <h1>Debug Commands</h1>

      <p>
        Debug commands help you troubleshoot issues with your WireGuard setup.
        They provide detailed logging, state inspection, and configuration viewing.
      </p>

      <h2>Debug Control</h2>

      <h3>wg-autoconf debug on</h3>
      <p>Enable debug logging:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug on

# Output:
# [OK] Debug logging enabled
# Debug Log: /usr/libexec/wg-autoconf/debug/wg-autoconf.log
# [OK] Debug activated!`}</code></pre>
      </div>

      <h3>wg-autoconf debug off</h3>
      <p>Disable debug logging:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug off

# Output:
# [OK] Debug logging disabled`}</code></pre>
      </div>

      <h3>wg-autoconf debug status</h3>
      <p>Check debug status:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug status

# Output:
# Status:           ACTIVE
# Log path/file:    /usr/libexec/wg-autoconf/debug/wg-autoconf.log
# Current log:      2.4K (156 lines)
# Old logs:         3 file(s)
#   wg-autoconf-OLD-1.log: 1.2K
#   wg-autoconf-OLD-2.log: 3.8K
#   wg-autoconf-OLD-3.log: 0.8K`}</code></pre>
      </div>

      <h2>View Debug Logs</h2>

      <h3>wg-autoconf debug show</h3>
      <p>Show the complete debug log:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug show

# Output:
# [2025-02-22 14:30:15] [SETUP] Starting interface setup for wg_home
# [2025-02-22 14:30:16] [STATE] Creating state entry ID_1_NAME=home
# [2025-02-22 14:30:17] [UCI] Adding network interface to /etc/config/network
# [2025-02-22 14:30:18] [FIREWALL] Creating firewall zone wg_home
# [2025-02-22 14:30:19] [ROUTES] Setting up routing table _vpn_wg_home_lan3
# [2025-02-22 14:30:20] [NFTABLES] Re-adding accept rules after firewall reload
# [2025-02-22 14:30:21] [SUCCESS] Interface wg_home setup complete`}</code></pre>
      </div>

      <h3>wg-autoconf debug live</h3>
      <p>Tail the debug log live (follow mode):</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug live

# Output:
# [TAIL] Following debug log live...
# Press Ctrl+C to exit.
# 
# [2025-02-22 14:35:20] [SERVER] Creating server: myserver
# [2025-02-22 14:35:21] [SERVER] Generated server keys
# [2025-02-22 14:35:22] [UCI] Adding server interface wg_server_myserver`}</code></pre>
      </div>

      <h3>wg-autoconf debug clear</h3>
      <p>Clear debug logs:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug clear

# Output:
# [WARNING] This action is destructive:
#   /usr/libexec/wg-autoconf/debug/wg-autoconf.log - Current log (2.4K)
#   /usr/libexec/wg-autoconf/debug/wg-autoconf-OLD-1.log - Old file (1.2K)
# Continue? (y/N): y
# [OK] Debug logs cleared!`}</code></pre>
      </div>

      <h2>Inspect Configuration</h2>

      <h3>wg-autoconf debug states</h3>
      <p>View the state machine file:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug states

# Output:
# IS_INSTALLED=1
# IS_FIRST_EXEC=0
# IS_PREV_TO_UPGRADE=0
# IS_UPGRADED=1
# 
# ID_1_NAME=wg_home
# ID_1_IS_CREATED=1
# ID_1_IS_ACTIVE=1
# ID_1_IS_RT_TABLES_IN_USE=1
# 
# ID_2_NAME=wg_work
# ID_2_IS_CREATED=1
# ID_2_IS_ACTIVE=1
# ID_2_IS_RT_TABLES_IN_USE=1`}</code></pre>
      </div>

      <h3>wg-autoconf debug network</h3>
      <p>View network configuration:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug network

# Output:
# config interface 'loopback'
#     option device 'lo'
#     option proto 'static'
#     option ipaddr '127.0.0.1'
#     option netmask '255.0.0.0'
# 
# config interface 'lan'
#     option device 'br-lan'
#     option proto 'static'
#     option ipaddr '192.168.1.1'
#     option netmask '255.255.255.0'
# 
# # wg-autoconf network start id 1
# config interface 'wg_home'
#     option proto 'wireguard'
#     option private_key 'uEcbqUV3DpqVgoE...'
#     option addresses '10.2.0.2/32'
#     option dns '1.1.1.1 1.0.0.1'
# # wg-autoconf network end id 1`}</code></pre>
      </div>

      <h3>wg-autoconf debug firewall</h3>
      <p>View firewall configuration:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug firewall

# Output:
# # wg-autoconf firewall start id 1
# config zone
#     option name 'wg_home'
#     option input 'ACCEPT'
#     option output 'ACCEPT'
#     option forward 'ACCEPT'
#     option masq '1'
#     list network 'wg_home'
# 
# config forwarding
#     option src 'lan3'
#     option dest 'wg_home'
# 
# config forwarding
#     option src 'wg_home'
#     option dest 'lan3'
# # wg-autoconf firewall end id 1`}</code></pre>
      </div>

      <h3>wg-autoconf debug tables</h3>
      <p>View routing tables:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug tables

# Output:
# 150 _vpn_wg_home_lan3
# 151 _vpn_wg_work_lan4`}</code></pre>
      </div>

      <h3>wg-autoconf debug backups</h3>
      <p>View backup files:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf debug backups

# Output:
# DATE:   Feb 22 14:30 - FILE: network.BACKUP_PRE_WIREGUARD
# DATE:   Feb 22 14:30 - FILE: dhcp.BACKUP_PRE_WIREGUARD
# DATE:   Feb 22 14:30 - FILE: firewall.BACKUP_PRE_WIREGUARD`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">🔍</span>
        <div>
          <strong>Debug Tips:</strong>
          <ul>
            <li>Enable debug before running a command to capture detailed logs</li>
            <li>Use <code>debug live</code> in a separate terminal to monitor operations</li>
            <li>Check <code>debug states</code> after operations to verify state changes</li>
            <li>Disable debug when not needed to reduce log file size</li>
          </ul>
        </div>
      </div>

      <WikiCommandDemo
        title="Try Debug Commands"
        commands={[
        'help',
        'debug status',
        'debug on',
        'debug show',
        'debug states',
        'debug network',
        'debug tables',
        'debug off']
        } />
      

      <div className="wiki-navigation-links">
        <Link to="/wiki/common-issues" className="nav-link prev">
          ← Common Issues
        </Link>
        <Link to="/wiki/recovery" className="nav-link next">
          Recovery →
        </Link>
      </div>
    </motion.div>);

};

export default DebugCommands;