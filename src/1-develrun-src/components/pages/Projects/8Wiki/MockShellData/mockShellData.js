










export const MOCK_SHELL_DATA = {




  help: `wg-autoconf v1.0.0-r1 - WireGuard Automation Tool

USAGE:
  wg-autoconf <command> [options]

COMMANDS:
  Configuration Management:
    list                      List available .conf files
    test <name>               Validate configuration file
    setup <name>              Create interface from .conf file
    manual                    Interactive manual setup
    remove <iface>            Remove interface and clean up

  Interface Control:
    status                    Show all WireGuard interfaces
    status <iface>            Show specific interface details
    up <iface>                Activate interface
    down <iface>              Deactivate interface

  Routing:
    routes show               List all VPN routes
    routes show <iface>       Show routes for specific interface
    routes set <wg> <lan>     Route LAN through VPN
    routes unset <wg> <lan>   Remove routing

  Server Management:
    server create             Create WireGuard server
    server add <srv> <user>   Add client to server
    server revoke <srv> <user> Revoke client access
    server remove <srv>       Delete server completely
    server list               List servers and clients
    server stats <srv>        Show server statistics

  Utility:
    backups show              List available backups
    backups restore           Restore configuration backups
    clean                     Interactive cleanup
    clean <iface>             Clean specific interface
    nuke                      Remove ALL WireGuard configs
    settings show             Display current settings
    settings set <k> <v>      Change a setting
    debug on/off              Enable/disable debug logging
    debug show                View debug log
    debug live                Tail debug log live

EXAMPLES:
  wg-autoconf setup home
  wg-autoconf up wg_home
  wg-autoconf routes set wg_home lan3
  wg-autoconf server create`,





  list: `home.conf
work.conf
vpn_us.conf
server_main.conf
office.conf
backup.conf`,

  'test home': `[OK] Configuration file validation passed!

Configuration Details:
  Interface Name: wg_home
  PrivateKey:     ✓ Valid (44 chars)
  PublicKey:      ✓ Valid (44 chars)
  Address:        10.2.0.2/32 ✓ Valid
  Endpoint:       vpn.example.com:51820 ✓ Valid
  AllowedIPs:     0.0.0.0/0, ::/0 ✓ Valid
  DNS:            1.1.1.1, 1.0.0.1 ✓ Valid

✅ CONFIGURATION FILE IS VALID AND READY FOR USE!

You can now use: wg-autoconf setup home`,

  'test work': `[OK] Configuration file validation passed!

Configuration Details:
  Interface Name: wg_work
  PrivateKey:     ✓ Valid (44 chars)
  PublicKey:      ✓ Valid (44 chars)
  Address:        10.3.0.5/32 ✓ Valid
  Endpoint:       work-vpn.example.com:51821 ✓ Valid
  AllowedIPs:     0.0.0.0/0 ✓ Valid
  DNS:            8.8.8.8, 8.8.4.4 ✓ Valid

✅ CONFIGURATION FILE IS VALID AND READY FOR USE!

You can now use: wg-autoconf setup work`,

  'test invalid': `[ERROR] Configuration file validation failed!

Configuration Details:
  PrivateKey:     ✗ Invalid (length: 40, expected: 44)
  PublicKey:      ✗ Invalid (not valid base64)
  Address:        ✗ Missing CIDR notation
  DNS:            ✗ Invalid DNS format

❌ CONFIGURATION FILE HAS ERRORS!

Please fix the issues above before using this configuration.`,

  'setup home': `[OK] Interface wg_home created successfully!

Interface Details:
  Name:        wg_home
  Private Key: uEcbqUV3DpqVgoElw2EV/m00T0Jwj9173y2nhTjnMnQ= (hidden)
  Address:     10.2.0.2/32
  Endpoint:    vpn.example.com:51820
  DNS:         1.1.1.1, 1.0.0.1
  
Next Steps:
  1. Activate:  wg-autoconf up wg_home
  2. Route:     wg-autoconf routes set wg_home <lan_interface>
  3. Test:      ping -I wg_home 8.8.8.8

=== FINISH SETUP ===
1. ENABLE WG:         wg-autoconf up wg_home
2. VERIFY:            wg show wg_home
3. TEST WG:           ping -I wg_home 8.8.8.8`,

  'setup work': `[OK] Interface wg_work created successfully!

Interface Details:
  Name:        wg_work
  Private Key: xY7fGq3V5Drv9BnM2KjL8RsT6WpZ4QcA1EfH0UgN3Jk= (hidden)
  Address:     10.3.0.5/32
  Endpoint:    work-vpn.example.com:51821
  DNS:         8.8.8.8, 8.8.4.4
  
Next Steps:
  1. Activate:  wg-autoconf up wg_work
  2. Route:     wg-autoconf routes set wg_work <lan_interface>
  3. Test:      ping -I wg_work 8.8.8.8`,

  'setup office': `[OK] Interface wg_office created successfully!

Interface Details:
  Name:        wg_office
  Private Key: aB3cD5eF7gH9jK1lM3nP5rT7vW9xZ2bC4dE6fG8hJ= (hidden)
  Address:     10.4.0.10/32
  Endpoint:    office-vpn.example.com:51823
  DNS:         192.168.1.1, 8.8.8.8
  
Next Steps:
  1. Activate:  wg-autoconf up wg_office
  2. Route:     wg-autoconf routes set wg_office <lan_interface>
  3. Test:      ping -I wg_office 8.8.8.8`,

  'manual': `[INTERACTIVE MANUAL SETUP]

1. WIREGUARD INTERFACE NAME (must start with 'wg')
Enter interface name (default: wg0): wg_manual

2. WIREGUARD KEYS
Enter PRIVATE key: [hidden input]
Enter PUBLIC key: [hidden input]

3. LOCAL ADDRESS
Enter local IP address (e.g., 10.2.0.2/32): 10.5.0.2/32

4. ENDPOINT
Enter endpoint host (IP or domain): vpn.example.com
Enter endpoint port (default: 51820): 51820

5. ALLOWED IPs
Enter allowed IPs (comma-separated): 0.0.0.0/0, ::/0

6. DNS SERVERS
Enter DNS servers: 1.1.1.1, 1.0.0.1

7. SAVE WIREGUARD CONFIGURATION FILE
Save config as .conf file? (y/N): y
Enter config filename: manual-1708457600

[OK] Configuration saved to: /etc/wireguard/manual-1708457600.conf
[OK] Interface wg_manual created successfully!`,

  'remove wg_home': `[OK] Removing wg_home...

✓ Interface deactivated
✓ Network config removed
✓ DHCP config removed
✓ Firewall config removed
✓ Routing tables cleaned
✓ State entries cleared

[OK] wg_home removed successfully!`,

  'remove wg_work': `[OK] Removing wg_work...

✓ Interface deactivated
✓ Network config removed
✓ DHCP config removed
✓ Firewall config removed
✓ Routing tables cleaned
✓ State entries cleared

[OK] wg_work removed successfully!`,





  status: `==[ WireGuard Status ]====================================

==[ wg_home (CREATED, UP, ROUTED) ]======
  Local:      10.2.0.2/32
  Endpoint:   vpn.example.com:51820
  Transfer:   102.3 KiB received, 45.2 KiB sent
  Routes:     lan3  (via _vpn_wg_home_lan3)
  Status:     ◆ Connected
  Backups:    Valid (network, dhcp, firewall)

==[ wg_work (CREATED, UP) ]==============
  Local:      10.3.0.5/32
  Endpoint:   work-vpn.example.com:51821
  Transfer:   256.7 KiB received, 128.4 KiB sent
  Status:     ◆ Connected
  Backups:    Valid (network, dhcp, firewall)

==[ wg_office (CREATED, DOWN) ]==========
  Local:      10.4.0.10/32
  Status:     ○ Interface configured but not active
  Backups:    Valid (network, dhcp, firewall)

==[ wg_server_myserver (CREATED, UP) ]====
  Local:      10.99.0.1/24
  Status:     ◆ Connected (Server Mode)
  Clients:    2 connected
  Backups:    Valid (network, dhcp, firewall)`,

  'status wg_home': `==[ wg_home Status ]====================================
Local:           10.2.0.2/32
Endpoint:        vpn.example.com:51820
Listening Port:  51820
Public Key:      X9DFBhm20MXz/f6H2uoApgNF+ZMmizfUXp0uW2XZiQ==
Transfer:        102.3 KiB received
                 45.2 KiB sent
Last Handshake:  3 seconds ago
Routes:          0.0.0.0/0
DNS:             1.1.1.1, 1.0.0.1
Status:          ◆ Connected and Active
Created:         2025-02-22 14:30:15

Routes Configured:
  lan3: _vpn_wg_home_lan3 (ID: 150)
  Priority: 1500, 1501, 1503`,

  'status wg_work': `==[ wg_work Status ]====================================
Local:           10.3.0.5/32
Endpoint:        work-vpn.example.com:51821
Listening Port:  51821
Public Key:      Y8ECgHm31NYu/g7I3vpBqHOF+ZMmizfUXp0uW2XZiQ==
Transfer:        256.7 KiB received
                 128.4 KiB sent
Last Handshake:  12 seconds ago
Routes:          0.0.0.0/0
DNS:             8.8.8.8, 8.8.4.4
Status:          ◆ Connected and Active
Created:         2025-02-22 15:45:20

Routes Configured:
  lan4: _vpn_wg_work_lan4 (ID: 151)
  Priority: 1510, 1511, 1513`,

  'up wg_home': `[OK] Interface wg_home activated successfully!

Status: ◆ Connected
Transfer: 0 B received, 0 B sent
Last Handshake: Just now

You can now use this interface for VPN traffic.
Now you can set up routes if needed!`,

  'up wg_work': `[OK] Interface wg_work activated successfully!

Status: ◆ Connected
Transfer: 0 B received, 0 B sent
Last Handshake: Just now

You can now use this interface for VPN traffic.
Now you can set up routes if needed!`,

  'up wg_office': `[OK] Interface wg_office activated successfully!

Status: ◆ Connected
Transfer: 0 B received, 0 B sent
Last Handshake: Just now

You can now use this interface for VPN traffic.
Now you can set up routes if needed!`,

  'down wg_home': `[OK] Interface wg_home deactivated.

All routes and firewall rules have been removed.
Use 'up' to reactivate.

Interface wg_home disabled!`,

  'down wg_work': `[OK] Interface wg_work deactivated.

All routes and firewall rules have been removed.
Use 'up' to reactivate.

Interface wg_work disabled!`,





  'routes show': `==[ WireGuard Routes ]====================================

_vpn_wg_home_lan3 (ID: 150):
  Rule: 1500: from 192.168.3.0/24 to 192.168.3.0/24 lookup main
  Rule: 1501: from 192.168.3.0/24 lookup _vpn_wg_home_lan3
  Rule: 1503: from all to 192.168.3.0/24 lookup _vpn_wg_home_lan3
  Route: 192.168.3.0/24 dev lan3 table _vpn_wg_home_lan3
  Route: default dev wg_home table _vpn_wg_home_lan3

_vpn_wg_work_lan4 (ID: 151):
  Rule: 1510: from 192.168.4.0/24 to 192.168.4.0/24 lookup main
  Rule: 1511: from 192.168.4.0/24 lookup _vpn_wg_work_lan4
  Rule: 1513: from all to 192.168.4.0/24 lookup _vpn_wg_work_lan4
  Route: 192.168.4.0/24 dev lan4 table _vpn_wg_work_lan4
  Route: default dev wg_work table _vpn_wg_work_lan4`,

  'routes show wg_home': `==[ Routes for wg_home ]===============================

_vpn_wg_home_lan3 (ID: 150):
  Rule: 1500: from 192.168.3.0/24 to 192.168.3.0/24 lookup main
  Rule: 1501: from 192.168.3.0/24 lookup _vpn_wg_home_lan3
  Rule: 1503: from all to 192.168.3.0/24 lookup _vpn_wg_home_lan3
  Route: 192.168.3.0/24 dev lan3 table _vpn_wg_home_lan3
  Route: default dev wg_home table _vpn_wg_home_lan3`,

  'routes set wg_home lan3': `[OK] Routes configured successfully!

Configuration Details:
  Routing Table:  _vpn_wg_home_lan3 (ID: 150)
  Source:         lan3 (192.168.3.0/24)
  Gateway:        wg_home
  Priority:       1500, 1501, 1503
  
Firewall Zone:    wg_home (created)
Forwarding:       lan3 ↔ wg_home (bidirectional)
DNS Redirect:     lan3:53 → 10.2.0.1:53

Traffic from lan3 will now route through wg_home VPN.

[OK] Routes configured successfully!`,

  'routes set wg_work lan4': `[OK] Routes configured successfully!

Configuration Details:
  Routing Table:  _vpn_wg_work_lan4 (ID: 151)
  Source:         lan4 (192.168.4.0/24)
  Gateway:        wg_work
  Priority:       1510, 1511, 1513
  
Firewall Zone:    wg_work (created)
Forwarding:       lan4 ↔ wg_work (bidirectional)
DNS Redirect:     lan4:53 → 10.3.0.1:53

Traffic from lan4 will now route through wg_work VPN.

[OK] Routes configured successfully!`,

  'routes set wg_home lan4': `[ERROR] 'lan4' is already routed to another WireGuard interface!

Currently routed to: wg_work
Please use another destination interface, or unset the existing route first.

To view all routes: wg-autoconf routes show`,

  'routes unset wg_home lan3': `[OK] Routes removed successfully!

Routing table _vpn_wg_home_lan3 cleaned.
Firewall rules updated.
IP rules flushed.
DNS Redirect removed.

lan3 traffic will use default gateway.

lan3 routes (via wg_home) successfully removed!`,

  'routes unset wg_work lan4': `[OK] Routes removed successfully!

Routing table _vpn_wg_work_lan4 cleaned.
Firewall rules updated.
IP rules flushed.
DNS Redirect removed.

lan4 traffic will use default gateway.

lan4 routes (via wg_work) successfully removed!`,





  'server create': `[INTERACTIVE SERVER SETUP]

Server name: myserver
Subnet [10.99.0.0/24]: 
DNS [10.99.0.1]: 
Listen port [51820]: 
Endpoint [vpn.example.com]: 

[OK] Server wg_server_myserver created!

Server Public Key: GHyXLa7n1gGPN/LJfxbh7EKz92ilepSDzk7jEz5l7DE=
Subnet: 10.99.0.0/24
DNS: 10.99.0.1
Listen Port: 51820
Endpoint: vpn.example.com

Config Directory: /usr/libexec/wg-autoconf/configs/myserver/

Ready to add clients:
  wg-autoconf server add myserver <username>`,

  'server list': `==[ Active WireGuard Servers ]=========================

Server: myserver
  Subnet: 10.99.0.0/24
  Listen Port: 51820
  Endpoint: vpn.example.com
  Clients: 2
    - alice (10.99.0.2) - Last HS: 5 seconds ago
    - bob (10.99.0.3) - Last HS: 2 minutes ago

Server: enterprise
  Subnet: 10.98.0.0/24
  Listen Port: 51821
  Endpoint: enterprise-vpn.example.com
  Clients: 3
    - emp_user1 (10.98.0.2) - Last HS: 1 minute ago
    - emp_user2 (10.98.0.3) - Last HS: 3 minutes ago
    - emp_user3 (10.98.0.4) - Last HS: 15 minutes ago`,

  'server stats myserver': `==[ Server: myserver Statistics ]=======================

Server Info:
  Public Key:      GHyXLa7n1gGPN/LJfxbh7EKz92ilepSDzk7jEz5l7DE=
  Subnet:          10.99.0.0/24
  Listen Port:     51820
  Endpoint:        vpn.example.com
  Total Clients:   2
  Active:          2

Clients:
  [1] alice
      IP:          10.99.0.2
      Status:      ◆ Connected
      Last HS:     5 seconds ago
      RX:          12.4 KiB
      TX:          8.2 KiB
      
  [2] bob
      IP:          10.99.0.3
      Status:      ◆ Connected
      Last HS:     2 minutes ago
      RX:          45.7 KiB
      TX:          23.1 KiB
      
Total Transfer:    57.1 KiB received, 31.3 KiB sent`,

  'server stats enterprise': `==[ Server: enterprise Statistics ]=====================

Server Info:
  Public Key:      R4FXCg0L2m2hHNO/JKfxbh7EKz92ilepSDzk7jEz5l7DE=
  Subnet:          10.98.0.0/24
  Listen Port:     51821
  Endpoint:        enterprise-vpn.example.com
  Total Clients:   3
  Active:          3

Clients:
  [1] emp_user1
      IP:          10.98.0.2
      Status:      ◆ Connected
      Last HS:     1 minute ago
      RX:          234.6 KiB
      TX:          112.3 KiB
      
  [2] emp_user2
      IP:          10.98.0.3
      Status:      ◆ Connected
      Last HS:     3 minutes ago
      RX:          89.4 KiB
      TX:          45.7 KiB
      
  [3] emp_user3
      IP:          10.98.0.4
      Status:      ◆ Connected
      Last HS:     15 minutes ago
      RX:          12.8 KiB
      TX:          6.1 KiB
      
Total Transfer:    336.8 KiB received, 164.1 KiB sent`,

  'server add myserver alice': `[OK] User 'alice' added to server 'myserver'

User Details:
  Name:          alice
  IP:            10.99.0.2
  Public Key:    /BjQMhFdwD410zqUE4hVgM1OJOpPVeKahjzKtXz3Wmk=
  Created:       2025-02-22 14:35:20
  
Config File:   /usr/libexec/wg-autoconf/configs/myserver/alice.conf
Status:        Ready to export

Export this .conf file to client device and import in WireGuard app.`,

  'server add myserver bob': `[OK] User 'bob' added to server 'myserver'

User Details:
  Name:          bob
  IP:            10.99.0.3
  Public Key:    aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789/abcdef=
  Created:       2025-02-22 14:36:45
  
Config File:   /usr/libexec/wg-autoconf/configs/myserver/bob.conf
Status:        Ready to export

Export this .conf file to client device and import in WireGuard app.`,

  'server add myserver charlie': `[OK] User 'charlie' added to server 'myserver'

User Details:
  Name:          charlie
  IP:            10.99.0.4
  Public Key:    zYxWvUtSrQpOnMlKjIhGfEdCbA0987654321/zyxwvu=
  Created:       2025-02-22 14:38:10
  
Config File:   /usr/libexec/wg-autoconf/configs/myserver/charlie.conf
Status:        Ready to export

Export this .conf file to client device and import in WireGuard app.`,

  'server revoke myserver alice': `[CONFIRM] Are you sure you want to revoke user 'alice'? (yes/no): yes

[OK] User 'alice' revoked from server 'myserver'

Actions taken:
  ✓ Removed peer from wg_server_myserver
  ✓ Deleted config: /usr/libexec/wg-autoconf/configs/myserver/alice.conf
  ✓ Updated state machine
  
Client alice can no longer connect.`,

  'server remove myserver': `[CONFIRM] Are you sure you want to remove server 'myserver' completely? (yes/no): yes

[OK] Server 'myserver' removed completely

Actions taken:
  ✓ Revoked all 2 clients (no confirmation per client)
  ✓ Removed UCI interface wg_server_myserver
  ✓ Removed firewall zone
  ✓ Flushed routing tables
  ✓ Deleted /usr/libexec/wg-autoconf/configs/myserver/
  ✓ Cleared state entries
  
Server and all configurations removed.`,





  'backups show': `Available backup files:

✅ network [VALID]
  Path: /etc/config/network.BACKUP_PRE_WIREGUARD
  Tag:  WG_AUTOCONF_BACKUP_1.0.0-r1_1708457600
  Size: 2.3K | Date: Feb 22 14:30

✅ dhcp [VALID]
  Path: /etc/config/dhcp.BACKUP_PRE_WIREGUARD
  Tag:  WG_AUTOCONF_BACKUP_1.0.0-r1_1708457600
  Size: 1.8K | Date: Feb 22 14:30

✅ firewall [VALID]
  Path: /etc/config/firewall.BACKUP_PRE_WIREGUARD
  Tag:  WG_AUTOCONF_BACKUP_1.0.0-r1_1708457600
  Size: 3.2K | Date: Feb 22 14:30

[OK] 3 backup files found (all valid)`,

  'backups restore': `[OK] Restoring backup files...

✅ Restored network from backup
✅ Restored dhcp from backup
✅ Restored firewall from backup

[OK] 3 file(s) restored successfully

Configuration restored from backups.`,

  'clean': `[INTERACTIVE CLEANUP]

Available WireGuard interfaces:
  1) wg_home [10.2.0.2/32]
  2) wg_work [10.3.0.5/32]
  3) wg_office [10.4.0.10/32]
  4) wg_server_myserver [10.99.0.1/24]

Choose an interface (or press Enter to cancel): 1

==[ wg_home ]====================================
Address: 10.2.0.2/32
Endpoint: vpn.example.com:51820
==================================================

Proceed with cleanup? (y/N): y

[OK] Cleaning up wg_home...
✓ Routes unset: wg_home <-> lan3
✓ Interface down: wg_home
✓ Interface removed: wg_home

[OK] Cleanup completed successfully!`,

  'clean wg_home': `[OK] Cleaning up wg_home...

✓ Routes unset: wg_home <-> lan3
✓ Interface down: wg_home
✓ Interface removed: wg_home

[OK] Cleanup completed successfully!`,

  'nuke': `[WARNING] This will remove ALL WireGuard configurations!

Interfaces to remove:
  - wg_home
  - wg_work
  - wg_office
  - wg_server_myserver
  - wg_server_enterprise

Servers to remove:
  - myserver (2 clients)
  - enterprise (3 clients)

Are you absolutely certain? Type YES to confirm: YES

[OK] System completely nuked!

All WireGuard interfaces, servers, routing tables, firewall zones removed.
State file reset.
Backup files cleaned.

[OK] Nuke completed successfully!`,





  'settings show': `# wg-autoconf v1.0.0-r1 User Settings
# This file overrides built-in defaults.
# Use: wg-autoconf settings set <key> <value>

DEFAULT_DNS="1.1.1.1, 1.0.0.1"
DEFAULT_PORT="51820"
DEFAULT_ALLOW_IPS="0.0.0.0/0"
DEFAULT_COLOURS="1"
DEFAULT_VERBOSE="0"`,

  'settings set dns 8.8.8.8': `[OK] Setting updated: DEFAULT_DNS="8.8.8.8"

Changes will apply to new interfaces created.
Existing interfaces keep their current DNS.`,

  'settings set colours 0': `[OK] Setting updated: DEFAULT_COLOURS="0"

CLI colours disabled. Restart your session to apply changes.`,

  'settings set colours 1': `[OK] Setting updated: DEFAULT_COLOURS="1"

CLI colours enabled. Restart your session to apply changes.`,





  'debug on': `[OK] Debug logging enabled

Debug Log: /usr/libexec/wg-autoconf/debug/wg-autoconf.log

View debug log:
  wg-autoconf debug show
  wg-autoconf debug live (tail)

[OK] Debug activated!`,

  'debug off': `[OK] Debug logging disabled

Debug mode deactivated.`,

  'debug status': `=== DEBUG STATUS ===

Status:           ACTIVE
Log path/file:    /usr/libexec/wg-autoconf/debug/wg-autoconf.log

Current log:      2.4K (156 lines)
Old logs:         3 file(s)
  wg-autoconf-OLD-1.log: 1.2K
  wg-autoconf-OLD-2.log: 3.8K
  wg-autoconf-OLD-3.log: 0.8K

=== DEBUG STATUS ===`,

  'debug show': `[2025-02-22 14:30:15] [SETUP] Starting interface setup for wg_home
[2025-02-22 14:30:16] [STATE] Creating state entry ID_1_NAME=home
[2025-02-22 14:30:17] [UCI] Adding network interface to /etc/config/network
[2025-02-22 14:30:18] [FIREWALL] Creating firewall zone wg_home
[2025-02-22 14:30:19] [ROUTES] Setting up routing table _vpn_wg_home_lan3
[2025-02-22 14:30:20] [NFTABLES] Re-adding accept rules after firewall reload
[2025-02-22 14:30:21] [SUCCESS] Interface wg_home setup complete
[2025-02-22 14:30:25] [UP] Activating interface: wg_home
[2025-02-22 14:30:26] [UP] ifup succeeded, waiting for interface...
[2025-02-22 14:30:27] [UP] Interface appeared after 1 attempts
[2025-02-22 14:30:27] [STATE] Updated: ID_1_IS_ACTIVE=1
[2025-02-22 14:30:28] [ROUTES SET] Setting up routes for lan3 through wg_home...
[2025-02-22 14:30:29] [ROUTES SET] Using routing table: _vpn_wg_home_lan3 (ID: 150)
[2025-02-22 14:30:30] [FIREWALL] Adding forwarding rules
[2025-02-22 14:30:31] [DNS] DNS redirect added: lan3 -> 10.2.0.1
[2025-02-22 14:30:32] [SUCCESS] Routes configured successfully!`,

  'debug live': `[TAIL] Following debug log live...
Press Ctrl+C to exit.

[2025-02-22 14:35:20] [SERVER] Creating server: myserver
[2025-02-22 14:35:21] [SERVER] Generated server keys
[2025-02-22 14:35:22] [UCI] Adding server interface wg_server_myserver
[2025-02-22 14:35:23] [FIREWALL] Creating server firewall zone
[2025-02-22 14:35:24] [SERVER] Server created successfully
[2025-02-22 14:35:25] [SERVER ADD] Adding client: alice
[2025-02-22 14:35:26] [SERVER ADD] Assigned IP: 10.99.0.2
[2025-02-22 14:35:27] [SERVER ADD] Config saved: alice.conf`,

  'debug states': `IS_INSTALLED=1
IS_FIRST_EXEC=0
IS_PREV_TO_UPGRADE=0
IS_UPGRADED=1

ID_1_NAME=wg_home
ID_1_IS_CREATED=1
ID_1_IS_ACTIVE=1
ID_1_IS_RT_TABLES_IN_USE=1

ID_2_NAME=wg_work
ID_2_IS_CREATED=1
ID_2_IS_ACTIVE=1
ID_2_IS_RT_TABLES_IN_USE=1

ID_3_NAME=wg_server_myserver
ID_3_IS_CREATED=1
ID_3_IS_ACTIVE=1
ID_3_IS_RT_TABLES_IN_USE=0`,

  'debug network': `config interface 'loopback'
    option device 'lo'
    option proto 'static'
    option ipaddr '127.0.0.1'
    option netmask '255.0.0.0'

config interface 'lan'
    option device 'br-lan'
    option proto 'static'
    option ipaddr '192.168.1.1'
    option netmask '255.255.255.0'
    option ip6assign '60'

config interface 'wan'
    option device 'eth0'
    option proto 'dhcp'

# wg-autoconf network start id 1
config interface 'wg_home'
    option proto 'wireguard'
    option private_key 'uEcbqUV3DpqVgoElw2EV/m00T0Jwj9173y2nhTjnMnQ='
    option addresses '10.2.0.2/32'
    option dns '1.1.1.1 1.0.0.1'
# wg-autoconf network end id 1`,

  'debug firewall': `config zone
    option name 'lan'
    option input 'ACCEPT'
    option output 'ACCEPT'
    option forward 'ACCEPT'
    list network 'lan'

config zone
    option name 'wan'
    option input 'REJECT'
    option output 'ACCEPT'
    option forward 'REJECT'
    option masq '1'
    option mtu_fix '1'
    list network 'wan'

# wg-autoconf firewall start id 1
config zone
    option name 'wg_home'
    option input 'ACCEPT'
    option output 'ACCEPT'
    option forward 'ACCEPT'
    option masq '1'
    option mtu_fix '1'
    list network 'wg_home'

config forwarding
    option src 'lan3'
    option dest 'wg_home'

config forwarding
    option src 'wg_home'
    option dest 'lan3'
# wg-autoconf firewall end id 1`,

  'debug tables': `# rt_tables file
# reserved values
128     prelocal
255     local
254     main
253     default
0       unspec

# local
#1      inr.ruhep

150 _vpn_wg_home_lan3
151 _vpn_wg_work_lan4`,





  pwd: `/home/user`,

  whoami: `user`,

  date: `${new Date().toString()}`,

  uptime: ` 14:35:20 up 3 days, 2:15, 1 user, load average: 0.12, 0.18, 0.14`,

  ls: `home.conf
work.conf
vpn_us.conf
server_main.conf
office.conf
backup.conf`,






  echo: (text) => text,


  clear: '',





  error: `[ERROR] Unknown command. Type 'help' for available commands.

Available commands:
  help, list, test, setup, manual, remove
  status, up, down
  routes show, routes set, routes unset
  server create, server add, server revoke, server remove, server list, server stats
  backups show, backups restore
  clean, nuke
  settings show, settings set
  debug on, debug off, debug show, debug live, debug status, debug states, debug network, debug firewall, debug tables
  pwd, whoami, date, uptime, ls
  clear, echo`,





  'command not found': `[ERROR] Command not found: %s

Type 'help' to see available commands.`
};







export function getMockResponse(cmd) {
  const trimmed = cmd.trim();
  const lowerCmd = trimmed.toLowerCase();




  if (lowerCmd.startsWith('echo ')) {
    const text = trimmed.substring(5).trim();
    return MOCK_SHELL_DATA.echo(text) || text;
  }




  if (lowerCmd === 'date') {
    return new Date().toString();
  }




  if (lowerCmd === 'clear' || lowerCmd === 'cls') {
    return '';
  }




  if (MOCK_SHELL_DATA[lowerCmd] !== undefined) {
    return MOCK_SHELL_DATA[lowerCmd];
  }






  if (lowerCmd.startsWith('test ') && MOCK_SHELL_DATA['test ' + trimmed.substring(5)]) {
    return MOCK_SHELL_DATA['test ' + trimmed.substring(5)];
  }


  if (lowerCmd.startsWith('setup ') && MOCK_SHELL_DATA['setup ' + trimmed.substring(6)]) {
    return MOCK_SHELL_DATA['setup ' + trimmed.substring(6)];
  }


  if (lowerCmd.startsWith('remove ') && MOCK_SHELL_DATA['remove ' + trimmed.substring(7)]) {
    return MOCK_SHELL_DATA['remove ' + trimmed.substring(7)];
  }


  if (lowerCmd.startsWith('status ') && MOCK_SHELL_DATA['status ' + trimmed.substring(7)]) {
    return MOCK_SHELL_DATA['status ' + trimmed.substring(7)];
  }


  if (lowerCmd.startsWith('up ') && MOCK_SHELL_DATA['up ' + trimmed.substring(3)]) {
    return MOCK_SHELL_DATA['up ' + trimmed.substring(3)];
  }


  if (lowerCmd.startsWith('down ') && MOCK_SHELL_DATA['down ' + trimmed.substring(5)]) {
    return MOCK_SHELL_DATA['down ' + trimmed.substring(5)];
  }


  if (lowerCmd.startsWith('clean ') && MOCK_SHELL_DATA['clean ' + trimmed.substring(6)]) {
    return MOCK_SHELL_DATA['clean ' + trimmed.substring(6)];
  }


  if (lowerCmd.startsWith('routes show ') && MOCK_SHELL_DATA['routes show ' + trimmed.substring(12)]) {
    return MOCK_SHELL_DATA['routes show ' + trimmed.substring(12)];
  }


  if (lowerCmd.startsWith('routes set ') && MOCK_SHELL_DATA['routes set ' + trimmed.substring(11)]) {
    return MOCK_SHELL_DATA['routes set ' + trimmed.substring(11)];
  }


  if (lowerCmd.startsWith('routes unset ') && MOCK_SHELL_DATA['routes unset ' + trimmed.substring(13)]) {
    return MOCK_SHELL_DATA['routes unset ' + trimmed.substring(13)];
  }


  if (lowerCmd.startsWith('server add ') && MOCK_SHELL_DATA['server add ' + trimmed.substring(11)]) {
    return MOCK_SHELL_DATA['server add ' + trimmed.substring(11)];
  }


  if (lowerCmd.startsWith('server stats ') && MOCK_SHELL_DATA['server stats ' + trimmed.substring(13)]) {
    return MOCK_SHELL_DATA['server stats ' + trimmed.substring(13)];
  }


  if (lowerCmd.startsWith('server revoke ') && MOCK_SHELL_DATA['server revoke ' + trimmed.substring(14)]) {
    return MOCK_SHELL_DATA['server revoke ' + trimmed.substring(14)];
  }


  if (lowerCmd.startsWith('server remove ') && MOCK_SHELL_DATA['server remove ' + trimmed.substring(14)]) {
    return MOCK_SHELL_DATA['server remove ' + trimmed.substring(14)];
  }


  if (lowerCmd.startsWith('settings set ') && MOCK_SHELL_DATA['settings set ' + trimmed.substring(13)]) {
    return MOCK_SHELL_DATA['settings set ' + trimmed.substring(13)];
  }





  return MOCK_SHELL_DATA.error;
}

export default MOCK_SHELL_DATA;