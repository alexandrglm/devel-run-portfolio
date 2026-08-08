
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GettingStarted = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>First Steps</h1>

      <p>
        After installation and initial setup, here are some common tasks you'll want to
        perform with wg-autoconf.
      </p>

      <h2>Checking Status</h2>
      <div className="code-block">
        <pre>
          <code>{`# Show all WireGuard interfaces
wg-autoconf status

# Show specific interface
wg-autoconf status wg_home`}</code>
        </pre>
      </div>

      <h2>Managing Interfaces</h2>
      <div className="code-block">
        <pre>
          <code>{`# List available .conf files
wg-autoconf list

# Test a configuration
wg-autoconf test myvpn

# Setup from .conf file
wg-autoconf setup myvpn

# Activate interface
wg-autoconf up wg_myvpn

# Deactivate interface
wg-autoconf down wg_myvpn

# Remove interface completely
wg-autoconf remove wg_myvpn`}</code>
        </pre>
      </div>

      <h2>Managing Routing</h2>
      <div className="code-block">
        <pre>
          <code>{`# Show all routes
wg-autoconf routes show

# Show routes for specific interface
wg-autoconf routes show wg_home

# Route LAN through VPN
wg-autoconf routes set wg_home lan3

# Remove routing
wg-autoconf routes unset wg_home lan3`}</code>
        </pre>
      </div>

      <h2>Configuration Management</h2>
      <div className="code-block">
        <pre>
          <code>{`# Show current settings
wg-autoconf settings show

# Change DNS default
wg-autoconf settings set dns "1.1.1.1, 8.8.8.8"

# Enable/disable colours
wg-autoconf settings set colours 1
wg-autoconf settings set colours 0

# Edit settings file directly
wg-autoconf settings edit`}</code>
        </pre>
      </div>

      <h2>Backup and Recovery</h2>
      <div className="code-block">
        <pre>
          <code>{`# Show available backups
wg-autoconf backups show

# Restore latest backups
wg-autoconf backups restore

# Diagnose backup issues
wg-autoconf backups diag network`}</code>
        </pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">💡</span>
        <div>
          <strong>Pro Tip:</strong> Always test your configuration with <code>wg-autoconf test</code>
          before setting up, and keep regular backups with <code>wg-autoconf backups show</code>
          to ensure you can recover from issues.
        </div>
      </div>

      <div className="wiki-navigation-links">
        <Link to="/wiki/quick-start" className="nav-link prev">
          ← Quick Start
        </Link>
        <Link to="/wiki/config-mgmt" className="nav-link next">
          Configuration Management →
        </Link>
      </div>
    </motion.div>);

};

export default GettingStarted;