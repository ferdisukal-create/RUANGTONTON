# RUANGTONTON 🎬

Personal media library & offline-first video player for Android.

RUANGTONTON adalah aplikasi untuk mengelola dan menonton video yang sudah tersimpan di perangkat Android Anda.

## Fitur Utama

✅ **Offline-First** - Tonton video lokal tanpa internet  
✅ **Album Management** - Buat album, tambah cover dari galeri  
✅ **Smart Player** - Video player dengan kontrol lengkap  
✅ **Continue Watching** - Lanjutkan tontonan dari posisi terakhir  
✅ **Bookmarks** - Tandai episode & moment favorit  
✅ **Watch History** - Riwayat tontonan  
✅ **Natural Sorting** - Episode diurutkan dengan cerdas  
✅ **Dark UI** - Estetika cinematic seperti Netflix  

## Tech Stack

- React Native + Expo
- SQLite (local database)
- ExoPlayer (video playback)
- TypeScript

## Instalasi

### Prerequisites
- Node.js >= 16
- npm atau yarn
- Expo CLI

### Setup

```bash
# Clone repository
git clone https://github.com/ferdisukal-create/RUANGTONTON.git
cd RUANGTONTON

# Install dependencies
npm install

# Start development server
npm start

# Scan QR code dengan Expo Go di HP
# atau jalankan di emulator
npm run android
```

## Build APK

```bash
# Preview build
npx eas build --platform android --profile preview

# Production build
npx eas build --platform android --profile production
```

## File Structure

```
src/
├── db/              # Database setup
├── models/          # Type definitions
├── services/        # Business logic
├── screens/         # UI screens
├── components/      # Reusable components
├── navigation/      # Route navigation
├── utils/           # Helper functions
└── App.tsx          # Entry point
```

## Kontribusi

Pull requests welcome!

## License

MIT
