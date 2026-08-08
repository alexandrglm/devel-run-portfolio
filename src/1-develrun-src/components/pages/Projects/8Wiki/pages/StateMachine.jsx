
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StateMachine = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>State Machine</h1>

      <p>
        The state machine is the heart of wg-autoconf. It persistently tracks the
        state of all WireGuard interfaces across reboots, upgrades, and operations.
      </p>

      <h2>State File</h2>

      <h3>Location</h3>
      <div className="code-block">
        <pre><code>/usr/libexec/wg-autoconf/states</code></pre>
      </div>

      <h3>Format</h3>
      <p>Key-value pairs, one per line:</p>
      <div className="code-block">
        <pre><code>{`# Global States
IS_INSTALLED=1              # Package installed
IS_FIRST_EXEC=1             # First execution after install/nuke
IS_PREV_TO_UPGRADE=0        # Pre-upgrade state flag
IS_UPGRADED=0               # Post-upgrade state flag

# Per-Interface States
ID_1_NAME=wg_home           # Interface name
ID_1_IS_CREATED=1           # Config created in UCI
ID_1_IS_ACTIVE=1            # Interface is up/running
ID_1_IS_RT_TABLES_IN_USE=1  # Routing tables configured

ID_2_NAME=wg_work
ID_2_IS_CREATED=1
ID_2_IS_ACTIVE=0
ID_2_IS_RT_TABLES_IN_USE=0`}</code></pre>
      </div>

      <h2>State Operations</h2>

      <h3>Read State</h3>
      <div className="code-block">
        <pre><code>{`# Read value
value=$(state_read "ID_1_NAME")
# Returns: wg_home

# Check existence
if state_read "ID_1_NAME" >/dev/null 2>&1; then
    # exists
fi`}</code></pre>
      </div>

      <h3>Write State</h3>
      <div className="code-block">
        <pre><code>{`# Write (creates or updates)
state_write "ID_1_NAME" "wg_home"
state_write "ID_1_IS_ACTIVE" "1"`}</code></pre>
      </div>

      <h3>Interface Management</h3>
      <div className="code-block">
        <pre><code>{`# Get interface ID from name
id=$(state_get_id "wg_home")
# Returns: 1

# Add interface to state
state_add_iface "wg_work"
# Returns: 2

# List all interfaces
state_list_ifaces
# Returns: "1:wg_home 2:wg_work"

# Remove interface from state
state_remove_iface "1"

# Reset entire state (nuke)
state_reset`}</code></pre>
      </div>

      <h2>Lifecycle States</h2>

      <h3>Interface Lifecycle</h3>
      <div className="code-block">
        <pre><code>{`┌─────────────┐
│   CREATED   │  ← wg-autoconf setup home
│  (setup)    │     ID_1_IS_CREATED=1
└─────────────┘
       │
       ▼
┌─────────────┐
│   ACTIVE    │  ← wg-autoconf up wg_home
│    (up)     │     ID_1_IS_ACTIVE=1
└─────────────┘
       │
       ▼
┌─────────────┐
│   ROUTED    │  ← wg-autoconf routes set wg_home lan3
│ (routes set)│     ID_1_IS_RT_TABLES_IN_USE=1
└─────────────┘
       │
       ▼
┌─────────────┐
│   REMOVED   │  ← wg-autoconf remove wg_home
│  (remove)   │     Interface entries removed from state
└─────────────┘`}</code></pre>
      </div>

      <h2>Atomic Operations</h2>

      <p>All state writes are atomic:</p>
      <div className="code-block">
        <pre><code>{`state_write() {
    # 1. Create unique temp file
    temp_file="\${ATOMIC_PATHS}/states.write.\${counter}.atomic"
    
    # 2. Read entire state file
    # 3. Find key and replace OR append
    # 4. Write to temp
    
    # 5. Verify temp is not empty (critical!)
    if [ ! -s "$temp_file" ]; then
        # Temp empty = write failed
        return 1
    fi
    
    # 6. Atomic move (mv is atomic on same filesystem)
    mv "$temp_file" "$STATE_FILE"
}`}</code></pre>
      </div>

      <div className="wiki-note wiki-success">
        <span className="note-icon">✅</span>
        <div>
          <strong>Why Atomic?</strong> Prevents corruption if write fails mid-operation
          (power loss, interrupt, crash).
        </div>
      </div>

      <h2>Global States</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>State</th>
            <th>Description</th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>IS_INSTALLED</code></td>
            <td>Package installed status</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
          <tr>
            <td><code>IS_FIRST_EXEC</code></td>
            <td>First execution after install/nuke</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
          <tr>
            <td><code>IS_PREV_TO_UPGRADE</code></td>
            <td>Pre-upgrade state flag</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
          <tr>
            <td><code>IS_UPGRADED</code></td>
            <td>Post-upgrade state flag</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Per-Interface States</h2>

      <table className="command-table">
        <thead>
          <tr>
            <th>State</th>
            <th>Description</th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>ID_N_NAME</code></td>
            <td>Interface name</td>
            <td><code>wg_*</code></td>
          </tr>
          <tr>
            <td><code>ID_N_IS_CREATED</code></td>
            <td>Config created in UCI</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
          <tr>
            <td><code>ID_N_IS_ACTIVE</code></td>
            <td>Interface is up/running</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
          <tr>
            <td><code>ID_N_IS_RT_TABLES_IN_USE</code></td>
            <td>Routing tables configured</td>
            <td><code>0</code> / <code>1</code></td>
          </tr>
        </tbody>
      </table>

      <div className="wiki-note">
        <span className="note-icon">📁</span>
        <div>
          <strong>State File Location:</strong>
          <code style={{ display: 'block', marginTop: '8px' }}>
            /usr/libexec/wg-autoconf/states
          </code>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            The state file is persisted across reboots and package upgrades.
            Never edit it manually unless you know what you're doing.
          </p>
        </div>
      </div>

      <div className="wiki-navigation-links">
        <Link to="/wiki/architecture" className="nav-link prev">
          ← Architecture
        </Link>
        <Link to="/wiki/common-issues" className="nav-link next">
          Common Issues →
        </Link>
      </div>
    </motion.div>);

};

export default StateMachine;