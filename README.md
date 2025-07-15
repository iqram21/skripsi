# Device-Restricted Authentication Electron App

A secure Electron application that implements JWT authentication with device ID restrictions, ensuring one account can only be used on one device.

## Features

- **Device-Restricted Authentication**: Each user account is tied to a specific device ID
- **JWT Token-based Authentication**: Secure token-based authentication system
- **Modern UI**: Clean, responsive design with loading states and error handling
- **Electron Integration**: Native desktop application with system-level device ID generation
- **Session Management**: Support for "Remember Me" functionality
- **Auto-logout**: Automatic token validation and logout on expiration
- **Security**: Proper input validation and error handling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Running Express.js backend server (on `http://localhost:3000`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd device-restricted-auth-app
```

2. Install dependencies:
```bash
npm install
```

3. Ensure your backend server is running on `http://localhost:3000`

## Development

Run the application in development mode:
```bash
npm run dev
```

Run the application in production mode:
```bash
npm start
```

## Building

Build the application for distribution:
```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

## Project Structure

```
device-restricted-auth-app/
├── main.js                 # Electron main process
├── package.json           # Project configuration
├── README.md             # This file
├── frontend/             # Frontend application
│   ├── pages/           # HTML pages
│   │   ├── login.html   # Login page
│   │   └── dashboard.html # Dashboard page
│   ├── css/             # Stylesheets
│   │   ├── common.css   # Common styles
│   │   └── login.css    # Login-specific styles
│   ├── js/              # JavaScript modules
│   │   ├── api.js       # API communication
│   │   ├── auth.js      # Authentication logic
│   │   ├── device.js    # Device ID handling
│   │   ├── storage.js   # Storage management
│   │   └── dashboard.js # Dashboard logic
│   └── assets/          # Static assets
│       └── images/      # Images
└── backend-express/     # Backend server (existing)
```

## Usage

### Login Process

1. Launch the application
2. The app will automatically generate a unique device ID
3. Enter your username and password
4. Click "Login" to authenticate
5. If successful, you'll be redirected to the dashboard

### Device ID Generation

The application generates a unique device ID using:
- Hostname
- Platform information
- System architecture
- Network MAC address
- CPU model
- Total memory

This information is hashed using SHA-256 to create a unique identifier for each device.

### Authentication Flow

1. **Device ID Generation**: Unique ID is generated on first launch
2. **Login Request**: Username, password, and device ID are sent to the backend
3. **Token Storage**: JWT token is stored securely (localStorage or sessionStorage)
4. **Auto-validation**: Token is automatically validated on page load and periodically
5. **Logout**: Token is invalidated and user is redirected to login

## API Integration

The frontend communicates with the backend using the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/refresh` - Token refresh
- `GET /api/user/profile` - User profile data

## Security Features

- **Device Restriction**: Each account is tied to a specific device
- **Token Validation**: Automatic token validation and refresh
- **Input Sanitization**: Proper input validation and sanitization
- **Error Handling**: Comprehensive error handling for various scenarios
- **Secure Storage**: Tokens are stored securely in browser storage
- **Auto-logout**: Automatic logout on token expiration

## Configuration

### Environment Variables

Create a `.env` file in the root directory:
```
NODE_ENV=development
API_BASE_URL=http://localhost:3000/api
```

### Backend Configuration

Ensure your backend server is configured with:
- CORS enabled for the Electron app
- JWT authentication middleware
- Device ID validation
- User management endpoints

## Troubleshooting

### Common Issues

1. **"Unable to generate device ID"**
   - Ensure Electron APIs are available
   - Check main process IPC handlers
   - Verify node integration is enabled

2. **"Network error"**
   - Ensure backend server is running
   - Check API endpoint URLs
   - Verify CORS configuration

3. **"Token expired"**
   - Tokens expire after a set time
   - Re-login to get a new token
   - Check token refresh mechanism

### Debug Functions

The application includes debug functions accessible from the browser console:

```javascript
// Login page debug
debugAuth()

// Dashboard page debug
debugDashboard()
```

## Development Tips

1. **Hot Reload**: Use `npm run dev` for development with hot reload
2. **DevTools**: Developer tools are enabled in development mode
3. **Console Logging**: Check console for detailed error messages
4. **Network Tab**: Monitor API requests in the network tab
5. **Storage**: Check localStorage/sessionStorage for token data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review the backend API documentation
- Open an issue in the repository
- Contact the development team

## Changelog

### Version 1.0.0
- Initial release
- Basic authentication with device restriction
- Login and dashboard pages
- Token management and validation
- Device ID generation and validation
- Modern UI with responsive design
