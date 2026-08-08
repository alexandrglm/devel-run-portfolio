



export const MOCK_RESPONSES = {

  'list': `home.conf
work.conf
vpn_us.conf
server_main.conf`,


  'status': `==[ WireGuard Status ]====================================

==[ wg_home (CREATED, UP, ROUTED) ]======
  Local:      10.2.0.2/32
  Endpoint:   vpn.example.com:51820
  Transfer:   102.3 KiB received, 45.2 KiB sent
  Routes:     port3  (via _vpn_wg_home_port3)
  Status:     ◆ Connected

==[ wg_work (CREATED, UP) ]==============
  Local:      10.3.0.5/32
  Endpoint:   work-vpn.example.com:51821
  Transfer:   256.7 KiB received, 128.4 KiB sent
  Status:     ◆ Connected

==[ wg_vpn_us (CREATED, DOWN) ]==========
  Local:      10.4.0.1/32
  Status:     ○ Interface created but not active`,


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
Created:         2025-02-22 14:30:15`,


  'setup home': `[OK] Interface wg_home created successfully!

Interface Details:
  Name:        wg_home
  Private Key: uEcbqUV3DpqVgoElw2EV/m00T0Jwj9173y2nhTjnMnQ= (hidden)
  Address:     10.2.0.2/32
  Endpoint:    vpn.example.com:51820
  
Next Steps:
  1. Activate:  wg-autoconf up wg_home
  2. Route:     wg-autoconf routes set wg_home port3
  3. Test:      ping -I wg_home 8.8.8.8`,


  'up wg_home': `[OK] Interface wg_home activated successfully!

Status: ◆ Connected
Transfer: 0 B received, 0 B sent
Last Handshake: Just now

You can now use this interface for VPN traffic.`,


  'down wg_home': `[OK] Interface wg_home deactivated.

All routes and firewall rules have been removed.
Use 'up' to reactivate.`,


  'routes set wg_home port3': `[OK] Routes configured successfully!

Configuration Details:
  Routing Table:  _vpn_wg_home_port3 (ID: 150)
  Source:         port3 (192.168.3.0/24)
  Gateway:        wg_home
  Priority:       1500, 1501, 1503
  
Firewall Zone:    wg_home (created)
Forwarding:       port3 ↔ wg_home (bidirectional)

Traffic from port3 will now route through wg_home VPN.`,


  'routes unset wg_home port3': `[OK] Routes removed successfully!

Routing table _vpn_wg_home_port3 cleaned.
Firewall rules updated.
IP rules flushed.

Port3 traffic will use default gateway.`,


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

Ready to add clients:
  wg-autoconf server add myserver <username>`,


  'server list': `==[ Active WireGuard Servers ]=========================

Server: myserver
  Subnet: 10.99.0.0/24
  Clients: 2
    - alice (10.99.0.2) - Last HS: 5 seconds ago
    - bob (10.99.0.3) - Last HS: 2 minutes ago

Server: enterprise
  Subnet: 10.98.0.0/24
  Clients: 3
    - emp_user1 (10.98.0.2) - Last HS: 1 minute ago
    - emp_user2 (10.98.0.3) - Last HS: 3 minutes ago
    - emp_user3 (10.98.0.4) - Last HS: 15 minutes ago`,


  'server add myserver alice': `[OK] User 'alice' added to server 'myserver'

User Details:
  Name:          alice
  IP:            10.99.0.2
  Public Key:    /BjQMhFdwD410zqUE4hVgM1OJOpPVeKahjzKtXz3Wmk=
  Created:       2025-02-22 14:35:20
  
Config File:   /usr/libexec/wg-autoconf/configs/myserver/alice.conf
Status:        Ready to export

Export this .conf file to client device and import in WireGuard app.`,


  'server stats myserver': `==[ Server: myserver Statistics ]=======================

Server Info:
  Public Key:      GHyXLa7n1gGPN/LJfxbh7EKz92ilepSDzk7jEz5l7DE=
  Subnet:          10.99.0.0/24
  Listen Port:     51820
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


  'debug on': `[OK] Debug logging enabled

Debug Log: /usr/libexec/wg-autoconf/debug/wg-autoconf.log

View debug log:
  wg-autoconf debug show
  wg-autoconf debug live (tail)`,


  'debug off': `[OK] Debug logging disabled`,


  'debug show': `[2025-02-22 14:30:15] [SETUP] Starting interface setup for wg_home
[2025-02-22 14:30:16] [STATE] Creating state entry ID_1_NAME=home
[2025-02-22 14:30:17] [UCI] Adding network interface to /etc/config/network
[2025-02-22 14:30:18] [FIREWALL] Creating firewall zone wg_home
[2025-02-22 14:30:19] [ROUTES] Setting up routing table _vpn_wg_home_port3
[2025-02-22 14:30:20] [NFTABLES] Re-adding accept rules after firewall reload
[2025-02-22 14:30:21] [SUCCESS] Interface wg_home setup complete`,


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


  'help': `wg-autoconf v1.0.0-r1 - WireGuard Automation Tool

USAGE:
  wg-autoconf <command> [options]

COMMANDS:
  setup <name>              Create WireGuard interface
  manual <name>             Advanced setup with custom name
  up <interface>            Activate interface
  down <interface>          Deactivate interface
  remove <interface>        Delete interface completely
  list                      Show available .conf files
  test <name>               Validate config file
  status                    Show all active interfaces
  status <interface>        Show specific interface details
  
  routes show               List all configured routes
  routes set <wg> <lan>     Route LAN through VPN
  routes unset <wg> <lan>   Remove routing
  
  server create             Create WireGuard server
  server add <n> <user>     Add client to server
  server revoke <n> <user>  Revoke client access
  server remove <n>         Delete server completely
  server list               Show all servers and clients
  server stats <n>          Display server statistics
  
  settings show             Display current settings
  settings set <k> <v>      Change setting
  debug on/off              Enable/disable logging
  
GLOBAL FLAGS:
  --verbose, -v             High verbosity mode
  --help, -h                Show this help

EXAMPLES:
  wg-autoconf setup home
  wg-autoconf up wg_home
  wg-autoconf routes set wg_home port3
  wg-autoconf server create
  wg-autoconf server add myserver alice`,


  'clean': `[INTERACTIVE CLEANUP]

Select interfaces to remove:

[ ] wg_home (10.2.0.2/32)
[ ] wg_work (10.3.0.5/32)
[x] wg_vpn_us (10.4.0.1/32)

Proceed with removal? (yes/no): yes

[OK] Cleaned 1 interface(s)`,


  'nuke': `[WARNING] This will remove ALL WireGuard configurations!

Interfaces to remove:
  - wg_home
  - wg_work
  - wg_vpn_us
  - wg_server_myserver
  - wg_server_enterprise

Servers to remove:
  - myserver (2 clients)
  - enterprise (3 clients)

Are you absolutely certain? Type YES to confirm: YES

[OK] System completely nuked!

All WireGuard interfaces, servers, routing tables, firewall zones removed.
State file reset.`,


  'error': `[ERROR] Unknown command. Type 'help' for available commands.`,


  'clear': '',


  'pwd': `/home/user`,


  'whoami': `user`,


  'date': `${new Date().toString()}`,


  'uptime': ` 14:35:20 up 3 days,  2:15,  1 user,  load average: 0.12, 0.18, 0.14`,


  'ls': `home.conf
work.conf
vpn_us.conf
server_main.conf`,


  'echo hello': `hello`
};






export function getMockResponse(cmd) {
  const trimmed = cmd.trim().toLowerCase();


  if (MOCK_RESPONSES[trimmed]) {
    return MOCK_RESPONSES[trimmed];
  }


  if (trimmed.startsWith('echo ')) {
    const text = cmd.substring(5).trim();
    return text;
  }


  return MOCK_RESPONSES['error'];
}