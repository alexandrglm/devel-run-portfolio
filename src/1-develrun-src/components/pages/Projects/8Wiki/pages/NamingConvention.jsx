
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NamingConvention = () => {
  return (
    <motion.div
      className="wiki-page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <h1>Naming Convention</h1>

      <p>
        wg-autoconf uses a consistent naming convention across all components to
        ensure clarity, avoid conflicts, and enable dynamic management.
      </p>

      <h2>Design Principles</h2>

      <ol>
        <li>
          <strong>One name to rule them all:</strong> The interface name (<code>wg_*</code>)
          is the only identifier the user needs to remember
        </li>
        <li>
          <strong>Derived naming:</strong> All other names derive automatically from the
          interface name
        </li>
        <li>
          <strong>No device names:</strong> We work with interface names, not low-level
          device names
        </li>
        <li>
          <strong>Predictable patterns:</strong> Names follow predictable patterns for
          easy scripting and debugging
        </li>
        <li>
          <strong>Collision avoidance:</strong> Prefixes and suffixes prevent conflicts
          with system resources
        </li>
        <li>
          <strong>Self-documenting:</strong> Names describe their purpose
        </li>
      </ol>

      <h2>Interface Names</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>Mode</th>
            <th>Format</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Setup (Auto)</td>
            <td><code>wg_&lt;conf_filename&gt;</code></td>
            <td><code>wg_home</code>, <code>wg_work</code></td>
          </tr>
          <tr>
            <td>Manual</td>
            <td><code>wg&lt;any_name&gt;</code></td>
            <td><code>wg0</code>, <code>wgVPN1</code></td>
          </tr>
          <tr>
            <td>Server</td>
            <td><code>wg_server_&lt;name&gt;</code></td>
            <td><code>wg_server_myvpn</code></td>
          </tr>
        </tbody>
      </table>

      <h3>Rules</h3>
      <ul>
        <li>Lowercase, alphanumeric, underscores allowed</li>
        <li><strong>No hyphens</strong> (not allowed by WireGuard)</li>
        <li>Must start with <code>wg</code></li>
        <li>Cannot be just <code>wg</code></li>
        <li>Max 15 characters</li>
      </ul>

      <h2>Derived Names</h2>

      <div className="code-block">
        <pre><code>{`Interface:    wg_home
Interface ID: 1

Routing Table: _vpn_wg_home_lan3
Firewall Zone: wg_home
UCI Section:   network.wg_home
Peer Config:   wg_home_peer
Peer Name:     wg_home_phone`}</code></pre>
      </div>

      <h2>Routing Tables</h2>

      <div className="code-block">
        <pre><code>{`_vpn_<interface>_<lan_interface>

Examples:
  _vpn_wg_home_lan3
  _vpn_wg_work_br-lan
  _vpn_wg_server_myvpn_lan4`}</code></pre>
      </div>

      <h3>Naming Components</h3>
      <ul>
        <li><code>_vpn_</code> - Prefix indicating VPN routing</li>
        <li><code>&lt;interface&gt;</code> - WireGuard interface name</li>
        <li><code>&lt;lan_interface&gt;</code> - LAN interface being routed</li>
      </ul>

      <h2>IP Rule Priorities</h2>

      <div className="code-block">
        <pre><code>{`<table_id> × 10

Example: Table ID 150 → priority 1500

Rule Priorities:
  base:      Local traffic (SUBNET → SUBNET)
  base+1:    Outbound traffic (SUBNET → TABLE)
  base+3:    Return traffic (all → SUBNET)`}</code></pre>
      </div>

      <h3>Example with Table 150</h3>
      <div className="code-block">
        <pre><code>{`Priority 1500: from 192.168.3.0/24 to 192.168.3.0/24 lookup main
Priority 1501: from 192.168.3.0/24 lookup _vpn_wg_home_lan3
Priority 1503: from all to 192.168.3.0/24 lookup _vpn_wg_home_lan3`}</code></pre>
      </div>

      <h2>Firewall Zones</h2>

      <div className="code-block">
        <pre><code>{`wg_<interface>

Examples:
  wg_home
  wg_work
  wg_server_myvpn`}</code></pre>
      </div>

      <h2>Peer Names</h2>

      <div className="code-block">
        <pre><code>{`<interface>_<peer_identifier>

Examples:
  wg_home_phone
  wg_server_myvpn_alice
  wg_work_laptop`}</code></pre>
      </div>

      <h2>State File Entries</h2>

      <div className="code-block">
        <pre><code>{`ID_1_NAME=wg_home
ID_1_IS_CREATED=1
ID_1_IS_ACTIVE=1
ID_1_IS_RT_TABLES_IN_USE=1

ID_2_NAME=wg_work
ID_2_IS_CREATED=1
ID_2_IS_ACTIVE=0
ID_2_IS_RT_TABLES_IN_USE=0`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">💡</span>
        <div>
          <strong>Why This Convention?</strong>
          <ul>
            <li>Everything is predictable and discoverable</li>
            <li>No need to remember multiple names</li>
            <li>Scripting and automation become trivial</li>
            <li>Conflicts with system resources are avoided</li>
          </ul>
        </div>
      </div>

      <div className="wiki-navigation-links">
        <Link to="/wiki/architecture" className="nav-link prev">
          ← Architecture
        </Link>
        <Link to="/wiki/c-modules" className="nav-link next">
          C Modules →
        </Link>
      </div>
    </motion.div>);

};

export default NamingConvention;