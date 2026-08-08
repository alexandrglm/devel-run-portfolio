// ============================================
// setupWebshell.js
// ============================================
import { setupWebshell } from './server-webshell.js'

/**
 * Creates and configures a WebShellServer instance
 *
 * @param {Object} app - Express application instance
 * @param {Object} server - HTTP server instance
 * @param {Object} options - Configuration options
 * @returns {Object} WebShell server instance and utilities
 */

export async function setupWebshell(app, server, options = {}) {

    console.log('[WEBSHELL] Setting up WebShell using compatibility function...');

    try {

        // Create WebShell server instance
        const webshellServer = new WebShellServer(app, server, options);

        
        // Initialise the server
        await webshellServer.initialise();

        // Start server if requested
        if (options.shouldStart) {
        
            await webshellServer.start();
        
        }

        
        console.log('[WEBSHELL] WebShell setup completed successfully');

        
        // Return object matching original setupWebshell return structure
        return {
        
            io: webshellServer.io,
            getStats: () => webshellServer.getStats(),
            security: webshellServer.security,
            auth: webshellServer.auth,
            sessions: webshellServer.sessions,
            executor: webshellServer.executor,
            webshellServer: webshellServer
        
        };

    } catch (error) {
        
        console.error('[WEBSHELL] Failed to setup WebShell:', error.message);
        throw error;
    
    }
}
