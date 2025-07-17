# 🛡️ Sistem Autentikasi dengan Pembatasan Device

<div align="center">
  <img src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</div>

## 📋 Deskripsi Proyek

Proyek ini adalah implementasi sistem autentikasi yang inovatif dengan pembatasan device menggunakan JWT (JSON Web Token) dan Device ID unik. Sistem ini dirancang untuk memastikan bahwa satu akun pengguna hanya dapat digunakan pada satu device secara bersamaan, sehingga meningkatkan keamanan dan mencegah sharing akun antar device.

Proyek ini dikembangkan menggunakan **Electron** untuk frontend desktop application dan **Express.js** dengan **Prisma ORM** untuk backend API, serta **MySQL** sebagai database. Sistem ini cocok untuk aplikasi yang memerlukan tingkat keamanan tinggi seperti aplikasi perbankan, sistem manajemen internal perusahaan, atau aplikasi dengan data sensitif.

## 🎯 Tujuan Proyek

- **Keamanan Maksimal**: Membatasi penggunaan satu akun hanya pada satu device untuk mencegah akses tidak sah
- **Device Binding**: Mengikat akun pengguna dengan device ID unik yang tergenerate secara otomatis
- **Auto Session Management**: Logout otomatis dari device lama ketika login dilakukan dari device baru
- **Modern Authentication**: Implementasi autentikasi modern menggunakan JWT token dengan refresh token
- **User Experience**: Memberikan pengalaman pengguna yang seamless dengan desktop application

## ✨ Fitur Utama

### 🔐 Keamanan
- **JWT Authentication**: Token-based authentication yang aman dengan access token dan refresh token
- **Device ID Binding**: Setiap akun terikat dengan device ID unik yang tidak dapat diubah
- **Password Encryption**: Enkripsi password menggunakan bcrypt dengan salt rounds tinggi
- **Rate Limiting**: Pembatasan jumlah request untuk mencegah brute force attack
- **Secure Headers**: Implementasi Helmet.js untuk header security

### 🖥️ Aplikasi Desktop
- **Electron Framework**: Aplikasi desktop cross-platform (Windows, macOS, Linux)
- **Modern UI**: Interface yang clean dan responsif dengan CSS modern
- **Auto Device Detection**: Deteksi device ID otomatis tanpa input manual dari user
- **Local Storage**: Penyimpanan token secara aman menggunakan Electron Store
- **Real-time Validation**: Validasi input form secara real-time

### 🔄 Session Management
- **Auto Logout**: Logout otomatis dari device lama saat login dari device baru
- **Token Refresh**: Sistem refresh token untuk menjaga session tetap aktif
- **Session Monitoring**: Monitoring status login dan validasi token secara berkala
- **Device Mismatch Detection**: Deteksi otomatis jika token digunakan dari device berbeda

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** v18.0.0+ - Runtime environment
- **Express.js** v4.18.2 - Web application framework
- **Prisma ORM** v5.7.1 - Database ORM dan migrations
- **MySQL** v8.0+ - Relational database
- **JWT** (jsonwebtoken) - Authentication tokens
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Cors** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **Rate Limiter** - Request rate limiting

### Frontend (Desktop Application)
- **Electron** v27.0.0 - Cross-platform desktop framework
- **HTML5** - Markup language
- **CSS3** - Styling dengan modern features
- **JavaScript (Vanilla)** - Client-side scripting
- **Electron Store** - Secure local storage
- **Fetch API** - HTTP client

### Development Tools
- **Git** - Version control
- **Visual Studio Code** - Code editor
- **Postman** - API testing
- **MySQL Workbench** - Database management
- **Nodemon** - Development server
- **Prisma Studio** - Database GUI

## 📌 Persyaratan Sistem

### Minimum Requirements
- **Node.js** v16.0.0 atau lebih tinggi
- **MySQL** v8.0 atau lebih tinggi
- **NPM** v8.0.0 atau Yarn v1.22.0
- **Git** v2.30.0 atau lebih tinggi

### Recommended Requirements
- **Node.js** v18.0.0 atau lebih tinggi
- **MySQL** v8.0.30 atau lebih tinggi
- **RAM** minimum 4GB (8GB recommended)
- **Storage** minimum 500MB free space

### Operating System Support
- **Windows**: Windows 10 version 1903 atau lebih tinggi
- **macOS**: macOS 10.15 (Catalina) atau lebih tinggi
- **Linux**: Ubuntu 18.04, Debian 10, atau distribusi setara

## 🚀 Cara Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/iqram21/skripsi.git
cd skripsi
```

### 2. Instalasi Backend
```bash
cd backend-express
npm install
```

### 3. Konfigurasi Database
1. Buat database MySQL baru:
```sql
CREATE DATABASE device_auth_db;
```

2. Buat file `.env` di folder `backend-express`:
```bash
cp .env.example .env
```

3. Edit file `.env` dengan konfigurasi database Anda:
```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/device_auth_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Migrasi Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio untuk melihat data
npx prisma studio
```

### 5. Instalasi Frontend (Electron)
```bash
cd ../
npm install
```

### 6. Verifikasi Instalasi
```bash
# Test backend
cd backend-express
npm run dev

# Test frontend (buka terminal baru)
cd ../
npm run dev
```

## 💻 Cara Menjalankan Aplikasi

### Menjalankan Backend Server
```bash
# Masuk ke folder backend
cd backend-express

# Mode development (dengan auto-reload)
npm run dev

# Mode production
npm start

# Menjalankan Prisma Studio (optional)
npm run db:studio
```

### Menjalankan Frontend (Electron App)
```bash
# Masuk ke root folder
cd ../

# Mode development
npm run dev

# Mode production
npm start
```

### Build Aplikasi untuk Distribusi
```bash
# Build untuk Windows
npm run build-win

# Build untuk macOS
npm run build-mac

# Build untuk Linux
npm run build-linux

# Build untuk semua platform
npm run build
```

File hasil build akan tersimpan di folder `dist/`.

## 📁 Struktur Proyek

```
device-restricted-auth/
├── 📁 backend-express/                 # Backend API Server
│   ├── 📁 src/
│   │   ├── 📁 controllers/            # Logic controller untuk handling request
│   │   │   ├── authController.js      # Controller untuk authentication
│   │   │   └── userController.js      # Controller untuk user management
│   │   ├── 📁 middleware/             # Custom middleware
│   │   │   ├── authMiddleware.js      # JWT authentication middleware
│   │   │   ├── deviceMiddleware.js    # Device ID validation middleware
│   │   │   └── errorMiddleware.js     # Error handling middleware
│   │   ├── 📁 routes/                 # API routes definition
│   │   │   ├── authRoutes.js          # Authentication routes
│   │   │   └── userRoutes.js          # User management routes
│   │   ├── 📁 services/               # Business logic services
│   │   │   ├── authService.js         # Authentication business logic
│   │   │   ├── deviceService.js       # Device management logic
│   │   │   └── tokenService.js        # Token management service
│   │   ├── 📁 utils/                  # Helper functions
│   │   │   ├── jwt.js                 # JWT utility functions
│   │   │   └── validators.js          # Input validation helpers
│   │   ├── 📁 config/                 # Configuration files
│   │   │   ├── auth.js                # Authentication configuration
│   │   │   └── database.js            # Database configuration
│   │   └── app.js                     # Express app configuration
│   ├── 📁 prisma/                     # Database schema dan migrations
│   │   ├── schema.prisma              # Prisma database schema
│   │   └── 📁 migrations/             # Database migration files
│   ├── server.js                      # Entry point backend server
│   ├── package.json                   # Backend dependencies
│   └── .env                           # Environment variables
├── 📁 frontend/                       # Frontend files
│   ├── 📁 pages/                      # HTML pages
│   │   ├── login.html                 # Halaman login
│   │   ├── register.html              # Halaman registrasi
│   │   └── dashboard.html             # Halaman dashboard utama
│   ├── 📁 css/                        # Stylesheet files
│   │   ├── common.css                 # Common styles
│   │   ├── login.css                  # Login page styles
│   │   ├── register.css               # Register page styles
│   │   └── dashboard.css              # Dashboard styles
│   ├── 📁 js/                         # Frontend JavaScript
│   │   ├── api.js                     # API communication functions
│   │   ├── auth.js                    # Authentication handling
│   │   ├── dashboard.js               # Dashboard functionality
│   │   ├── device.js                  # Device ID management
│   │   ├── register.js                # Registration handling
│   │   ├── storage.js                 # Local storage management
│   │   ├── terms-modal.js             # Terms & conditions modal
│   │   └── validators.js              # Client-side validation
│   └── 📁 assets/                     # Static assets
│       └── 📁 images/                 # Images dan icons
├── main.js                            # Electron main process
├── package.json                       # Frontend dependencies
├── test-api.js                        # API testing script
└── README.md                          # Dokumentasi proyek
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Mendaftarkan user baru dengan device ID
- **Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "deviceId": "auto-generated-device-id"
}
```
- **Response Success (201)**:
```json
{
  "success": true,
  "message": "User berhasil didaftarkan",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "deviceId": "auto-generated-device-id"
    }
  }
}
```

#### 2. Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Login user dengan validasi device ID
- **Request Body**:
```json
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "deviceId": "auto-generated-device-id"
}
```
- **Response Success (200)**:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 3. Verify Token
- **URL**: `/auth/verify`
- **Method**: `GET`
- **Description**: Verifikasi validitas token
- **Headers**: `Authorization: Bearer {access_token}`

#### 4. Refresh Token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Description**: Refresh access token menggunakan refresh token
- **Headers**: `Authorization: Bearer {refresh_token}`

#### 5. Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: Logout user dan invalidate token
- **Headers**: `Authorization: Bearer {access_token}`

## 🎮 Cara Penggunaan

### 1. Registrasi Akun Baru
1. **Buka Aplikasi**: Jalankan aplikasi Electron
2. **Akses Halaman Register**: Klik link "Daftar Akun Baru" pada halaman login
3. **Isi Form Registrasi**:
   - **Username**: Minimal 3 karakter, unik
   - **Email**: Format email yang valid
   - **Password**: Minimal 6 karakter, kombinasi huruf besar, kecil, dan angka
   - **Device ID**: Otomatis tergenerate oleh sistem
4. **Submit**: Klik tombol "Daftar"
5. **Verifikasi**: Sistem akan memverifikasi data dan membuat akun

### 2. Login ke Aplikasi
1. **Masukkan Kredensial**: Username dan password
2. **Device ID**: Otomatis terdeteksi dari device yang sama saat registrasi
3. **Klik Login**: Sistem akan memverifikasi kredensial dan device ID
4. **Redirect**: Jika berhasil, akan diarahkan ke dashboard
5. **Token Management**: Token akan disimpan secara aman di local storage

### 3. Fitur Device Restriction
- **Satu Device**: Setiap akun hanya bisa digunakan di satu device
- **Auto Logout**: Login dari device berbeda akan logout device sebelumnya
- **Device Mismatch**: Error jika mencoba menggunakan token dari device lain
- **Security Alert**: Notifikasi jika ada percobaan akses dari device berbeda

## 🔧 Konsep Device ID

### Apa itu Device ID?
Device ID adalah identifier unik yang digunakan untuk mengidentifikasi device tertentu. Dalam proyek ini, Device ID digunakan untuk:

1. **Binding Account**: Mengikat akun user dengan device spesifik
2. **Security Layer**: Tambahan layer keamanan selain username/password
3. **Session Control**: Mengontrol di mana akun dapat digunakan
4. **Audit Trail**: Melacak aktivitas login dari device tertentu

### Cara Kerja Device ID
```
1. User melakukan registrasi
   ↓
2. Sistem generate Device ID unik
   ↓
3. Device ID disimpan di database terkait user
   ↓
4. Setiap login, sistem cek Device ID
   ↓
5. Jika Device ID cocok → Login berhasil
   ↓
6. Jika Device ID berbeda → Login ditolak
```

## 📊 Diagram Alur Autentikasi

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │    │  Device Check   │    │  JWT Generate   │
│                 │    │                 │    │                 │
│ 1. Input creds  │───▶│ 2. Validate     │───▶│ 3. Create token │
│ 2. Get DeviceID │    │    DeviceID     │    │ 4. Store token  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Device Match  │    │   Login Success │
                       │                 │    │                 │
                       │ If DeviceID !=  │    │ Return tokens   │
                       │ stored → REJECT │    │ Update lastLogin│
                       └─────────────────┘    └─────────────────┘
```

## ❗ Troubleshooting

### 🔴 Error: Device mismatch
**Gejala**: "Device ID tidak cocok dengan yang terdaftar"
**Penyebab**: Akun sedang digunakan di device lain atau device ID berubah
**Solusi**: 
1. Logout dari device lain terlebih dahulu
2. Jika masih error, hubungi administrator untuk reset device ID
3. Periksa apakah ada perubahan hardware yang signifikan

### 🔴 Error: Database connection failed
**Gejala**: "Cannot connect to database"
**Penyebab**: MySQL server tidak berjalan atau konfigurasi salah
**Solusi**:
1. Pastikan MySQL service berjalan
2. Cek konfigurasi database di file `.env`
3. Test koneksi database: `npx prisma db push`

### 🔴 Error: Electron white screen
**Gejala**: Aplikasi Electron menampilkan layar putih
**Penyebab**: Backend tidak berjalan atau error JavaScript
**Solusi**:
1. Pastikan backend berjalan di port 3000
2. Buka DevTools dan cek console error
3. Restart aplikasi Electron

## 🤝 Kontribusi

Proyek ini adalah bagian dari skripsi dan saat ini tidak menerima kontribusi eksternal. Namun, feedback dan saran selalu diterima.

## 👨‍💻 Developer

- **Nama**: [Nama Lengkap Developer]
- **Email**: [email@developer.com]
- **GitHub**: [github.com/iqram21](https://github.com/iqram21)
- **Institusi**: [Nama Universitas]
- **Program Studi**: [Nama Program Studi]

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Dosen Pembimbing**: [Nama Dosen Pembimbing]
- **Universitas**: [Nama Universitas]
- **Program Studi**: [Nama Program Studi]
- **Komunitas**: Stack Overflow, GitHub Community, dan developer community lainnya

---

<div align="center">
  <p><strong>© 2024 - Sistem Autentikasi dengan Pembatasan Device</strong></p>
  <p>Dibuat dengan ❤️ untuk keamanan yang lebih baik</p>
</div>

