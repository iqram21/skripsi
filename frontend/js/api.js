// API communication module
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * New secure login function
 * @param {string} email - User's email or username
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Login response with tokens and user info
 */
async function secureLogin(email, password) {
    try {
        // Get device information (this is just for tracking, not security)
        const deviceInfo = {
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            platform: navigator.platform
        };
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password,
                deviceInfo
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Login failed');
        }
        
        if (data.success && data.sessionToken && data.deviceToken) {
            // Store ONLY the server-generated tokens
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('deviceToken', data.deviceToken);
            // DO NOT store any device ID that can be manipulated
            
            return { success: true, user: data.user };
        }
        
        return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to server. Please check your connection.');
        }
        throw error;
    }
}

/**
 * Legacy login function (keeping for backward compatibility)
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @param {string} deviceId - Device ID for restriction
 * @returns {Promise<Object>} - Login response with token and user info
 */
async function login(username, password, deviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                deviceId
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Login failed');
        }
        
        return data;
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to server. Please check your connection.');
        }
        throw error;
    }
}

/**
 * Make authenticated requests with secure tokens
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
async function makeAuthenticatedRequest(url, options = {}) {
    const sessionToken = localStorage.getItem('sessionToken');
    const deviceToken = localStorage.getItem('deviceToken');
    
    if (!sessionToken || !deviceToken) {
        // Redirect to login
        window.location.href = '/login.html';
        return;
    }
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${sessionToken}`,
            'X-Device-Token': deviceToken,
            'Content-Type': 'application/json'
        }
    });
    
    if (response.status === 401 || response.status === 403) {
        // Clear tokens and redirect to login
        localStorage.clear();
        window.location.href = '/login.html';
        return;
    }
    
    return response;
}

/**
 * Secure logout function
 * @returns {Promise<void>}
 */
async function secureLogout() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/secure-logout`, {
            method: 'POST'
        });
        
        if (response) {
            const data = await response.json();
            console.log('Logout successful:', data.message);
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear local storage and redirect
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

/**
 * Legacy logout function to invalidate session
 * @returns {Promise<void>}
 */
async function logout() {
    const token = getToken();
    if (!token) return;
    
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Logout request failed:', error);
        // Continue with local logout even if server request fails
    }
}

/**
 * Verify token validity
 * @returns {Promise<boolean>} - True if token is valid
 */
async function verifyToken() {
    const token = getToken();
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}

/**
 * Refresh authentication token
 * @returns {Promise<string>} - New token
 */
async function refreshToken() {
    const token = getToken();
    if (!token) throw new Error('No token available');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Token refresh failed');
        }
        
        return data.token;
    } catch (error) {
        throw error;
    }
}

/**
 * Get user profile data
 * @returns {Promise<Object>} - User profile data
 */
async function getUserProfile() {
    const token = getToken();
    if (!token) throw new Error('No authentication token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch user profile');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Generic API request function with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - API response
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
        const data = await response.json();
        
        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                clearAuthData();
                window.location.href = './login.html';
                return;
            }
            throw new Error(data.error || data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Register function to create new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.deviceId - Device ID for restriction
 * @returns {Promise<Object>} - Registration response with token and user info
 */
async function register(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Registration failed');
        }
        
        return data;
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to server. Please check your connection.');
        }
        throw error;
    }
}

/**
 * Check username availability
 * @param {string} username - Username to check
 * @returns {Promise<Object>} - Availability status
 */
async function checkUsernameAvailability(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to check username availability');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Check email availability
 * @param {string} email - Email to check
 * @returns {Promise<Object>} - Availability status
 */
async function checkEmailAvailability(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to check email availability');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Get user's registered devices
 * @returns {Promise<Object>} - List of user devices
 */
async function getUserDevices() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/devices`);
        
        if (!response) return { devices: [] };
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get devices');
        }
        
        return data;
    } catch (error) {
        console.error('Get devices error:', error);
        throw error;
    }
}

/**
 * Revoke a device
 * @param {number} deviceId - Device ID to revoke
 * @returns {Promise<Object>} - Revoke response
 */
async function revokeDevice(deviceId) {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/auth/devices/${deviceId}/revoke`, {
            method: 'POST'
        });
        
        if (!response) return { success: false };
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to revoke device');
        }
        
        return data;
    } catch (error) {
        console.error('Revoke device error:', error);
        throw error;
    }
}

/**
 * Check if user is authenticated with secure tokens
 * @returns {boolean} - True if authenticated
 */
function isSecurelyAuthenticated() {
    const sessionToken = localStorage.getItem('sessionToken');
    const deviceToken = localStorage.getItem('deviceToken');
    return !!(sessionToken && deviceToken);
}
