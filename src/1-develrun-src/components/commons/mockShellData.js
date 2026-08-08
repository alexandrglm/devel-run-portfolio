export const DEFAULT_MOCK_SHELL_DATA = {
  help: `Available commands:\n  help - show this text\n  list - show mock interfaces\n  status - show current VPN status\n  clear - clear the terminal`,
  list: `home.conf\nwork.conf\nvpn_us.conf`,
  status: `==[ WireGuard Status ]==============================\nInterface: wg_home\nStatus: UP\nEndpoint: vpn.example.com:51820\nRoutes: port3`,
  error: `Unknown command. Type 'help' for valid commands.`
};
