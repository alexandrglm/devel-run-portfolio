
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const QuickStart = () => {
  return (
    <motion.div
      className="wiki-page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <h1>Quick Start</h1>

      <p>
        Get up and running with wg-autoconf in minutes. This guide will walk you through
        setting up your first WireGuard interface and routing traffic through it.
      </p>

      <h2>Step 1: Create Configuration File</h2>
      <p>Place your WireGuard .conf file in <code>/etc/wireguard/</code>:</p>
      <div className="code-block">
        <pre>
          <code>{`# /etc/wireguard/home.conf
[Interface]
PrivateKey = uEcbqUV3DpqVgoElw2EV/m00T0Jwj9173y2nhTjnMnQ=
Address = 10.2.0.2/32
DNS = 1.1.1.1, 1.0.0.1

[Peer]
PublicKey = X9DFBhm20MXz/f6H2uoApgNF+ZMmizfUXp0uW2XZiQ==
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = vpn.example.com:51820
PersistentKeepalive = 25`}</code>
        </pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">📝</span>
        <div>
          <strong>Configuration Tips:</strong>
          <ul>
            <li>Use <code>Address</code> from your VPN provider</li>
            <li><code>DNS</code> should be tunneled (use 1.1.1.1, 8.8.8.8, etc.)</li>
            <li><code>AllowedIPs: 0.0.0.0/0</code> routes all traffic through VPN</li>
          </ul>
        </div>
      </div>

      <h2>Step 2: Validate Configuration</h2>
      <div className="code-block">
        <pre>
          <code>{`# Test configuration file
wg-autoconf test home`}</code>
        </pre>
      </div>

      <h2>Step 3: Setup Interface</h2>
      <div className="code-block">
        <pre>
          <code>{`# Create interface from .conf file
wg-autoconf setup home`}</code>
        </pre>
      </div>

      <h2>Step 4: Activate Interface</h2>
      <div className="code-block">
        <pre>
          <code>{`# Bring interface up
wg-autoconf up wg_home

# Verify status
wg-autoconf status
wg show wg_home`}</code>
        </pre>
      </div>

      <h2>Step 5: Route Traffic</h2>
      <div className="code-block">
        <pre>
          <code>{`# Route LAN interface through VPN
wg-autoconf routes set wg_home lan3

# Verify routing
wg-autoconf routes show
ip route show table _vpn_wg_home_lan3`}</code>
        </pre>
      </div>

      <h2>Step 6: Test Your VPN</h2>
      <div className="code-block">
        <pre>
          <code>{`# Test connectivity via VPN interface
ping -I wg_home 8.8.8.8

# Check VPN IP
curl --interface wg_home ifconfig.me

# Trace route
traceroute -i wg_home openwrt.org`}</code>
        </pre>
      </div>

      <h2>Interactive Demo</h2>
      <p>Try the commands above in the terminal below to see how they work:</p>

      <WikiCommandDemo
        title="Interactive Quick Start Demo"
        commands={[
        'help',
        'list',
        'test home',
        'setup home',
        'up wg_home',
        'status',
        'routes set wg_home lan3',
        'routes show']
        }
        initialOutput={[
        {
          type: 'system',
          content: [
          '==================================================',
          'wg-autoconf Interactive Demo - Quick Start',
          '==================================================',
          'Try these commands to learn wg-autoconf:',
          '  help          - Show available commands',
          '  list          - List available .conf files',
          '  test home     - Test configuration',
          '  setup home    - Create interface',
          '  up wg_home    - Activate interface',
          '  status        - Check interface status',
          '  routes set    - Route LAN through VPN',
          '',
          'Ready for your command.',
          '']

        }]
        } />
      

      <div className="wiki-navigation-links">
        <Link to="/wiki/installation" className="nav-link prev">
          ← Installation
        </Link>
        <Link to="/wiki/first-steps" className="nav-link next">
          First Steps →
        </Link>
      </div>
    </motion.div>);

};

export default QuickStart;