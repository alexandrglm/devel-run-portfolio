
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Architecture = () => {
  return (
    <motion.div
      className="wiki-page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <h1>Architecture</h1>

      <p>
        wg-autoconf is built with a hybrid architecture combining Ash shell for
        flexibility and C for performance-critical operations.
      </p>

      <h2>System Overview</h2>

      <div className="code-block">
        <pre><code>{`┌─────────────────────────────────────────────────────────────────────┐
│                      wg-autoconf Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 CLI Interface (Shell)                        │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │  setup  │  │   up    │  │  routes │  │  server │      │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │               Core Shell Functions                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │  State  │  │  UCI    │  │  Route  │  │ Firewall│      │   │
│  │  │ Manager │  │ Manager │  │ Manager │  │ Manager │      │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  C Optimised Modules                         │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐   │   │
│  │  │  wg-validator │  │ wg-get_conf   │  │ wg-interface│   │   │
│  │  │               │  │    _value     │  │             │   │   │
│  │  └───────────────┘  └───────────────┘  └─────────────┘   │   │
│  │  ┌───────────────┐  ┌───────────────┐                     │   │
│  │  │   wg-route    │  │   wg-setup   │                     │   │
│  │  │               │  │              │                     │   │
│  │  └───────────────┘  └───────────────┘                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  System Layer                                │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │
│  │  │ WireGuard│  │  UCI    │  │ nftables│  │   ip    │      │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘`}</code></pre>
      </div>

      <h2>Core Design Principles</h2>

      <h3>1. Atomic Operations</h3>
      <p>Every configuration change is atomic, preventing corruption:</p>
      <div className="code-block">
        <pre><code>{`# Atomic write pattern
state_write() {
    # 1. Create temp file
    # 2. Read entire state file
    # 3. Modify in memory
    # 4. Write to temp
    # 5. Verify temp not empty
    # 6. Atomic move (mv is atomic)
    mv "$temp_file" "$STATE_FILE"
}`}</code></pre>
      </div>

      <h3>2. State Persistence</h3>
      <p>All interface states tracked across reboots:</p>
      <div className="code-block">
        <pre><code>{`# State file format
IS_INSTALLED=1
IS_FIRST_EXEC=1
IS_PREV_TO_UPGRADE=0
IS_UPGRADED=0

ID_1_NAME=wg_home
ID_1_IS_CREATED=1
ID_1_IS_ACTIVE=1
ID_1_IS_RT_TABLES_IN_USE=1`}</code></pre>
      </div>

      <h3>3. Safety First</h3>
      <p>Multiple validation layers and safe fallbacks:</p>
      <ul>
        <li>Configuration validation before setup</li>
        <li>Collision detection (IP addresses, interface names)</li>
        <li>Automatic backups before changes</li>
        <li>Atomic operations for all file modifications</li>
        <li>Safe fallbacks from C to Shell</li>
      </ul>

      <h3>4. Performance</h3>
      <p>C modules for critical operations (1000x speed improvement):</p>
      <ul>
        <li><code>wg-validator</code>: 1000x faster than shell validation</li>
        <li><code>wg-get_conf_value</code>: Optimised config parsing</li>
        <li><code>wg-interface</code>: Fast interface control</li>
        <li><code>wg-route</code>: High-speed routing operations</li>
        <li><code>wg-setup</code>: Transaction-safe setup/removal</li>
      </ul>

      <h2>Component Details</h2>

      <h3>State Machine</h3>
      <p>The state machine tracks each interface through its lifecycle:</p>
      <div className="code-block">
        <pre><code>{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CREATED   │ ──→ │   ACTIVE    │ ──→ │   ROUTED    │
│  (setup)    │     │    (up)     │     │ (routes set)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        │
       └────────────────────────────────────────┘
                        │
                        ▼
               ┌─────────────┐
               │   REMOVED   │
               │  (remove)   │
               └─────────────┘`}</code></pre>
      </div>

      <h3>File System Layout</h3>
      <div className="code-block">
        <pre><code>{`/usr/libexec/wg-autoconf/
├── states                         # State machine file
├── user_settings                  # User configuration overrides
├── debug/                         # Debug logs
├── atomics/                       # Atomic operation temp files
├── lib/                           # C optimised modules
│   ├── wg-validator              # Configuration validator
│   ├── wg-get_conf_value         # Config file parser
│   ├── wg-interface              # Interface controller
│   ├── wg-route                  # Route manager
│   └── wg-setup                  # Setup/removal manager
└── configs/                       # Generated server configs`}</code></pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">⚡</span>
        <div>
          <strong>Performance Impact:</strong> The C modules provide a 1000x
          performance improvement over pure shell implementations. This is
          particularly noticeable in validation, parsing, and routing operations.
        </div>
      </div>

      <div className="wiki-navigation-links">
        <Link to="/wiki/server-mgmt" className="nav-link prev">
          ← Server Management
        </Link>
        <Link to="/wiki/state-machine" className="nav-link next">
          State Machine →
        </Link>
      </div>
    </motion.div>);

};

export default Architecture;