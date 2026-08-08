
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Reference = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>File Locations Reference</h1>

      <h2>Configuration Files</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/etc/wireguard/*.conf</code></td>
            <td>WireGuard configuration files</td>
          </tr>
          <tr>
            <td><code>/etc/config/network</code></td>
            <td>Network interface configuration (UCI)</td>
          </tr>
          <tr>
            <td><code>/etc/config/firewall</code></td>
            <td>Firewall configuration (UCI)</td>
          </tr>
          <tr>
            <td><code>/etc/config/dhcp</code></td>
            <td>DHCP/DNS configuration (UCI)</td>
          </tr>
          <tr>
            <td><code>/etc/iproute2/rt_tables</code></td>
            <td>Routing tables configuration</td>
          </tr>
        </tbody>
      </table>

      <h2>Runtime Files</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/usr/libexec/wg-autoconf/states</code></td>
            <td>State machine file</td>
          </tr>
          <tr>
            <td><code>/usr/libexec/wg-autoconf/user_settings</code></td>
            <td>User configuration overrides</td>
          </tr>
          <tr>
            <td><code>/usr/libexec/wg-autoconf/debug/wg-autoconf.log</code></td>
            <td>Main debug log</td>
          </tr>
          <tr>
            <td><code>/usr/libexec/wg-autoconf/atomics/</code></td>
            <td>Atomic operation temporary files</td>
          </tr>
        </tbody>
      </table>

      <h2>C Optimised Modules</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Function</th>
            <th>Benefit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>wg-validator</code></td>
            <td>Configuration validation</td>
            <td>1000x faster</td>
          </tr>
          <tr>
            <td><code>wg-get_conf_value</code></td>
            <td>Parsing .conf files</td>
            <td>Optimised parsing</td>
          </tr>
          <tr>
            <td><code>wg-interface</code></td>
            <td>Interface control (up/down)</td>
            <td>Atomic operations</td>
          </tr>
          <tr>
            <td><code>wg-route</code></td>
            <td>Routing management</td>
            <td>High performance</td>
          </tr>
          <tr>
            <td><code>wg-setup</code></td>
            <td>Setup and removal</td>
            <td>Transaction-safe</td>
          </tr>
        </tbody>
      </table>

      <h2>Backup Files</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/etc/config/network.BACKUP_PRE_WIREGUARD</code></td>
            <td>Network config backup</td>
          </tr>
          <tr>
            <td><code>/etc/config/dhcp.BACKUP_PRE_WIREGUARD</code></td>
            <td>DHCP config backup</td>
          </tr>
          <tr>
            <td><code>/etc/config/firewall.BACKUP_PRE_WIREGUARD</code></td>
            <td>Firewall config backup</td>
          </tr>
        </tbody>
      </table>

      <h2>Service Files</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/etc/init.d/wg-autoconf_boot_cleanup</code></td>
            <td>Boot cleanup service</td>
          </tr>
        </tbody>
      </table>

      <h2>Directory Structure</h2>

      <div className="code-block">
        <pre><code>{`/usr/libexec/wg-autoconf/
├── states                                    # State machine file
├── user_settings                             # User configuration overrides
├── debug/                                    # Debug logs
│   └── wg-autoconf.log                      # Main debug log
├── atomics/                                  # Atomic operation temp files
├── lib/                                      # C optimised modules
│   ├── chandler.sh                          # C handler wrapper
│   ├── wg-validator                         # Configuration validator
│   ├── wg-get_conf_value                    # Config file parser
│   ├── wg-interface                         # Interface controller
│   ├── wg-route                             # Route manager
│   └── wg-setup                             # Setup/removal manager
└── configs/                                  # Generated server configs
    └── <server_name>/
        ├── server.conf                      # Server configuration
        ├── <client1>.conf                   # Client configuration
        └── <client2>.conf                   # Client configuration`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">📁</span>
        <div>
          <strong>Note:</strong> All file paths are relative to the OpenWrt root filesystem.
          Most files are in <code>/usr/libexec/wg-autoconf/</code> with configs in <code>/etc/</code>.
        </div>
      </div>

      <div className="wiki-navigation-links">
        <Link to="/wiki/common-issues" className="nav-link prev">
          ← Common Issues
        </Link>
        <Link to="/wiki/changelog" className="nav-link next">
          Changelog →
        </Link>
      </div>
    </motion.div>);

};

export default Reference;