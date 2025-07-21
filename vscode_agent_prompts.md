# VS Code Agent Prompts - Step by Step Migration ke Hybrid Approach

## 🎯 Overview
Berikut adalah prompt-prompt yang dapat Anda gunakan dengan VS Code Agent untuk migrasi dari database-based device ID ke local storage approach secara bertahap.

---

## 📋 PHASE 1: DATABASE MIGRATION

### Step 1.1: Schema Migration
```bash
# Prompt untuk VS Code Agent:
Modify the Prisma schema file (prisma/schema.prisma) to:
1. Remove the deviceId field from User model
2. Remove the deviceId field from Token model  
3. Add deviceHash String? field to User model
4. Add deviceHash String field to Token model
5. Create a migration script to handle the schema changes
6. Ensure all existing relationships remain intact

Please provide the updated schema and migration commands.
```

### Step 1.2: Migration Script Creation
```bash
# Prompt untuk VS Code Agent:
Create a database migration script that:
1. Adds the new deviceHash columns to existing tables
2. Generates temporary hashes for existing users (if any) using their current deviceId
3. Removes the old deviceId columns after data migration
4. Provides rollback capability in case of issues

Include both the Prisma migration and any custom SQL needed.
```

---

## 📋 PHASE 2: BACKEND SERVICES UPDATE

### Step 2.1: Auth Service Refactoring
```bash
# Prompt untuk VS Code Agent:
Refactor src/services/authService.js to:
1. Replace all deviceId logic with deviceHash validation
2. Update register() method to accept and validate deviceHash instead of deviceId
3. Update login() method to compare deviceHash instead of deviceId
4. Modify token creation to use deviceHash
5. Remove any deviceId storage logic
6. Add hash validation functions
7. Maintain the same security level and functionality

Ensure backward compatibility during migration period.
```

### Step 2.2: Device Service Update
```bash
# Prompt untuk VS Code Agent:
Update src/services/deviceService.js to:
1. Remove all direct deviceId storage and retrieval
2. Implement deviceHash validation logic
3. Update registerDevice() to work with hashes
4. Update changeDevice() to validate new device hashes
5. Modify validateDevice() to use hash comparison
6. Update getDeviceInfo() to return hash-related information instead of device IDs
7. Add hash generation utilities if needed

Keep the same API contract but change internal implementation.
```

### Step 2.3: Controllers Update
```bash
# Prompt untuk VS Code Agent:
Update src/controllers/authController.js and src/controllers/userController.js to:
1. Modify request handling to expect deviceHash instead of deviceId
2. Update response formatting to exclude sensitive device information
3. Change validation logic to work with hashes
4. Update error messages to be hash-appropriate
5. Ensure all controller methods work with the new hash-based system
6. Add proper error handling for hash validation failures

Maintain the same API endpoints but update the data handling.
```

---

## 📋 PHASE 3: MIDDLEWARE UPDATES

### Step 3.1: Authentication Middleware
```bash
# Prompt untuk VS Code Agent:
Modify src/middleware/authMiddleware.js to:
1. Update token validation to work with deviceHash
2. Change authenticateToken() to validate hash instead of deviceId
3. Update database queries to use deviceHash fields
4. Modify token verification logic for hash-based validation
5. Update error handling for hash-related authentication failures
6. Ensure session validation works with the new hash system

Keep the middleware interface the same but update internal logic.
```

### Step 3.2: Device Middleware
```bash
# Prompt untuk VS Code Agent:
Update src/middleware/deviceMiddleware.js to:
1. Modify validateDevice() to work with deviceHash instead of deviceId
2. Update checkDeviceRegistration() for hash-based validation
3. Change device comparison logic to use hashes
4. Update error messages for hash validation failures
5. Add hash format validation
6. Ensure device middleware works with the new hash-based system

Maintain the same middleware behavior but update for hash validation.
```

---

## 📋 PHASE 4: FRONTEND CORE UPDATES

### Step 4.1: Enhanced Device Management
```bash
# Prompt untuk VS Code Agent:
Completely refactor frontend/js/device.js to:
1. Implement secure local device ID generation with multiple entropy sources (MAC address, hostname, hardware specs, installation UUID)
2. Add local encrypted storage for device ID using Electron's secure storage
3. Create deviceHash generation function for backend communication
4. Implement device integrity checking to prevent copying
5. Add anti-tampering detection mechanisms
6. Create secure device ID persistence that survives app updates
7. Add device fingerprinting validation
8. Ensure device ID is never exposed in plain text to backend

This should be a complete rewrite focusing on local storage and security.
```

### Step 4.2: Storage Management Update
```bash
# Prompt untuk VS Code Agent:
Update frontend/js/storage.js to:
1. Remove any device ID storage in browser storage
2. Add functions to generate device hashes for API calls
3. Implement secure local device data management
4. Add encryption/decryption functions for sensitive device data
5. Create device hash caching for performance
6. Add device validation state management
7. Ensure no sensitive device information is stored in browser storage

Focus on security and performance optimization.
```

### Step 4.3: API Communication Update
```bash
# Prompt untuk VS Code Agent:
Modify frontend/js/api.js to:
1. Update all API calls to send deviceHash instead of deviceId
2. Modify login() function to generate and send device hash
3. Update register() function for hash-based registration
4. Change all authentication-related API calls to use hashes
5. Add device hash generation before each API call
6. Update error handling for hash-related failures
7. Ensure no plain device IDs are sent to backend

Maintain the same API interface but update data handling.
```

---

## 📋 PHASE 5: ELECTRON INTEGRATION

### Step 5.1: Main Process Device Handling
```bash
# Prompt untuk VS Code Agent:
Create or update the Electron main process file to:
1. Implement secure device ID generation using Node.js crypto and OS modules
2. Add IPC handlers for device ID operations (get-device-id, validate-device)
3. Implement encrypted storage using electron-store with encryption
4. Add hardware fingerprinting using system information
5. Create device integrity validation
6. Add installation-specific UUID generation and storage
7. Implement secure communication between main and renderer processes
8. Add device tampering detection

This should handle all device-related operations securely in the main process.
```

### Step 5.2: Renderer Process Integration
```bash
# Prompt untuk VS Code Agent:
Update the renderer process integration to:
1. Add IPC communication for device operations
2. Update frontend/js/device.js to use Electron IPC instead of browser-based generation
3. Implement fallback mechanisms for non-Electron environments
4. Add proper error handling for IPC failures
5. Create device hash generation using main process data
6. Ensure secure communication between renderer and main process
7. Add device validation workflows

Focus on secure IPC communication and fallback handling.
```

---

## 📋 PHASE 6: SECURITY ENHANCEMENTS

### Step 6.1: Advanced Security Measures
```bash
# Prompt untuk VS Code Agent:
Add advanced security measures to the device system:
1. Implement device binding that ties device ID to user account creation
2. Add time-based device validation that changes hashes periodically
3. Create device challenge-response validation
4. Implement device attestation mechanisms
5. Add hardware-based entropy collection
6. Create device clone detection algorithms
7. Add network-based device validation
8. Implement device revocation mechanisms

Focus on preventing device ID copying and unauthorized access.
```

### Step 6.2: Encryption and Protection
```bash
# Prompt untuk VS Code Agent:
Implement comprehensive encryption and protection:
1. Add AES-256 encryption for local device ID storage
2. Implement key derivation using user credentials and hardware info
3. Create secure key management for device encryption
4. Add integrity checking with HMAC validation
5. Implement secure device data wiping on app uninstall
6. Create backup and recovery mechanisms for device IDs
7. Add protection against memory dumps and debugging
8. Implement secure device migration for app updates

Ensure maximum security for local device storage.
```

---

## 📋 PHASE 7: TESTING AND VALIDATION

### Step 7.1: Integration Testing
```bash
# Prompt untuk VS Code Agent:
Create comprehensive tests for the new device system:
1. Unit tests for device hash generation and validation
2. Integration tests for the complete authentication flow
3. Security tests for device copying prevention
4. Performance tests for hash generation and validation
5. Error handling tests for various failure scenarios
6. Migration tests to ensure smooth transition
7. Backward compatibility tests
8. Load tests for hash validation under high load

Provide test files and testing strategies.
```

### Step 7.2: Security Validation
```bash
# Prompt untuk VS Code Agent:
Create security validation and penetration testing scenarios:
1. Device ID copying attack simulations
2. Hash collision testing
3. Local storage tampering tests
4. IPC communication security tests
5. Encryption key extraction attempts
6. Device fingerprint spoofing tests
7. Network-based device validation bypass tests
8. Time-based attack simulations

Provide security test cases and validation methods.
```

---

## 📋 PHASE 8: DEPLOYMENT AND MONITORING

### Step 8.1: Deployment Preparation
```bash
# Prompt untuk VS Code Agent:
Prepare the application for deployment with the new device system:
1. Update environment configurations for hash-based validation
2. Create deployment scripts that handle database migration
3. Add monitoring and logging for device-related operations
4. Update documentation for the new device system
5. Create rollback procedures in case of issues
6. Add health checks for device validation systems
7. Update API documentation to reflect hash-based endpoints
8. Create migration guides for existing users

Ensure smooth deployment with minimal downtime.
```

### Step 8.2: Monitoring and Analytics
```bash
# Prompt untuk VS Code Agent:
Implement monitoring and analytics for the device system:
1. Add logging for device hash generation and validation
2. Create metrics for device authentication success/failure rates
3. Implement alerting for suspicious device activities
4. Add analytics for device copying attempts
5. Create dashboards for device system health
6. Add performance monitoring for hash operations
7. Implement audit trails for device-related operations
8. Create reporting for device security incidents

Focus on operational visibility and security monitoring.
```

---

## 🎯 EXECUTION ORDER

**Recommended sequence untuk optimal results:**

1. **PHASE 1** → Database foundation
2. **PHASE 2** → Backend services
3. **PHASE 3** → Middleware updates
4. **PHASE 4** → Frontend core
5. **PHASE 5** → Electron integration
6. **PHASE 6** → Security enhancements
7. **PHASE 7** → Testing validation
8. **PHASE 8** → Deployment preparation

## 💡 TIPS UNTUK VS CODE AGENT

### Before Each Phase:
- Review current code structure
- Backup current working version
- Test existing functionality

### After Each Step:
- Validate changes work correctly
- Run existing tests
- Check for breaking changes

### General Guidelines:
- Ask for explanations if code changes are unclear
- Request additional error handling if needed
- Ask for performance optimizations when relevant
- Request security best practices implementation

---

**Note**: Gunakan prompt-prompt ini secara berurutan untuk hasil optimal. Setiap phase membangun di atas phase sebelumnya, jadi pastikan satu phase selesai sempurna sebelum lanjut ke phase berikutnya.