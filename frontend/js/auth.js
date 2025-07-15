// Main authentication logic for login page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize device ID
        await initializeDeviceId();
        
        // Check if already logged in
        if (isAuthenticated()) {
            window.location.href = './dashboard.html';
            return;
        }
        
        // Initialize login form
        initializeLoginForm();
        
        console.log('Login page initialized successfully');
    } catch (error) {
        console.error('Error initializing login page:', error);
        showError('Error initializing application. Please refresh the page.');
    }
});

/**
 * Initialize login form event listeners
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const registerLink = document.getElementById('registerLink');
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle password toggle
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Register link is now a normal link to register.html
    // No special handling needed
    
    // Handle form input changes
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', clearError);
    });
}

/**
 * Handle login form submission
 * @param {Event} e - Form submission event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!validateInputs(username, password)) {
        return;
    }
    
    try {
        // Show loading state
        setLoadingState(true);
        clearError();
        
        // Get device ID
        const deviceId = await getDeviceId();
        if (!deviceId) {
            throw new Error('Unable to generate device ID. Please try again.');
        }
        
        // Attempt login
        const response = await login(username, password, deviceId);
        
        // Save authentication data
        saveAuthData(response.token, response.user, rememberMe);
        
        // Show success message briefly
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        handleLoginError(error);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Validate login inputs
 * @param {string} username - Username input
 * @param {string} password - Password input
 * @returns {boolean} - True if valid
 */
function validateInputs(username, password) {
    if (!username) {
        showError('Please enter your username.');
        document.getElementById('username').focus();
        return false;
    }
    
    if (!password) {
        showError('Please enter your password.');
        document.getElementById('password').focus();
        return false;
    }
    
    if (username.length < 3) {
        showError('Username must be at least 3 characters long.');
        document.getElementById('username').focus();
        return false;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        document.getElementById('password').focus();
        return false;
    }
    
    return true;
}

/**
 * Handle login errors
 * @param {Error} error - Login error
 */
function handleLoginError(error) {
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.message) {
        const message = error.message.toLowerCase();
        
        if (message.includes('invalid credentials') || message.includes('unauthorized')) {
            errorMessage = 'Invalid username or password. Please try again.';
        } else if (message.includes('device')) {
            errorMessage = 'This account is registered to a different device. Please contact support.';
        } else if (message.includes('network') || message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (message.includes('server') || message.includes('500')) {
            errorMessage = 'Server error. Please try again later.';
        } else {
            errorMessage = error.message;
        }
    }
    
    showError(errorMessage);
    
    // Clear password field on error
    document.getElementById('password').value = '';
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'Show';
    }
}

/**
 * Set loading state for login button
 * @param {boolean} isLoading - Loading state
 */
function setLoadingState(isLoading) {
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const loadingSpinner = loginButton.querySelector('.loading-spinner');
    
    if (isLoading) {
        loginButton.disabled = true;
        loginButton.classList.add('loading');
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    } else {
        loginButton.disabled = false;
        loginButton.classList.remove('loading');
        buttonText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        errorElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            clearError();
        }, 5000);
    }
}

/**
 * Show success message
 * @param {string} message - Success message
 */
function showSuccess(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#27ae60';
        errorElement.style.backgroundColor = '#d5f4e6';
        errorElement.style.borderColor = '#27ae60';
        errorElement.classList.add('show');
        errorElement.style.display = 'block';
    }
}

/**
 * Clear error message
 */
function clearError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.style.display = 'none';
        errorElement.textContent = '';
        
        // Reset error styling
        errorElement.style.color = '#e74c3c';
        errorElement.style.backgroundColor = '#fdf2f2';
        errorElement.style.borderColor = '#f5c6cb';
    }
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Handle Enter key on login form
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.form && activeElement.form.id === 'loginForm') {
            e.preventDefault();
            handleLogin(e);
        }
    }
    
    // Handle Escape key to clear errors
    if (e.key === 'Escape') {
        clearError();
    }
});

/**
 * Auto-focus username field on page load
 */
window.addEventListener('load', () => {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.focus();
    }
});

/**
 * Handle page visibility change (for token refresh)
 */
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden && isAuthenticated()) {
        try {
            // Verify token is still valid when page becomes visible
            const isValid = await verifyToken();
            if (!isValid) {
                clearAuthData();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    }
});

/**
 * Debug function to check authentication state
 */
function debugAuth() {
    console.log('Authentication Debug Info:');
    console.log('Is Authenticated:', isAuthenticated());
    console.log('Token:', getToken() ? 'Present' : 'None');
    console.log('User Data:', getUserData());
    console.log('Storage Info:', getStorageInfo());
    getDeviceInfo().then(info => console.log('Device Info:', info));
}

// Make debug function available globally
window.debugAuth = debugAuth;
