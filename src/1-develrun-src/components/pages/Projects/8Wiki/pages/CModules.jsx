
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CModules = () => {
  return (
    <motion.div
      className="wiki-page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <h1>C Optimised Modules</h1>

      <p>
        wg-autoconf 1.0.0-r1 includes native C modules for performance-critical
        operations, providing up to <strong>1000x speed improvement</strong> over
        pure shell implementations.
      </p>

      <h2>Module Overview</h2>

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
            <td>1000x faster than shell</td>
          </tr>
          <tr>
            <td><code>wg-get_conf_value</code></td>
            <td>Parsing .conf files</td>
            <td>Optimised file reading</td>
          </tr>
          <tr>
            <td><code>wg-interface</code></td>
            <td>Interface control (up/down)</td>
            <td>Atomic operations, faster</td>
          </tr>
          <tr>
            <td><code>wg-route</code></td>
            <td>Routing management</td>
            <td>1000x speed improvement</td>
          </tr>
          <tr>
            <td><code>wg-setup</code></td>
            <td>Setup and removal</td>
            <td>Transaction-safe operations</td>
          </tr>
        </tbody>
      </table>

      <h2>Architecture</h2>

      <div className="code-block">
        <pre><code>{`┌─────────────────────────────────────────────────────────────────────┐
│                         C Module Integration                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Shell Call                                                         │
│      │                                                              │
│      ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  chandler.sh - C Handler Wrapper                             │   │
│  │  ┌─────────────────────────────────────────────────────────┐│   │
│  │  │  wg_c_validate_config()    → wg-validator              ││   │
│  │  │  wg_c_get_conf_value()     → wg-get_conf_value         ││   │
│  │  │  wg_c_activate_interface() → wg-interface up           ││   │
│  │  │  wg_c_deactivate_interface()→ wg-interface down        ││   │
│  │  │  wg_c_set_lan_routes()     → wg-route set              ││   │
│  │  │  wg_c_unset_lan_routes()   → wg-route unset            ││   │
│  │  │  wg_c_setup_wireguard()    → wg-setup                  ││   │
│  │  │  wg_c_remove_wireguard()   → wg-setup remove           ││   │
│  │  └─────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────┘   │
│      │                                                              │
│      ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  C Binary Execution                                          │   │
│  │  ├── Fast argument parsing                                   │   │
│  │  ├── Efficient file operations                               │   │
│  │  ├── System calls                                            │   │
│  │  └── Atomic operations                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘`}</code></pre>
      </div>

      <h2>Module Details</h2>

      <h3>1. wg-validator</h3>
      <p>Validates WireGuard configuration files and parameters:</p>
      <ul>
        <li>Private/Public key validation (base64, length 43-44)</li>
        <li>IP address and CIDR validation (IPv4/IPv6)</li>
        <li>Endpoint validation (hostname/IP + port)</li>
        <li>DNS validation</li>
        <li>Interface name validation</li>
      </ul>

      <div className="code-block">
        <pre><code>{`# Usage
wg-validator validate --type auto --field PrivateKey --value <key>
wg-validator validate --type manual --field Address --value 10.2.0.2/32

# Returns: 0 = valid, 1 = invalid`}</code></pre>
      </div>

      <h3>2. wg-get_conf_value</h3>
      <p>Efficiently extracts values from .conf files:</p>
      <ul>
        <li>Fast pattern matching</li>
        <li>Multiple output formats (raw, uci, conf)</li>
        <li>Direct value formatting</li>
      </ul>

      <div className="code-block">
        <pre><code>{`# Usage
wg-get_conf_value get --key PrivateKey --file /etc/wireguard/home.conf
wg-get_conf_value get --key DNS --format uci --value "1.1.1.1, 8.8.8.8"

# Output formats:
# raw  - Value as-is (trimmed)
# uci  - Comma-separated → space-separated
# conf - Comma-separated → ', '`}</code></pre>
      </div>

      <h3>3. wg-interface</h3>
      <p>Controls WireGuard interfaces:</p>
      <ul>
        <li>Atomic up/down operations</li>
        <li>State tracking</li>
        <li>Automatic retry with timeout</li>
      </ul>

      <div className="code-block">
        <pre><code>{`# Usage
wg-interface up wg_home
wg-interface down wg_home`}</code></pre>
      </div>

      <h3>4. wg-route</h3>
      <p>Manages routing tables and rules:</p>
      <ul>
        <li>Creates routing tables with unique IDs</li>
        <li>Adds IP rules with proper priorities</li>
        <li>Manages firewall rules and DNS redirects</li>
        <li>Atomic operations</li>
      </ul>

      <div className="code-block">
        <pre><code>{`# Usage
wg-route set wg_home lan3
wg-route unset wg_home lan3
wg-route show [wg_home]`}</code></pre>
      </div>

      <h3>5. wg-setup</h3>
      <p>Handles interface setup and removal:</p>
      <ul>
        <li>Creates UCI network configuration</li>
        <li>Sets up DHCP and firewall</li>
        <li>Manages state entries</li>
        <li>Atomic transactions</li>
      </ul>

      <div className="code-block">
        <pre><code>{`# Usage
wg-setup setup home
wg-setup setup home manual
wg-setup remove wg_home
wg-setup remove wg_home silent`}</code></pre>
      </div>

      <h2>Fallback System</h2>

      <p>
        If C binaries are not available, wg-autoconf automatically falls back
        to shell implementations:
      </p>

      <div className="code-block">
        <pre><code>{`# chandler.sh checks for C binaries
if [ -f "$WG_VALIDATOR_BIN" ] && [ -x "$WG_VALIDATOR_BIN" ]; then
    HAS_WG_VALIDATOR="yes"
else
    # Automatic fallback to shell functions
    HAS_WG_VALIDATOR="no"
fi

# Each C function has a shell fallback
wg_c_validate_config() {
    [ "$HAS_WG_VALIDATOR" != "yes" ] && return 1
    # ... C execution ...
}`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">⚡</span>
        <div>
          <strong>Performance Impact:</strong> The C modules provide a <strong>1000x</strong>
          performance improvement over pure shell implementations. This is particularly
          noticeable in validation, parsing, and routing operations.
        </div>
      </div>

      <div className="wiki-navigation-links">
        <Link to="/wiki/naming" className="nav-link prev">
          ← Naming Convention
        </Link>
        <Link to="/wiki/common-issues" className="nav-link next">
          Common Issues →
        </Link>
      </div>
    </motion.div>);

};

export default CModules;