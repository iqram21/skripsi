// Device ID handling module for Electron
const { ipcRenderer } = require('electron');

/**
 * Generate or retrieve device ID
 * @returns {Promise<string>} - Device ID
 */
async function getDeviceId() {
    try {
        // Check if device ID is already stored
        const storedDeviceId = getStoredDeviceId();
        if (storedDeviceId) {
            return storedDeviceId;
        }
        
        // Request device ID from main process
        const deviceId = await ipcRenderer.invoke('get-device-id');
        
        // Store the device ID for future use
        saveDeviceId(deviceId);
        
        return deviceId;
    } catch (error) {
        console.error('Error getting device ID:', error);
        
        // Fallback to browser-based device ID if Electron IPC fails
        return generateFallbackDeviceId();
    }
}

/**
 * Generate fallback device ID using browser information
 * @returns {string} - Fallback device ID
 */
function generateFallbackDeviceId() {
    try {
        // Collect browser and system information
        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const platform = navigator.platform;
        const screen = `${screen.width}x${screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Create a semi-unique identifier
        const deviceInfo = `${userAgent}-${language}-${platform}-${screen}-${timezone}`;
        
        // Generate hash-like ID
        const deviceId = btoa(deviceInfo).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
        
        console.warn('Using fallback device ID generation');
        return deviceId;
    } catch (error) {
        console.error('Error generating fallback device ID:', error);
        
        // Last resort - generate random ID
        return 'fallback_' + Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
}

/**
 * Validate device ID format
 * @param {string} deviceId - Device ID to validate
 * @returns {boolean} - True if valid
 */
function isValidDeviceId(deviceId) {
    if (!deviceId || typeof deviceId !== 'string') {
        return false;
    }
    
    // Check minimum length and format
    return deviceId.length >= 8 && /^[a-zA-Z0-9_-]+$/.test(deviceId);
}

/**
 * Display device ID in UI element
 * @param {string} elementId - Element ID to display device ID
 */
async function displayDeviceId(elementId) {
    try {
        const deviceId = await getDeviceId();
        const element = document.getElementById(elementId);
        
        if (element) {
            // Display truncated device ID for UI
            const truncatedId = deviceId.length > 16 ? 
                deviceId.substring(0, 8) + '...' + deviceId.substring(deviceId.length - 8) : 
                deviceId;
            
            element.textContent = truncatedId;
            element.title = deviceId; // Show full ID on hover
        }
    } catch (error) {
        console.error('Error displaying device ID:', error);
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = 'Error loading device ID';
        }
    }
}

/**
 * Reset device ID (force regeneration)
 */
async function resetDeviceId() {
    try {
        // Clear stored device ID
        localStorage.removeItem('device_id');
        
        // Generate new device ID
        const newDeviceId = await getDeviceId();
        
        console.log('Device ID reset successfully');
        return newDeviceId;
    } catch (error) {
        console.error('Error resetting device ID:', error);
        throw error;
    }
}

/**
 * Get device information for debugging
 * @returns {Promise<Object>} - Device information
 */
async function getDeviceInfo() {
    try {
        const deviceId = await getDeviceId();
        
        return {
            deviceId: deviceId,
            deviceIdTruncated: deviceId.length > 16 ? 
                deviceId.substring(0, 8) + '...' + deviceId.substring(deviceId.length - 8) : 
                deviceId,
            isStored: !!getStoredDeviceId(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting device info:', error);
        return {
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Initialize device ID on page load
 */
async function initializeDeviceId() {
    try {
        const deviceId = await getDeviceId();
        console.log('Device ID initialized:', deviceId.substring(0, 8) + '...');
        
        // Display in UI if element exists
        const deviceElement = document.getElementById('deviceId');
        if (deviceElement) {
            await displayDeviceId('deviceId');
        }
        
        return deviceId;
    } catch (error) {
        console.error('Error initializing device ID:', error);
        throw error;
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getDeviceId,
        displayDeviceId,
        resetDeviceId,
        getDeviceInfo,
        initializeDeviceId,
        isValidDeviceId
    };
}
