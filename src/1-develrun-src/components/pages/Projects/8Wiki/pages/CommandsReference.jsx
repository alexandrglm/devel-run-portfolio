
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WikiCommandDemo from '../WikiCommandDemo';

const CommandsReference = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Commands Reference</h1>

      <p>
        Complete reference of all wg-autoconf commands. Each command is documented with
        usage examples and interactive demos.
      </p>

      <h2>Configuration Management</h2>

      <h3>wg-autoconf list</h3>
      <p>List all available WireGuard .conf files in <code>/etc/wireguard/</code></p>
      <div className="code-block">
        <pre><code>wg-autoconf list</code></pre>
      </div>

      <h3>wg-autoconf test &lt;name&gt;</h3>
      <p>Validate a configuration file before setup</p>
      <div className="code-block">
        <pre><code>wg-autoconf test home</code></pre>
      </div>

      <h3>wg-autoconf setup &lt;name&gt;</h3>
      <p>Create WireGuard interface from .conf file</p>
      <div className="code-block">
        <pre><code>wg-autoconf setup home</code></pre>
      </div>

      <h3>wg-autoconf manual</h3>
      <p>Interactive manual setup (prompts for all parameters)</p>
      <div className="code-block">
        <pre><code>wg-autoconf manual</code></pre>
      </div>

      <h3>wg-autoconf remove &lt;iface&gt;</h3>
      <p>Remove interface and clean up all configurations</p>
      <div className="code-block">
        <pre><code>wg-autoconf remove wg_home</code></pre>
      </div>

      <h2>Interface Control</h2>

      <h3>wg-autoconf status</h3>
      <p>Show all WireGuard interfaces and their status</p>
      <div className="code-block">
        <pre><code>wg-autoconf status</code></pre>
      </div>

      <h3>wg-autoconf status &lt;iface&gt;</h3>
      <p>Show detailed status of a specific interface</p>
      <div className="code-block">
        <pre><code>wg-autoconf status wg_home</code></pre>
      </div>

      <h3>wg-autoconf up &lt;iface&gt;</h3>
      <p>Activate a WireGuard interface</p>
      <div className="code-block">
        <pre><code>wg-autoconf up wg_home</code></pre>
      </div>

      <h3>wg-autoconf down &lt;iface&gt;</h3>
      <p>Deactivate a WireGuard interface</p>
      <div className="code-block">
        <pre><code>wg-autoconf down wg_home</code></pre>
      </div>

      <h2>Routing</h2>

      <h3>wg-autoconf routes show</h3>
      <p>Show all configured VPN routes</p>
      <div className="code-block">
        <pre><code>wg-autoconf routes show</code></pre>
      </div>

      <h3>wg-autoconf routes show &lt;iface&gt;</h3>
      <p>Show routes for a specific interface</p>
      <div className="code-block">
        <pre><code>wg-autoconf routes show wg_home</code></pre>
      </div>

      <h3>wg-autoconf routes set &lt;wg&gt; &lt;lan&gt;</h3>
      <p>Route a LAN interface through a VPN interface</p>
      <div className="code-block">
        <pre><code>wg-autoconf routes set wg_home lan3</code></pre>
      </div>

      <h3>wg-autoconf routes unset &lt;wg&gt; &lt;lan&gt;</h3>
      <p>Remove routing between LAN and VPN</p>
      <div className="code-block">
        <pre><code>wg-autoconf routes unset wg_home lan3</code></pre>
      </div>

      <h2>Server Management</h2>

      <h3>wg-autoconf server create</h3>
      <p>Create a WireGuard server (interactive)</p>
      <div className="code-block">
        <pre><code>wg-autoconf server create</code></pre>
      </div>

      <h3>wg-autoconf server add &lt;server&gt; &lt;user&gt;</h3>
      <p>Add a client to a WireGuard server</p>
      <div className="code-block">
        <pre><code>wg-autoconf server add myserver alice</code></pre>
      </div>

      <h3>wg-autoconf server revoke &lt;server&gt; &lt;user&gt;</h3>
      <p>Revoke a client from a WireGuard server</p>
      <div className="code-block">
        <pre><code>wg-autoconf server revoke myserver alice</code></pre>
      </div>

      <h3>wg-autoconf server remove &lt;server&gt;</h3>
      <p>Remove an entire WireGuard server</p>
      <div className="code-block">
        <pre><code>wg-autoconf server remove myserver</code></pre>
      </div>

      <h3>wg-autoconf server list</h3>
      <p>List all servers and their clients</p>
      <div className="code-block">
        <pre><code>wg-autoconf server list</code></pre>
      </div>

      <h3>wg-autoconf server stats &lt;server&gt;</h3>
      <p>Show server statistics</p>
      <div className="code-block">
        <pre><code>wg-autoconf server stats myserver</code></pre>
      </div>

      <h2>Utility Commands</h2>

      <h3>wg-autoconf backups show</h3>
      <p>List available configuration backups</p>
      <div className="code-block">
        <pre><code>wg-autoconf backups show</code></pre>
      </div>

      <h3>wg-autoconf backups restore</h3>
      <p>Restore configuration from backups</p>
      <div className="code-block">
        <pre><code>wg-autoconf backups restore</code></pre>
      </div>

      <h3>wg-autoconf clean</h3>
      <p>Interactive cleanup of WireGuard configurations</p>
      <div className="code-block">
        <pre><code>wg-autoconf clean</code></pre>
      </div>

      <h3>wg-autoconf clean &lt;iface&gt;</h3>
      <p>Clean specific interface</p>
      <div className="code-block">
        <pre><code>wg-autoconf clean wg_home</code></pre>
      </div>

      <h3>wg-autoconf nuke</h3>
      <p>Remove ALL WireGuard configurations (dangerous!)</p>
      <div className="code-block">
        <pre><code>wg-autoconf nuke</code></pre>
      </div>

      <div className="wiki-note wiki-warning">
        <span className="note-icon">⚠️</span>
        <div>
          <strong>Warning:</strong> <code>wg-autoconf nuke</code> removes ALL WireGuard
          configurations, routes, firewall rules, and state. Use with extreme caution!
        </div>
      </div>

      <WikiCommandDemo
      title="Try Commands Reference"
      commands={[
      'help',
      'list',
      'status',
      'routes show',
      'backups show',
      'settings show']} />



      <div className="wiki-navigation-links">
        <Link to="/wiki/first-steps" className="nav-link prev">
          ← First Steps
        </Link>
        <Link to="/wiki/interface-control" className="nav-link next">
          Interface Control →
        </Link>
      </div>
    </motion.div>);

};

export default CommandsReference;