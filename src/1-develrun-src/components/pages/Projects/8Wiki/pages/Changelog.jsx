
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Changelog = () => {
  return (
    <motion.div
    className="wiki-page-content"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>

      <h1>Changelog</h1>

      <p>
        Complete changelog for wg-autoconf. All versions, features, fixes,
        and improvements are documented here.
      </p>

      <h2>Version 1.0.0-r1</h2>

      <h3>Major Features</h3>
      <ul>
        <li>✅ Complete rewrite of the state machine system</li>
        <li>✅ C optimised modules for 1000x performance improvement</li>
        <li>✅ Full WireGuard server support with multiple clients</li>
        <li>✅ Policy-based routing with multiple interfaces</li>
        <li>✅ DNS redirect with automatic leak prevention</li>
        <li>✅ NFTables integration with automatic rule re-application</li>
      </ul>

      <h3>Session 16 - 2026-05-26</h3>
      <ul>
        <li>✅ Migrated most expensive functions to C</li>
        <li>✅ <code>validate_wg_config()</code> → <code>wg-validator.c</code></li>
        <li>✅ <code>get_conf_value()</code> → <code>wg-get_conf_value.c</code></li>
        <li>✅ <code>setup_wireguard()</code> → <code>wg-setup.c</code></li>
        <li>✅ <code>activate_interface()</code> → <code>wg-interface.c</code></li>
        <li>✅ <code>set_lan_routes()</code> → <code>wg-route.c</code></li>
        <li>✅ Fixed DNS redirect DNAT on <code>routes set</code></li>
      </ul>

      <h3>Session 15 - 2026-03-09</h3>
      <ul>
        <li>✅ Refactored NFT subsystem to proper include files</li>
        <li>✅ Added selective IP leak blocking</li>
        <li>✅ IPv6-only support</li>
        <li>✅ Dual-stack support</li>
        <li>✅ Proper IPv6 restoration on route removal</li>
      </ul>

      <h3>Session 14 - 2026-02-22</h3>
      <ul>
        <li>✅ Deeper staging and testing</li>
        <li>✅ Multiple error case testing</li>
        <li>✅ Complete documentation</li>
      </ul>

      <h3>Session 13 - 2026-02-19/21</h3>
      <ul>
        <li>✅ Multiple servers with multiple peer clients</li>
        <li>✅ Refactored fw4 and nft behaviour</li>
        <li>✅ Fixed NFT chain remnants</li>
        <li>✅ Fixed multiple WG clients with multiple routing</li>
        <li>✅ Removed non-mandatory atomic operations</li>
        <li>✅ Fixed disable colours setting</li>
      </ul>

      <h2>Version 0.0.1-r7</h2>

      <h3>Session 12 - 2026-02-16</h3>
      <ul>
        <li>✅ New colour functions</li>
        <li>✅ More detailed help/docs</li>
        <li>✅ User settings improvements</li>
      </ul>

      <h3>Session 11 - 2026-02-12/17</h3>
      <h4>Parser & Helpers</h4>
      <ul>
        <li>✅ User settings: Colours CLI, verbosity, defaults</li>
        <li>✅ Debug functions: show, live, tables, chains, nft</li>
        <li>✅ Fixed <code>get_uci_list()</code> parsing</li>
        <li>✅ Fixed <code>parse_endpoint()</code> with full IPv6 support</li>
        <li>✅ Re-written <code>process_allowed_ips()</code></li>
      </ul>

      <h4>State Machine & System</h4>
      <ul>
        <li>✅ Complete state management refactor</li>
        <li>✅ System capabilities detection</li>
      </ul>

      <h4>Setup/Remove, Up/Down</h4>
      <ul>
        <li>✅ Rewritten <code>activate_interface()</code></li>
        <li>✅ Fixed IP assignment</li>
        <li>✅ Proper peer cleanup</li>
        <li>✅ Routing table cleanup on deactivation</li>
      </ul>

      <h4>Routes, Rules, NFT</h4>
      <ul>
        <li>✅ Complete redesign of <code>set_lan_routes()</code></li>
        <li>✅ Added NFTables chain creation order</li>
        <li>✅ Proper return rules</li>
        <li>✅ Multi-interface routing with no conflicts</li>
      </ul>

      <h4>Cleanup & Nuke</h4>
      <ul>
        <li>✅ Complete overhaul of <code>cleanup()</code></li>
        <li>✅ Global cleanup for orphaned routing tables</li>
        <li>✅ Global cleanup for orphaned IP rules</li>
        <li>✅ Orphaned NFT chains removal</li>
        <li>✅ Fixed order of operations</li>
      </ul>

      <h4>Boot Cleanup & Lifecycles</h4>
      <ul>
        <li>✅ Updated boot cleanup script</li>
        <li>✅ Orphaned table detection</li>
      </ul>

      <h4>Bug Fixes</h4>
      <ul>
        <li>✅ Fixed DNS leakage detection</li>
        <li>✅ Corrected <code>allowed_ips</code> format for UCI</li>
        <li>✅ Fixed routing table persistence after nuke</li>
        <li>✅ Resolved IP rule orphanage</li>
        <li>✅ Fixed many REGEX-POSIX issues</li>
      </ul>

      <h2>Version 0.0.1-r6</h2>
      <ul>
        <li>✅ Refactored NFT subsystem</li>
        <li>✅ Selective IP leak blocking</li>
        <li>✅ IPv6 full routing support</li>
        <li>✅ Downgrade versions to rX format</li>
        <li>✅ Added flag-method for APK lifecycle</li>
        <li>✅ Refactored cleanup and nuke functions</li>
        <li>✅ Improved <code>list_configs</code> usability</li>
        <li>✅ Unified syntax for POSIX compliance</li>
        <li>✅ DNS resolver pre-checks</li>
        <li>✅ CLI-UI improvements</li>
      </ul>

      <h2>Version 0.0.0-r5</h2>
      <ul>
        <li>✅ Migrated APK build SDK to docker:alpine:latest</li>
        <li>✅ Added debugging capabilities</li>
        <li>✅ Fixed issues in APK lifecycle scripts</li>
        <li>✅ Improved backup and restore</li>
      </ul>

      <h2>Version 0.0.0-r4</h2>
      <ul>
        <li>✅ Fixed <code>unset_lan_routes()</code> logic</li>
        <li>✅ Improved verbosity mode</li>
        <li>✅ Moved APK lifecycle methods to dedicated scripts</li>
      </ul>

      <div className="wiki-navigation-links">
        <Link to="/wiki/file-locations" className="nav-link prev">
          ← File Locations
        </Link>
        <span className="nav-link disabled">End of Documentation →</span>
      </div>
    </motion.div>);

};

export default Changelog;