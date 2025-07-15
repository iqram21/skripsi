// Dashboard page logic
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check authentication
        if (!isAuthenticated()) {
            window.location.href = './login.html';
            return;
        }
        
        // Initialize dashboard
        await initializeDashboard();
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        // Redirect to login on error
        window.location.href = './login.html';
    }
});

/**
 * Initialize dashboard components
 */
async function initializeDashboard() {
    try {
        // Display user information
        await displayUserInfo();
        
        // Display device ID
        await displayDeviceId('deviceId');
        
        // Setup logout button
        setupLogoutButton();
        
        // Setup periodic token validation
        setupTokenValidation();
        
        // Initialize enhanced features
        await initializeEnhancedDashboard();
        
    } catch (error) {
        console.error('Error in dashboard initialization:', error);
        throw error;
    }
}

/**
 * Display user information
 */
async function displayUserInfo() {
    const userInfoElement = document.getElementById('userInfo');
    
    if (!userInfoElement) return;
    
    try {
        const userData = getUserData();
        
        if (userData) {
            userInfoElement.textContent = `Welcome, ${userData.username || userData.name || 'User'}!`;
        } else {
            // Try to fetch user data from API
            const profile = await getUserProfile();
            updateUserData(profile);
            userInfoElement.textContent = `Welcome, ${profile.username || profile.name || 'User'}!`;
        }
    } catch (error) {
        console.error('Error displaying user info:', error);
        userInfoElement.textContent = 'Welcome, User!';
    }
}

/**
 * Setup logout button functionality
 */
function setupLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (!logoutButton) return;
    
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        try {
            // Show loading state
            logoutButton.disabled = true;
            logoutButton.textContent = 'Logging out...';
            
            // Perform logout
            await performLogout();
            
        } catch (error) {
            console.error('Logout error:', error);
            
            // Still clear local data and redirect
            clearAuthData();
            window.location.href = './login.html';
        }
    });
}

/**
 * Perform logout process
 */
async function performLogout() {
    try {
        // Call logout API
        await logout();
        
        // Clear local authentication data
        clearAuthData();
        
        // Redirect to login page
        window.location.href = './login.html';
        
    } catch (error) {
        console.error('Error during logout:', error);
        
        // Still clear local data and redirect on error
        clearAuthData();
        window.location.href = './login.html';
    }
}

/**
 * Setup periodic token validation
 */
function setupTokenValidation() {
    // Check token validity every 5 minutes
    setInterval(async () => {
        try {
            const isValid = await verifyToken();
            
            if (!isValid) {
                console.log('Token validation failed, redirecting to login');
                clearAuthData();
                window.location.href = './login.html';
            }
        } catch (error) {
            console.error('Token validation error:', error);
        }
    }, 5 * 60 * 1000); // 5 minutes
}

/**
 * Handle page visibility change
 */
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
        try {
            // Verify token when page becomes visible
            const isValid = await verifyToken();
            if (!isValid) {
                clearAuthData();
                window.location.href = './login.html';
            }
        } catch (error) {
            console.error('Error verifying token on visibility change:', error);
        }
    }
});

/**
 * Handle beforeunload event for cleanup
 */
window.addEventListener('beforeunload', () => {
    // Cleanup if not using remember me
    if (!isRememberMeEnabled()) {
        // Session storage will be cleared automatically
        console.log('Session cleanup on page unload');
    }
});

/**
 * Add keyboard shortcuts for dashboard
 */
document.addEventListener('keydown', (e) => {
    // Ctrl+L or Cmd+L for logout
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        document.getElementById('logoutButton').click();
    }
    
    // Escape key to focus logout button
    if (e.key === 'Escape') {
        document.getElementById('logoutButton').focus();
    }
});

/**
 * Initialize dashboard styles
 */
function initializeDashboardStyles() {
    // Add any dynamic styling here
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.animation = 'fadeIn 0.5s ease-out';
    }
    
    const welcomeCard = document.querySelector('.welcome-card');
    if (welcomeCard) {
        welcomeCard.style.animation = 'fadeIn 0.5s ease-out 0.2s both';
    }
}

// Call style initialization
initializeDashboardStyles();

/**
 * Debug function for dashboard
 */
function debugDashboard() {
    console.log('Dashboard Debug Info:');
    console.log('Authentication Status:', isAuthenticated());
    console.log('User Data:', getUserData());
    console.log('Storage Info:', getStorageInfo());
    getDeviceInfo().then(info => console.log('Device Info:', info));
}

// Make debug function available globally
window.debugDashboard = debugDashboard;

/**
 * Quick action functions
 */
function refreshSession() {
    console.log('Refreshing session...');
    const button = event.target.closest('.action-button');
    const originalContent = button.innerHTML;
    
    // Show loading state
    button.style.opacity = '0.6';
    button.style.pointerEvents = 'none';
    
    // Simulate refresh
    setTimeout(() => {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
        
        // Update login time
        updateLoginTime();
        showNotification('Session refreshed successfully!', 'success');
        console.log('Session refreshed successfully');
    }, 1500);
}

function viewProfile() {
    console.log('Opening profile view...');
    // Placeholder for profile view functionality
    alert('Profile view feature coming soon!');
}

function viewActivity() {
    console.log('Opening activity log...');
    // Placeholder for activity log functionality
    alert('Activity log feature coming soon!');
}

function deviceSettings() {
    console.log('Opening device settings...');
    // Placeholder for device settings functionality
    alert('Device settings feature coming soon!');
}

/**
 * Update login time display
 */
function updateLoginTime() {
    const loginTimeElement = document.getElementById('loginTime');
    if (loginTimeElement) {
        const now = new Date();
        const loginTime = getStorageItem('loginTime') || now.toISOString();
        const timeDiff = now - new Date(loginTime);
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            loginTimeElement.textContent = `${hours}h ${minutes % 60}m`;
        } else {
            loginTimeElement.textContent = `${minutes}m`;
        }
    }
}

/**
 * Enhanced user info display
 */
async function displayEnhancedUserInfo() {
    try {
        const userData = getUserData();
        if (userData) {
            // Update profile section
            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const profileAvatar = document.getElementById('profileAvatar');
            
            if (profileName) profileName.textContent = userData.username || 'User';
            if (profileEmail) profileEmail.textContent = userData.email || 'user@example.com';
            if (profileAvatar) {
                profileAvatar.textContent = (userData.username || 'U').charAt(0).toUpperCase();
            }
            
            // Update last login
            const lastLoginElement = document.getElementById('lastLogin');
            if (lastLoginElement) {
                const loginTime = getStorageItem('loginTime');
                if (loginTime) {
                    const date = new Date(loginTime);
                    lastLoginElement.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                }
            }
        }
    } catch (error) {
        console.error('Error displaying enhanced user info:', error);
    }
}

/**
 * Initialize enhanced dashboard features
 */
async function initializeEnhancedDashboard() {
    try {
        // Store login time if not already stored
        if (!getStorageItem('loginTime')) {
            setStorageItem('loginTime', new Date().toISOString());
        }
        
        // Update login time display
        updateLoginTime();
        
        // Update login time every minute
        setInterval(updateLoginTime, 60000);
        
        // Display enhanced user info
        await displayEnhancedUserInfo();
        
        // Add animation classes to cards
        setTimeout(() => {
            const cards = document.querySelectorAll('.stat-card, .dashboard-card, .profile-section');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
        
    } catch (error) {
        console.error('Error initializing enhanced dashboard:', error);
    }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Show loading overlay
 */
function showLoadingOverlay(show = true) {
    let overlay = document.querySelector('.loading-overlay');
    
    if (!overlay && show) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner-large"></div>
                <p>Loading...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    if (overlay) {
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }
}
