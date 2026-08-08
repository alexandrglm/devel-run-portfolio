
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const UtilityCommands = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Utility Commands</h1>

      <p>
        Utility commands for managing backups, cleaning up configurations,
        and maintaining your WireGuard setup.
      </p>

      <h2>Backup Management</h2>

      <h3>wg-autoconf backups show</h3>
      <p>List all available configuration backups:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf backups show

# Output:
# ✅ network [VALID]
#   Path: /etc/config/network.BACKUP_PRE_WIREGUARD
#   Tag:  WG_AUTOCONF_BACKUP_1.0.0-r1_1708457600
#   Size: 2.3K | Date: Feb 22 14:30
# 
# ✅ dhcp [VALID]
#   Path: /etc/config/dhcp.BACKUP_PRE_WIREGUARD
#   Tag:  WG_AUTOCONF_BACKUP_1.0.0-r1_1708457600
#   Size: 1.8K | Date: Feb 22 14:30
# 
# ✅ firewall [VALID]
#   Path: /etc/config/firewall.BACKUP_PRE_WIREGUARD
#   Tag:  WG_AUTOCONF_BACKUP_1.0.0-r1_1708457600
#   Size: 3.2K | Date: Feb 22 14:30`}</code></pre>
      </div>

      <h3>wg-autoconf backups restore</h3>
      <p>Restore configuration from backups:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf backups restore

# Output:
# [OK] Restoring backup files...
# ✅ Restored network from backup
# ✅ Restored dhcp from backup
# ✅ Restored firewall from backup
# [OK] 3 file(s) restored successfully`}</code></pre>
      </div>

      <h3>wg-autoconf backups diag</h3>
      <p>Diagnose backup issues:</p>
      <div className="code-block">
        <pre><code>{`# Diagnose specific backup
wg-autoconf backups diag network

# Diagnose all backups
wg-autoconf backups diag

# Output shows:
# - File structure
# - Checksum comparison
# - Validation status`}</code></pre>
      </div>

      <h2>Cleanup Commands</h2>

      <h3>wg-autoconf clean</h3>
      <p>Interactive cleanup of WireGuard configurations:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf clean

# Output:
# Available WireGuard interfaces:
#   1) wg_home [10.2.0.2/32]
#   2) wg_work [10.3.0.5/32]
#   3) wg_office [10.4.0.10/32]
# 
# Choose an interface (or press Enter to cancel): 1
# 
# ==[ wg_home ]====================================
# Address: 10.2.0.2/32
# Endpoint: vpn.example.com:51820
# ==================================================
# 
# Proceed with cleanup? (y/N): y
# 
# [OK] Cleaning up wg_home...
# ✓ Routes unset: wg_home <-> lan3
# ✓ Interface down: wg_home
# ✓ Interface removed: wg_home
# [OK] Cleanup completed successfully!`}</code></pre>
      </div>

      <h3>wg-autoconf clean &lt;iface&gt;</h3>
      <p>Clean specific interface without interaction:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf clean wg_home

# Output:
# [OK] Cleaning up wg_home...
# ✓ Routes unset: wg_home <-> lan3
# ✓ Interface down: wg_home
# ✓ Interface removed: wg_home
# [OK] Cleanup completed successfully!`}</code></pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">⚠️</span>
        <div>
          <strong>Warning:</strong> <code>clean</code> removes all configurations for the
          specified interface. This includes routes, firewall rules, and state entries.
          Use with caution.
        </div>
      </div>

      <h2>Nuclear Option</h2>

      <h3>wg-autoconf nuke</h3>
      <p>Remove ALL WireGuard configurations (dangerous!):</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf nuke

# Output:
# [WARNING] This will remove ALL WireGuard configurations!
# 
# Interfaces to remove:
#   - wg_home
#   - wg_work
#   - wg_office
#   - wg_server_myserver
# 
# Are you absolutely certain? Type YES to confirm: YES
# 
# [OK] System completely nuked!
# All WireGuard interfaces, servers, routing tables, firewall zones removed.
# State file reset.
# Backup files cleaned.
# [OK] Nuke completed successfully!`}</code></pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">💀</span>
        <div>
          <strong>DANGER:</strong> <code>nuke</code> is the nuclear option. It removes
          EVERYTHING. No backups, no confirmation per interface. Only use this when
          you want to start fresh or as a last resort.
        </div>
      </div>

      <h2>Settings Management</h2>

      <h3>wg-autoconf settings show</h3>
      <p>Display current user settings:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf settings show

# Output:
# # wg-autoconf v1.0.0-r1 User Settings
# # This file overrides built-in defaults.
# 
# DEFAULT_DNS="1.1.1.1, 1.0.0.1"
# DEFAULT_PORT="51820"
# DEFAULT_ALLOW_IPS="0.0.0.0/0"
# DEFAULT_COLOURS="1"
# DEFAULT_VERBOSE="0"`}</code></pre>
      </div>

      <h3>wg-autoconf settings set &lt;key&gt; &lt;value&gt;</h3>
      <p>Change a setting:</p>
      <div className="code-block">
        <pre><code>{`# Change default DNS
wg-autoconf settings set dns "8.8.8.8, 8.8.4.4"

# Change default port
wg-autoconf settings set port 51821

# Disable colours
wg-autoconf settings set colours 0

# Enable verbose mode
wg-autoconf settings set verbose 1`}</code></pre>
      </div>

      <h3>wg-autoconf settings edit</h3>
      <p>Edit settings file directly:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf settings edit

# Opens $EDITOR (vi by default) with the settings file
# Edit and save to apply changes`}</code></pre>
      </div>

      <h3>wg-autoconf settings reset</h3>
      <p>Reset settings to defaults:</p>
      <div className="code-block">
        <pre><code>{`wg-autoconf settings reset
# [OK] Settings reset to defaults`}</code></pre>
      </div>

      <WikiCommandDemo
      title="Try Utility Commands"
      commands={[
      'help',
      'backups show',
      'settings show',
      'settings set dns 8.8.8.8',
      'clean wg_home']} />



      <div className="wiki-navigation-links">
        <Link to="/wiki/server-mgmt" className="nav-link prev">
          ← Server Management
        </Link>
        <Link to="/wiki/architecture" className="nav-link next">
          Architecture →
        </Link>
      </div>
    </motion.div>);

};

export default UtilityCommands;