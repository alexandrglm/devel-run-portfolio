
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const Troubleshooting = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Troubleshooting</h1>

      <p>
        Common issues and their solutions when using wg-autoconf.
        Each section includes diagnostic commands and fixes.
      </p>

      <h2>Interface Won't Come Up</h2>

      <h3>Symptoms</h3>
      <ul>
        <li>Interface fails to activate after <code>wg-autoconf up</code></li>
        <li>No output from <code>wg show</code></li>
        <li>Error messages in log</li>
      </ul>

      <h3>Diagnosis</h3>
      <div className="code-block">
        <pre><code>{`# Validate configuration
wg-autoconf test myconfig

# Enable debug and try again
wg-autoconf debug on
wg-autoconf up wg_myconfig --verbose
wg-autoconf debug show

# Check system logs
logread | grep wg-autoconf

# Check interface existence
ip link show wg_myconfig`}</code></pre>
      </div>

      <h3>Fixes</h3>
      <ul>
        <li>Check configuration syntax with <code>wg-autoconf test</code></li>
        <li>Verify interface name matches (wg_*)</li>
        <li>Check private key format</li>
        <li>Ensure WireGuard kernel module is loaded</li>
      </ul>

      <h2>Routes Configured But No Traffic</h2>

      <h3>Symptoms</h3>
      <ul>
        <li>Routes show in <code>wg-autoconf routes show</code></li>
        <li>But <code>ping -I wg_myconfig 8.8.8.8</code> fails</li>
        <li>No traffic through VPN</li>
      </ul>

      <h3>Diagnosis</h3>
      <div className="code-block">
        <pre><code>{`# Verify routing table exists
ip route show table _vpn_wg_myconfig_lan3

# Check IP rules
ip rule show

# Verify interface is UP
wg show wg_myconfig

# Check firewall zones
uci show firewall | grep wg_myconfig

# Check nftables rules
nft list chain inet fw4 accept_to_wg_myconfig`}</code></pre>
      </div>

      <h3>Fixes</h3>
      <ul>
        <li>Re-run <code>wg-autoconf routes set</code></li>
        <li>Check firewall logs</li>
        <li>Verify LAN interface exists and is up</li>
        <li>Check routing table IDs</li>
      </ul>

      <h2>Address Already In Use</h2>

      <h3>Symptoms</h3>
      <ul>
        <li>Setup fails with "Address already in use"</li>
        <li>Conflict with existing interface</li>
      </ul>

      <h3>Diagnosis</h3>
      <div className="code-block">
        <pre><code>{`# Find which interface has the IP
grep -r "10.2.0.2" /etc/config/network

# List all active interfaces
wg-autoconf status`}</code></pre>
      </div>

      <h3>Fixes</h3>
      <ul>
        <li>Use different IP in config file</li>
        <li>Remove conflicting interface</li>
        <li>Edit <code>/etc/wireguard/home.conf</code> and change Address</li>
        <li>Re-run <code>wg-autoconf setup home</code></li>
      </ul>

      <h2>DNS Issues on VPN</h2>

      <h3>Symptoms</h3>
      <ul>
        <li>IP connectivity works (<code>ping 8.8.8.8</code> works)</li>
        <li>DNS queries fail (<code>ping google.com</code> fails)</li>
      </ul>

      <h3>Diagnosis</h3>
      <div className="code-block">
        <pre><code>{`# Check if DNS set on interface
uci show network.wg_myconfig.dns

# Test with specific DNS
dig @1.1.1.1 google.com

# Check DNS redirect
uci show firewall | grep redirect | grep -i dns`}</code></pre>
      </div>

      <h3>Fixes</h3>
      <div className="code-block">
        <pre><code>{`# Set DNS explicitly
uci set network.wg_myconfig.dns='1.1.1.1 8.8.8.8'
uci commit network
ifup wg_myconfig

# Or globally in settings
wg-autoconf settings set dns "1.1.1.1, 8.8.8.8"`}</code></pre>
      </div>

      <h2>State File Corruption</h2>

      <h3>Symptoms</h3>
      <ul>
        <li>Commands fail with "state file not found"</li>
        <li>State reads don't work</li>
      </ul>

      <h3>Diagnosis</h3>
      <div className="code-block">
        <pre><code>{`# Check file permissions
ls -la /usr/libexec/wg-autoconf/states

# Check contents
head -20 /usr/libexec/wg-autoconf/states

# Validate key-value format
grep "^[A-Z_]*=" /usr/libexec/wg-autoconf/states | wc -l`}</code></pre>
      </div>

      <h3>Fixes</h3>
      <div className="code-block">
        <pre><code>{`# Reset state
rm -f /usr/libexec/wg-autoconf/states
wg-autoconf status  # Recreates empty state`}</code></pre>
      </div>

      <h2>Restore From Broken State</h2>

      <h3>Recovery Steps</h3>
      <div className="code-block">
        <pre><code>{`# View available backups
wg-autoconf backups show

# Restore latest
wg-autoconf backups restore

# If that fails, nuke and restart
wg-autoconf nuke

# Then re-setup
wg-autoconf setup home
wg-autoconf up wg_home
wg-autoconf routes set wg_home lan3`}</code></pre>
      </div>

      <h2>Debug Commands</h2>

      <div className="code-block">
        <pre><code>{`# Enable debug
wg-autoconf debug on

# Show debug log
wg-autoconf debug show

# Live tail
wg-autoconf debug live

# View state
wg-autoconf debug states

# View network config
wg-autoconf debug network

# View firewall config
wg-autoconf debug firewall

# View routing tables
wg-autoconf debug tables`}</code></pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">⚠️</span>
        <div>
          <strong>Last Resort:</strong> If all else fails, <code>wg-autoconf nuke</code>
          removes ALL configurations. Use with caution and always backup first.
        </div>
      </div>

      <WikiCommandDemo
      title="Try Troubleshooting Commands"
      commands={[
      'help',
      'debug on',
      'debug status',
      'debug show',
      'backups show',
      'status']} />



      <div className="wiki-navigation-links">
        <Link to="/wiki/state-machine" className="nav-link prev">
          ← State Machine
        </Link>
        <Link to="/wiki/file-locations" className="nav-link next">
          File Locations →
        </Link>
      </div>
    </motion.div>);

};

export default Troubleshooting;