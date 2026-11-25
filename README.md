# Kenal Hewan 🐾

Aplikasi Android untuk anak umur ±2 tahun mengenal hewan.

## Mode main
- **Kenalan** – 45 hewan dari 4 tempat (🏡 rumah, 🌳 hutan, 🌊 laut, 🌸 taman). Ketuk hewannya → hewan lompat dan "ngomong" (contoh: "Kucing! Meong meong!"). Geser kiri/kanan untuk ganti hewan.
- **Tebak** – "Mana kucing?" pilih dari 2 gambar (jadi 3 kalau sudah 5x benar berturut-turut). Benar → bintang + konfeti. Salah → cuma goyang, tidak ada hukuman.
- **Gelembung** – hewan melayang dalam gelembung, ketuk untuk memecahkan.

## Ramah anak
- Layar penuh, layar tidak mati sendiri.
- Tombol Back tidak menutup aplikasi (cuma balik ke beranda).
- Keluar aplikasi: **tahan tombol 🔒 selama 2 detik** di beranda.
- Suara pakai Text-to-Speech bahasa Indonesia bawaan HP (offline kalau data suara Indonesia sudah terpasang: Setelan → Sistem → Bahasa → Output text-to-speech).

## Build APK
1. Buat repo baru di GitHub, upload semua isi folder ini (termasuk folder `.github`).
2. Buka tab **Actions** → workflow **Build APK** jalan otomatis (atau klik *Run workflow*).
3. Setelah selesai, download artifact **KenalHewan-APK**, ekstrak, install `app-release.apk` di HP.

## Suara hewan asli
Taruh mp3 di `app/src/main/assets/sounds/` sesuai daftar di `sounds/DAFTAR_SUARA.md`. Yang belum ada otomatis pakai TTS.

## Suara narator (wanita, natural)
Saat build di GitHub Actions, `tools/narasi.py` otomatis membuat ±400 rekaman narator
(suara neural wanita bahasa Indonesia `id-ID-GadisNeural`) ke `app/src/main/assets/narasi/`.
Kalimatnya ada di `app/src/main/assets/data.js` (objek `P`). Ubah kalimat → push → rekaman dibuat ulang otomatis.
Kalau pembuatan rekaman gagal, build tetap jalan dan aplikasi pakai TTS bawaan HP.

## Ubah isi
Daftar hewan & kalimat narator: `app/src/main/assets/data.js`. Tampilan: `index.html`.
