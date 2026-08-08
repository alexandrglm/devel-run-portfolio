
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const Installation = () => {
  return (
    <motion.div
      className="wiki-page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      
      <h1>Installation</h1>

      <h2>Requirements</h2>
      <ul>
        <li><strong>OpenWrt:</strong> 25.12+ with APK package manager</li>
        <li><strong>Kernel:</strong> WireGuard kernel module (<code>kmod-wireguard</code>)</li>
        <li><strong>Dependencies:</strong> <code>wireguard-tools</code>, <code>ip-full</code> or <code>ip-tiny</code></li>
        <li><strong>Architecture:</strong> x86_64, aarch64, armv7, or any OpenWrt-supported platform</li>
      </ul>

      <div className="wiki-note">
        <span className="note-icon">⚠️</span>
        <div>
          <strong>Important:</strong> wg-autoconf uses the new APK package format (Alpine Linux).
          Supported on OpenWrt 25.12+ with APK enabled.
        </div>
      </div>

      <h2>Method 1: APK Installation (Recommended)</h2>

      <h3>From Local APK File</h3>
      <div className="code-block">
        <pre>
          <code>{`# Add public key
cp wg-autoconf.rsa.pub /etc/apk/keys/

# Install package
apk update
apk add ./wg-autoconf-1.0.0-r1.apk

# Verify installation
wg-autoconf --help`}</code>
        </pre>
      </div>

      <h3>From OpenWrt Repository (when available)</h3>
      <div className="code-block">
        <pre>
          <code>{`# Add repository (if not already configured)
echo "https://github.com/alexandrglm/openwrt_wg-autoconf/packages" >> /etc/apk/repositories

# Update and install
apk update
apk add wg-autoconf`}</code>
        </pre>
      </div>

      <h2>Method 2: Build from Source</h2>

      <h3>Clone and Build</h3>
      <div className="code-block">
        <pre>
          <code>{`# Clone repository
git clone https://github.com/alexandrglm/openwrt_wg-autoconf
cd openwrt_wg-autoconf

# Build (requires abuild)
./0build.sh

# Install
apk add --allow-untrusted packages/wg-autoconf-*.apk`}</code>
        </pre>
      </div>

      <div className="wiki-note">
        <span className="note-icon">💡</span>
        <div>
          <strong>Pro Tip:</strong> The build script includes C optimised modules for 1000x performance improvement.
          Building from source ensures you get the latest features and optimisations.
        </div>
      </div>

      <h2>Post-Installation</h2>

      <h3>Verify Installation</h3>
      <div className="code-block">
        <pre>
          <code>{`# Check version
wg-autoconf --help

# Check dependencies
which wg
which ip
which uci

# Check kernel module
lsmod | grep wireguard`}</code>
        </pre>
      </div>

      <h3>Initial Configuration</h3>
      <p>wg-autoconf creates default user settings on first run:</p>
      <div className="code-block">
        <pre>
          <code>{`# View default settings
wg-autoconf settings show

# Customise settings (optional)
wg-autoconf settings set dns "1.1.1.1, 8.8.8.8"
wg-autoconf settings set colours 1`}</code>
        </pre>
      </div>

      <div className="wiki-command-demo">
        <WikiCommandDemo
          title="Try Installation Commands"
          commands={[
          'wg-autoconf --help',
          'wg-autoconf settings show']
          } />
        
      </div>

      <div className="wiki-navigation-links">
        <span className="nav-link disabled">← Previous</span>
        <Link to="/wiki/quick-start" className="nav-link next">
          Quick Start →
        </Link>
      </div>
    </motion.div>);

};

export default Installation;