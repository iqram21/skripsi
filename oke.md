# Agent Prompt - README Documentation untuk Proyek Autentikasi Device-Restricted

## Konteks Proyek
Anda adalah asisten dokumentasi yang bertugas membuat file README.md komprehensif dalam bahasa Indonesia untuk proyek skripsi yang mengimplementasikan sistem autentikasi dengan pembatasan device menggunakan JWT token dan Device ID. Proyek ini memastikan satu akun hanya dapat digunakan pada satu device.

## Tujuan Dokumentasi
Buat README.md yang profesional, lengkap, dan mudah dipahami yang mencakup:
1. Deskripsi proyek dan tujuan
2. Fitur-fitur utama
3. Teknologi yang digunakan
4. Cara instalasi
5. Cara menjalankan aplikasi
6. Struktur proyek
7. API Documentation
8. Troubleshooting
9. Kontribusi dan lisensi

## Struktur README yang Diharapkan

### 1. Header dan Deskripsi
```markdown
# Sistem Autentikasi dengan Pembatasan Device

## 📋 Deskripsi Proyek
[Jelaskan tentang proyek skripsi ini, fokus pada pembatasan akses login menggunakan JWT dan Device ID, serta manfaatnya untuk keamanan]

## 🎯 Tujuan Proyek
- Membatasi penggunaan satu akun hanya pada satu device
- Meningkatkan keamanan dengan Device ID unik
- Mencegah sharing akun antar device
- Implementasi autentikasi modern dengan JWT
```

### 2. Fitur Utama
```markdown
## ✨ Fitur Utama
- **Autentikasi JWT**: Token-based authentication yang aman
- **Device Binding**: Satu akun terikat pada satu device
- **Auto Logout**: Logout otomatis saat login dari device lain
- **Session Management**: Pengelolaan sesi yang efisien
- **Secure Password**: Enkripsi password dengan bcrypt
- **Real-time Validation**: Validasi input secara real-time
```

### 3. Teknologi Stack
```markdown
## 🛠️ Teknologi yang Digunakan

### Backend
- Node.js & Express.js
- Prisma ORM
- MySQL Database
- JWT (jsonwebtoken)
- Bcrypt
- Cors
- Dotenv

### Frontend (Electron)
- Electron Framework
- HTML5, CSS3, JavaScript (Vanilla)
- Electron Store
- Fetch API

### Development Tools
- Git & GitHub
- Visual Studio Code
- Postman (API Testing)
- MySQL Workbench
```

### 4. Persyaratan Sistem
```markdown
## 📌 Persyaratan Sistem
- Node.js v14.0.0 atau lebih tinggi
- MySQL 5.7 atau lebih tinggi
- NPM atau Yarn
- Git
- OS: Windows 10/11, macOS, atau Linux
```

### 5. Instalasi
```markdown
## 🚀 Cara Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/username/device-restricted-auth.git
cd device-restricted-auth
```

### 2. Instalasi Backend
```bash
cd backend
npm install
```

### 3. Konfigurasi Database
1. Buat database MySQL baru
2. Copy `.env.example` ke `.env`
3. Sesuaikan konfigurasi database di `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/nama_database"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=3000
```

### 4. Migrasi Database
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Instalasi Frontend (Electron)
```bash
cd ../frontend
npm install
```
```

### 6. Cara Menjalankan
```markdown
## 💻 Cara Menjalankan Aplikasi

### Menjalankan Backend
```bash
cd backend
npm run dev   # Mode development
npm start     # Mode production
```

### Menjalankan Frontend (Electron)
```bash
cd frontend
npm run dev   # Mode development
npm start     # Mode production
```

### Build Aplikasi
```bash
# Build untuk Windows
npm run build-win

# Build untuk macOS
npm run build-mac

# Build untuk Linux
npm run build-linux
```
```

### 7. Struktur Proyek
```markdown
## 📁 Struktur Proyek
```
device-restricted-auth/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Logic controller
│   │   ├── middlewares/    # Middleware autentikasi
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env                # Environment variables
│   └── server.js           # Entry point backend
├── frontend/
│   ├── main.js            # Electron main process
│   ├── preload.js         # Preload script
│   ├── pages/
│   │   ├── login.html     # Halaman login
│   │   ├── register.html  # Halaman registrasi
│   │   └── dashboard.html # Halaman dashboard
│   ├── css/               # Styling files
│   ├── js/                # Frontend JavaScript
│   └── assets/            # Images dan icons
└── README.md
```
```

### 8. API Documentation
```markdown
## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "deviceId": "string"
}
```

#### 2. Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "password": "string",
  "deviceId": "string"
}
```

#### 3. Refresh Token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {refresh_token}`

#### 4. Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {access_token}`
```

### 9. Penggunaan Aplikasi
```markdown
## 🎮 Cara Penggunaan

### 1. Registrasi Akun Baru
1. Buka aplikasi Electron
2. Klik link "Register" pada halaman login
3. Isi form registrasi:
   - Username (minimal 3 karakter)
   - Email (format email valid)
   - Password (minimal 6 karakter, kombinasi huruf besar, kecil, dan angka)
4. Device ID akan otomatis tergenerate
5. Klik "Create Account"

### 2. Login
1. Masukkan username dan password
2. Device ID akan otomatis terdeteksi
3. Klik "Login"
4. Jika berhasil, akan diarahkan ke dashboard

### 3. Device Restriction
- Jika mencoba login dari device berbeda, akan muncul error
- Akun lama akan otomatis logout jika dipaksa login dari device baru
- Satu akun = Satu device aktif
```

### 10. Troubleshooting
```markdown
## ❗ Troubleshooting

### Error: Device mismatch
**Solusi**: Akun Anda terdaftar pada device lain. Hubungi admin untuk reset device.

### Error: Database connection failed
**Solusi**: 
1. Pastikan MySQL service berjalan
2. Cek konfigurasi database di `.env`
3. Jalankan ulang `npx prisma migrate dev`

### Error: Electron white screen
**Solusi**:
1. Pastikan backend berjalan di port 3000
2. Cek console untuk error JavaScript
3. Clear cache: `npm run clear-cache`
```

### 11. Kontribusi dan Lisensi
```markdown
## 🤝 Kontribusi
Proyek ini adalah bagian dari skripsi dan tidak menerima kontribusi eksternal saat ini.

## 👨‍💻 Developer
- Nama: [Nama Anda]
- Email: [email@anda.com]
- Institusi: [Nama Universitas]

## 📄 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments
- Dosen Pembimbing: [Nama Dosen]
- Universitas: [Nama Universitas]
- Program Studi: [Nama Prodi]

---
**© 2024 - Sistem Autentikasi dengan Pembatasan Device**
```

## Instruksi Tambahan untuk Agent

1. **Gunakan Bahasa Indonesia yang Baik dan Benar**
   - Hindari penggunaan bahasa yang terlalu teknis
   - Jelaskan istilah asing dengan bahasa yang mudah dipahami
   - Berikan contoh konkret untuk setiap langkah

2. **Tambahkan Screenshot (Opsional)**
   - Placeholder untuk screenshot login page
   - Placeholder untuk screenshot register page
   - Placeholder untuk screenshot dashboard
   - Placeholder untuk screenshot error messages

3. **Formatting**
   - Gunakan emoji untuk membuat README lebih menarik
   - Gunakan syntax highlighting untuk code blocks
   - Buat table of contents yang dapat diklik
   - Pastikan struktur heading yang konsisten

4. **Informasi Tambahan**
   - Jelaskan konsep Device ID secara sederhana
   - Berikan diagram alur autentikasi (text-based)
   - Tambahkan FAQ section jika diperlukan
   - Sertakan informasi testing dan debugging

5. **Best Practices**
   - Jelaskan security best practices yang diimplementasikan
   - Berikan tips untuk deployment
   - Sertakan informasi backup dan recovery
   - Tambahkan changelog untuk versi mendatang

## Output yang Diharapkan
File README.md yang:
- Profesional dan informatif
- Mudah diikuti oleh developer pemula
- Lengkap dengan semua informasi penting
- Menarik secara visual dengan formatting yang baik
- Sesuai untuk