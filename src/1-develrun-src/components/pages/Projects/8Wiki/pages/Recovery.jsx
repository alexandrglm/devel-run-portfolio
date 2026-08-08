
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const Recovery = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Recovery Procedures</h1>

      <p>
        Procedures for recovering from broken states, configuration corruption,
        and other disaster scenarios.
      </p>

      <h2>Backup Recovery</h2>

      <h3>View Available Backups</h3>
      <div className="code-block">
        <pre><code>{`wg-autoconf backups show

# Shows all available backups with validation status`}</code></pre>
      </div>

      <h3>Restore Latest Backups</h3>
      <div className="code-block">
        <pre><code>{`wg-autoconf backups restore

# Restores network, dhcp, and firewall from backups`}</code></pre>
      </div>

      <h3>Diagnose Backup Issues</h3>
      <div className="code-block">
        <pre><code>{`# Diagnose specific backup
wg-autoconf backups diag network

# Diagnose all backups
wg-autoconf backups diag

# Shows:
# - File structure
# - Checksum comparison
# - Validation status`}</code></pre>
      </div>

      <h2>State File Recovery</h2>

      <h3>Check State File</h3>
      <div className="code-block">
        <pre><code>{`# View state file
cat /usr/libexec/wg-autoconf/states

# Check permissions
ls -la /usr/libexec/wg-autoconf/states`}</code></pre>
      </div>

      <h3>Reset State File</h3>
      <div className="code-block">
        <pre><code>{`# Reset state (recreates on next command)
rm -f /usr/libexec/wg-autoconf/states
wg-autoconf status

# Or use nuke
wg-autoconf nuke`}</code></pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">⚠️</span>
        <div>
          <strong>Warning:</strong> Resetting the state file removes all tracking
          information for your interfaces. You will need to re-setup everything.
        </div>
      </div>

      <h2>Interface Recovery</h2>

      <h3>Clean Specific Interface</h3>
      <div className="code-block">
        <pre><code>{`# Clean and remove interface
wg-autoconf clean wg_home

# Or interactive cleanup
wg-autoconf clean`}</code></pre>
      </div>

      <h3>Recreate Interface</h3>
      <div className="code-block">
        <pre><code>{`# After cleaning, recreate
wg-autoconf setup home
wg-autoconf up wg_home
wg-autoconf routes set wg_home lan3`}</code></pre>
      </div>

      <h2>Nuclear Option</h2>

      <h3>Full System Reset</h3>
      <div className="code-block">
        <pre><code>{`wg-autoconf nuke

# Removes EVERYTHING:
# - All WireGuard interfaces
# - All routing tables
# - All firewall rules
# - State file
# - Backup files (valid ones)

# After nuke, start fresh:
wg-autoconf setup home
wg-autoconf up wg_home
wg-autoconf routes set wg_home lan3`}</code></pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">💀</span>
        <div>
          <strong>DANGER:</strong> <code>nuke</code> removes EVERYTHING. Only use
          this when you want to start completely fresh or as an absolute last resort.
        </div>
      </div>

      <h2>Manual Recovery</h2>

      <h3>Remove Orphaned Interfaces</h3>
      <div className="code-block">
        <pre><code>{`# List all WireGuard interfaces
ip link show | grep wg

# Remove orphaned interface
ip link delete wg_orphaned

# Check if any remain
wg show`}</code></pre>
      </div>

      <h3>Remove Orphaned Routing Tables</h3>
      <div className="code-block">
        <pre><code>{`# List routing tables
cat /etc/iproute2/rt_tables | grep _vpn_

# Remove orphaned table entry
# Edit /etc/iproute2/rt_tables manually

# Flush orphaned routes
ip route flush table _vpn_wg_orphaned_lan3

# Remove IP rules
ip rule del from 192.168.3.0/24 lookup _vpn_wg_orphaned_lan3`}</code></pre>
      </div>

      <h3>Remove Orphaned Firewall Rules</h3>
      <div className="code-block">
        <pre><code>{`# Check firewall zones
uci show firewall | grep wg_

# Remove orphaned zone
uci delete firewall.wg_orphaned
uci commit firewall
/etc/init.d/firewall reload`}</code></pre>
      </div>

      <h2>Recovery Checklist</h2>

      <ol>
        <li>
          <strong>Check backups:</strong>
          <code>wg-autoconf backups show</code>
        </li>
        <li>
          <strong>Restore if possible:</strong>
          <code>wg-autoconf backups restore</code>
        </li>
        <li>
          <strong>Check state file:</strong>
          <code>cat /usr/libexec/wg-autoconf/states</code>
        </li>
        <li>
          <strong>List interfaces:</strong>
          <code>wg-autoconf status</code>
        </li>
        <li>
          <strong>Check routes:</strong>
          <code>wg-autoconf routes show</code>
        </li>
        <li>
          <strong>Enable debug:</strong>
          <code>wg-autoconf debug on</code>
        </li>
        <li>
          <strong>Attempt recovery:</strong>
          <code>wg-autoconf clean &lt;iface&gt;</code>
        </li>
        <li>
          <strong>Nuclear option:</strong>
          <code>wg-autoconf nuke</code>
        </li>
        <li>
          <strong>Start fresh:</strong>
          Re-setup your interfaces
        </li>
      </ol>

      <div className="wiki-note">
        <span className="note-icon">💡</span>
        <div>
          <strong>Pro Tips:</strong>
          <ul>
            <li>Always keep regular backups with <code>wg-autoconf backups show</code></li>
            <li>Enable debug before making major changes: <code>wg-autoconf debug on</code></li>
            <li>Test changes in a non-production environment first</li>
            <li>Document your configuration for faster recovery</li>
          </ul>
        </div>
      </div>

      <WikiCommandDemo
      title="Try Recovery Commands"
      commands={[
      'help',
      'backups show',
      'backups restore',
      'status',
      'clean wg_home']} />



      <div className="wiki-navigation-links">
        <Link to="/wiki/debug" className="nav-link prev">
          ← Debug Commands
        </Link>
        <Link to="/wiki/file-locations" className="nav-link next">
          File Locations →
        </Link>
      </div>
    </motion.div>);

};

export default Recovery;