// Main Electron process file
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

let mainWindow;

/**
 * Create the main application window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, 'assets/icon.png'), // Add app icon if available
        show: false, // Don't show until ready
        titleBarStyle: 'default',
        autoHideMenuBar: true // Hide menu bar by default
    });

    // Load the login page
    mainWindow.loadFile(path.join(__dirname, 'frontend/pages/login.html'));

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Focus the window
        if (process.platform === 'darwin') {
            mainWindow.focus();
        }
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });

    // Development tools
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

/**
 * Generate unique device ID
 */
ipcMain.handle('get-device-id', async () => {
    try {
        const hostname = os.hostname();
        const platform = os.platform();
        const arch = os.arch();
        const release = os.release();
        const networkInterfaces = os.networkInterfaces();
        
        // Get MAC address from network interfaces
        const macAddress = Object.values(networkInterfaces)
            .flat()
            .find(iface => iface.mac && iface.mac !== '00:00:00:00:00:00')?.mac || 'unknown';
        
        // Get CPU info for additional uniqueness
        const cpus = os.cpus();
        const cpuModel = cpus.length > 0 ? cpus[0].model : 'unknown';
        
        // Get memory info
        const totalMemory = os.totalmem();
        
        // Combine all information
        const deviceInfo = `${hostname}-${platform}-${arch}-${release}-${macAddress}-${cpuModel}-${totalMemory}`;
        
        // Generate SHA256 hash
        const deviceId = crypto.createHash('sha256').update(deviceInfo).digest('hex');
        
        console.log('Generated device ID:', deviceId.substring(0, 8) + '...');
        
        return deviceId;
    } catch (error) {
        console.error('Error generating device ID:', error);
        
        // Fallback device ID
        const fallbackInfo = `${os.hostname()}-${os.platform()}-${Date.now()}`;
        return crypto.createHash('sha256').update(fallbackInfo).digest('hex');
    }
});

/**
 * Handle app ready event
 */
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

/**
 * Handle window all closed event
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * Handle certificate error
 */
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // In development, ignore certificate errors for localhost
    if (process.env.NODE_ENV === 'development' && url.startsWith('http://localhost')) {
        event.preventDefault();
        callback(true);
    } else {
        callback(false);
    }
});

/**
 * Handle app before quit
 */
app.on('before-quit', () => {
    console.log('Application is quitting...');
});

/**
 * Security: Prevent new window creation
 */
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        require('electron').shell.openExternal(navigationUrl);
    });
});

/**
 * Additional IPC handlers
 */

// Handle app info request
ipcMain.handle('get-app-info', async () => {
    return {
        name: app.getName(),
        version: app.getVersion(),
        platform: process.platform,
        arch: process.arch,
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node
    };
});

// Handle system info request
ipcMain.handle('get-system-info', async () => {
    return {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        uptime: os.uptime(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuCount: os.cpus().length
    };
});

// Handle log message from renderer
ipcMain.handle('log-message', async (event, level, message) => {
    console.log(`[${level.toUpperCase()}] ${message}`);
});

// Handle quit app request
ipcMain.handle('quit-app', async () => {
    app.quit();
});

// Handle restart app request
ipcMain.handle('restart-app', async () => {
    app.relaunch();
    app.exit();
});

// Handle minimize window
ipcMain.handle('minimize-window', async () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

// Handle maximize window
ipcMain.handle('maximize-window', async () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

// Handle close window
ipcMain.handle('close-window', async () => {
    if (mainWindow) {
        mainWindow.close();
    }
});

console.log('Electron main process started');
console.log('App version:', app.getVersion());
console.log('Electron version:', process.versions.electron);
console.log('Node version:', process.versions.node);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
