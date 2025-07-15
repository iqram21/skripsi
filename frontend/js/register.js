// Main registration logic
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize device ID
        await initializeDeviceId();
        
        // Check if already logged in
        if (isAuthenticated()) {
            window.location.href = './dashboard.html';
            return;
        }
        
        // Initialize registration form
        initializeRegistrationForm();
        
        // Setup real-time validation
        setupFieldValidation();
        
        console.log('Registration page initialized successfully');
    } catch (error) {
        console.error('Error initializing registration page:', error);
        showError('Error initializing application. Please refresh the page.');
    }
});

/**
 * Initialize registration form event listeners
 */
function initializeRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const termsLink = document.getElementById('termsLink');
    
    // Handle form submission
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Handle password toggles
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => togglePasswordVisibility('password'));
    }
    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', () => togglePasswordVisibility('confirmPassword'));
    }
    
    // Handle terms link
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showTermsModal();
        });
    }
    
    // Clear messages on input
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            clearMessages();
        });
    });
}

/**
 * Setup real-time field validation
 */
function setupFieldValidation() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const acceptTermsInput = document.getElementById('acceptTerms');
    
    // Username validation
    if (usernameInput) {
        usernameInput.addEventListener('input', debounce(() => {
            validateUsernameField();
        }, 300));
        usernameInput.addEventListener('blur', validateUsernameField);
    }
    
    // Email validation
    if (emailInput) {
        emailInput.addEventListener('input', debounce(() => {
            validateEmailField();
        }, 300));
        emailInput.addEventListener('blur', validateEmailField);
    }
    
    // Password validation and strength
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            validatePasswordField();
            updatePasswordStrength();
            // Also validate confirm password if it has value
            if (confirmPasswordInput.value) {
                validateConfirmPasswordField();
            }
        });
    }
    
    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validateConfirmPasswordField);
        confirmPasswordInput.addEventListener('blur', validateConfirmPasswordField);
    }
    
    // Terms validation
    if (acceptTermsInput) {
        acceptTermsInput.addEventListener('change', validateTermsField);
    }
}

/**
 * Handle registration form submission
 */
async function handleRegistration(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        username: sanitizeInput(document.getElementById('username').value),
        email: formatEmail(document.getElementById('email').value),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        acceptTerms: document.getElementById('acceptTerms').checked
    };
    
    // Validate all fields
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
        displayValidationErrors(validation.results);
        return;
    }
    
    try {
        // Show loading state
        setLoadingState(true);
        clearMessages();
        
        // Get device ID
        const deviceId = await getDeviceId();
        if (!deviceId) {
            throw new Error('Unable to generate device ID. Please try again.');
        }
        
        // Prepare registration data
        const registrationData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            deviceId: deviceId
        };
        
        // Attempt registration
        const response = await register(registrationData);
        
        // Save authentication data
        saveAuthData(response.token, response.user, false);
        
        // Show success message
        showSuccess('Registration successful! Redirecting to dashboard...');
        
        // Clear form
        clearForm();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Registration error:', error);
        handleRegistrationError(error);
    } finally {
        setLoadingState(false);
    }
}

/**
 * Validate username field
 */
function validateUsernameField() {
    const input = document.getElementById('username');
    const errorElement = document.getElementById('usernameError');
    const successElement = document.getElementById('usernameSuccess');
    
    const result = validateField('username', input.value);
    updateFieldValidation(input, errorElement, successElement, result);
}

/**
 * Validate email field
 */
function validateEmailField() {
    const input = document.getElementById('email');
    const errorElement = document.getElementById('emailError');
    const successElement = document.getElementById('emailSuccess');
    
    const result = validateField('email', input.value);
    updateFieldValidation(input, errorElement, successElement, result);
}

/**
 * Validate password field
 */
function validatePasswordField() {
    const input = document.getElementById('password');
    const errorElement = document.getElementById('passwordError');
    
    const result = validateField('password', input.value);
    
    if (result.error) {
        errorElement.textContent = result.error;
        input.classList.remove('valid');
        input.classList.add('invalid');
    } else {
        errorElement.textContent = '';
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
}

/**
 * Validate confirm password field
 */
function validateConfirmPasswordField() {
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const errorElement = document.getElementById('confirmPasswordError');
    const successElement = document.getElementById('confirmPasswordSuccess');
    
    const result = validateField('confirmPassword', confirmInput.value, {
        password: passwordInput.value
    });
    
    updateFieldValidation(confirmInput, errorElement, successElement, result);
}

/**
 * Validate terms field
 */
function validateTermsField() {
    const input = document.getElementById('acceptTerms');
    const errorElement = document.getElementById('termsError');
    
    const result = validateField('terms', input.checked);
    
    if (result.error) {
        errorElement.textContent = result.error;
    } else {
        errorElement.textContent = '';
    }
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthElement = document.getElementById('passwordStrength');
    const strengthBar = strengthElement.querySelector('.strength-fill');
    const strengthText = strengthElement.querySelector('.strength-text');
    
    const password = passwordInput.value;
    const strength = validators.passwordStrength(password);
    
    // Update strength bar
    strengthBar.className = `strength-fill ${strength.level}`;
    
    // Update strength text
    strengthText.textContent = getPasswordStrengthText(strength.level);
    strengthText.className = `strength-text ${strength.level}`;
    
    // Show/hide strength indicator
    if (password) {
        strengthElement.style.display = 'block';
    } else {
        strengthElement.style.display = 'none';
    }
}

/**
 * Update field validation UI
 */
function updateFieldValidation(input, errorElement, successElement, result) {
    if (result.error) {
        errorElement.textContent = result.error;
        if (successElement) successElement.textContent = '';
        input.classList.remove('valid');
        input.classList.add('invalid');
    } else if (input.value) {
        errorElement.textContent = '';
        if (successElement) successElement.textContent = '✓';
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        errorElement.textContent = '';
        if (successElement) successElement.textContent = '';
        input.classList.remove('valid', 'invalid');
    }
}

/**
 * Display validation errors
 */
function displayValidationErrors(results) {
    Object.keys(results).forEach(field => {
        const result = results[field];
        if (result.error) {
            const errorElement = document.getElementById(`${field}Error`);
            if (errorElement) {
                errorElement.textContent = result.error;
            }
        }
    });
    
    // Focus first invalid field
    const firstInvalidField = document.querySelector('.form-group input.invalid') || 
                             document.querySelector('.form-group input:invalid');
    if (firstInvalidField) {
        firstInvalidField.focus();
    }
}

/**
 * Handle registration errors
 */
function handleRegistrationError(error) {
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.message) {
        const message = error.message.toLowerCase();
        
        if (message.includes('username') && message.includes('exists')) {
            errorMessage = 'Username already exists. Please choose a different username.';
            document.getElementById('username').focus();
        } else if (message.includes('email') && message.includes('exists')) {
            errorMessage = 'Email already registered. Please use a different email or login.';
            document.getElementById('email').focus();
        } else if (message.includes('device') && message.includes('registered')) {
            errorMessage = 'This device is already registered to another account.';
        } else if (message.includes('network') || message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (message.includes('server') || message.includes('500')) {
            errorMessage = 'Server error. Please try again later.';
        } else {
            errorMessage = error.message;
        }
    }
    
    showError(errorMessage);
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleBtn = document.getElementById(`toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}`);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = 'Show';
    }
}

/**
 * Set loading state for register button
 */
function setLoadingState(isLoading) {
    const registerButton = document.getElementById('registerButton');
    const buttonText = registerButton.querySelector('.button-text');
    const loadingSpinner = registerButton.querySelector('.loading-spinner');
    
    if (isLoading) {
        registerButton.disabled = true;
        registerButton.classList.add('loading');
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    } else {
        registerButton.disabled = false;
        registerButton.classList.remove('loading');
        buttonText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

/**
 * Show error message
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
 */
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        successElement.style.display = 'block';
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
    }
}

/**
 * Clear all messages
 */
function clearMessages() {
    clearError();
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.classList.remove('show');
        successElement.style.display = 'none';
        successElement.textContent = '';
    }
}

/**
 * Clear form data
 */
function clearForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.reset();
        
        // Clear validation states
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        // Clear error messages
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Clear success indicators
        const successElements = form.querySelectorAll('.field-success');
        successElements.forEach(element => {
            element.textContent = '';
        });
        
        // Hide password strength
        const strengthElement = document.getElementById('passwordStrength');
        if (strengthElement) {
            strengthElement.style.display = 'none';
        }
    }
}

/**
 * Show terms and conditions modal
 */
function showTermsModal() {
    // Use the modal from terms-modal.js
    if (typeof window.showTermsModal === 'function') {
        window.showTermsModal();
    } else {
        // Fallback to alert if modal not available
        alert(`Terms and Conditions\n\nBy creating an account, you agree to our terms of service and privacy policy. Please read them carefully before proceeding.`);
    }
}

/**
 * Debounce function for input validation
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Handle Enter key on form
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.form && activeElement.form.id === 'registerForm') {
            // If on last field, submit form
            if (activeElement.id === 'acceptTerms') {
                e.preventDefault();
                handleRegistration(e);
            }
        }
    }
    
    // Handle Escape key to clear errors
    if (e.key === 'Escape') {
        clearMessages();
    }
});

/**
 * Debug function for registration
 */
function debugRegistration() {
    console.log('Registration Debug Info:');
    console.log('Form Data:', {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        passwordLength: document.getElementById('password').value.length,
        confirmPasswordMatch: document.getElementById('password').value === document.getElementById('confirmPassword').value,
        termsAccepted: document.getElementById('acceptTerms').checked
    });
    getDeviceInfo().then(info => console.log('Device Info:', info));
}

// Make debug function available globally
window.debugRegistration = debugRegistration;
