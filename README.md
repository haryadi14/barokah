# BAROKAH STORE — Panduan Hosting & Deployment

Website profil perusahaan dan katalog produk **Barokah Store** (Seminyak, Bali) berbasis **React + Vite + Express (Node.js)** dengan panel admin terintegrasi (`/admin`) tanpa ketergantungan database eksternal (Firebase/SQL).

---

## 1. Jenis Hosting yang Cocok (Penting!)

Aplikasi ini **memiliki backend Node.js (`server.ts`)** dan menyimpan file upload foto produk di disk server (`./storage/`). Oleh karena itu:

- **DISARANKAN:**
  - **Hostinger VPS (Ubuntu + Node.js + PM2 + Nginx)** — paling fleksibel, aman untuk penyimpanan file `storage/` ratusan hingga ribuan foto, dan batas upload besar bisa diatur bebas.
  - **Hosting Node.js dengan persistent disk** (disk permanen, tidak reset saat restart).
- **TIDAK DISARANKAN:**
  - **Shared Hosting PHP-only** (hanya HTML/PHP tanpa Node.js) — backend `/api/*` dan Admin Panel tidak akan berjalan.
  - **Serverless / Static Hosting** (Vercel / Netlify / GitHub Pages) — file upload di folder `storage/` akan hilang setiap kali deploy atau container restart.

---

## 2. Prasyarat Server

- **Node.js versi 22.6+ (disarankan Node 22 LTS)**  
  Script `"start": "node server.ts"` menjalankan file TypeScript secara langsung menggunakan fitur native Node.js v22+.  
  *(Jika VPS Anda memakai Node 20, jalankan start command dengan `npx tsx server.ts` atau upgrade ke Node 22).*
- **Reverse Proxy (Nginx / Apache / Panel Hosting)** dengan SSL (HTTPS) aktif.

---

## 3. Konfigurasi Environment Variables (`.env`)

Buat file `.env` di root folder project pada server (jangan commit `.env` ke Git). Anda dapat menyalin dari `.env.example`:

```env
NODE_ENV=production
PORT=3000

# Passcode server-side untuk login ke /admin (disarankan minimal 8-12 karakter acak)
ADMIN_PASSCODE=GantiDenganPasswordKuatAnda

# Secret tetap untuk token sesi login admin agar tidak logout otomatis saat server restart
SESSION_SECRET=isi_dengan_string_acak_panjang_minimal_32_karakter
```

### Catatan Variabel Penting:
1. **`NODE_ENV=production`**  
   Wajib diset di server production agar Express menyajikan hasil build static dari folder `dist/` (bukan mode dev Vite).
2. **`ADMIN_PASSCODE`**  
   - Jika diisi di `.env`, `/admin` akan selalu memakai passcode tersebut (tidak bisa di-claim lewat browser).
   - Jika dikosongkan, pengunjung pertama ke `/admin` bisa membuat passcode awal yang disimpan dalam bentuk hash `scrypt` di `storage/admin-auth.json`. **Untuk production, sangat disarankan mengisinya langsung di `.env` atau segera men-setup-nya setelah deploy.**
3. **`SESSION_SECRET`**  
   Jika tidak diisi, server membuat secret acak setiap kali restart sehingga admin harus login ulang setiap server direstart. Isi dengan karakter acak panjang agar sesi tetap stabil.
4. **`PORT`**  
   Default `3000`. Jika platform hosting memberi port khusus, sesuaikan di `.env` dan arahkan reverse proxy ke port tersebut.

---

## 4. Langkah Build & Deploy di VPS (Hostinger)

```bash
# 1. Install dependencies
npm install

# 2. Build frontend (menghasilkan folder dist/ beserta seluruh aset gambar)
npm run build

# 3. Jalankan server production (contoh memakai PM2 agar tetap hidup 24 jam)
NODE_ENV=production pm2 start "npm start" --name barokah-store
pm2 save
```

*(Jika menggunakan Node v20 atau di bawah v22.6, ganti perintah start PM2 menjadi `NODE_ENV=production pm2 start "npx tsx server.ts" --name barokah-store`).*

---

## 5. Konfigurasi Nginx & Batas Upload Foto (Bulk Upload)

Panel admin `/admin` mendukung **Bulk Upload hingga 60 foto sekaligus** (maksimal 8 MB per foto). Default batas upload Nginx biasanya hanya `1M`, sehingga upload banyak foto bisa gagal dengan error `413 Request Entity Too Large` jika belum dinaikkan.

Tambahkan `client_max_body_size` pada konfigurasi Nginx domain Anda:

```nginx
server {
    listen 80;
    server_name domainanda.com www.domainanda.com;

    # Izinkan bulk upload hingga ~100MB-250MB dalam 1 kali kirim
    client_max_body_size 250M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Jangan lupa aktifkan **HTTPS / SSL** (misalnya via Certbot / Let's Encrypt atau SSL bawaan Hostinger).

---

## 6. Penting: Folder `storage/` & Backup Data

Semua data yang Anda kelola melalui `/admin` disimpan di folder **`storage/`**:

- `storage/catalog-db.json` — daftar collections, categories, sub-categories, dan data produk.
- `storage/catalog/<category>/<sub-category>/...` — seluruh foto produk yang diupload lewat `/admin` (diakses publik di `/catalog-media/...`).
- `storage/admin-auth.json` — hash passcode admin (jika tidak memakai `ADMIN_PASSCODE` di `.env`).

### Yang HARUS Diperhatikan saat Update Kode:
1. **Jangan menimpa atau menghapus folder `storage/`** ketika melakukan `git pull`, upload ulang ZIP, atau deploy pembaruan kode.
2. **Lakukan backup berkala** pada folder `storage/` (misalnya mingguan atau sebelum update besar).
3. **Upload foto lewat `/admin` vs folder `src/assets/catalog/`**:
   - Foto yang diupload lewat **`/admin`** langsung aktif tanpa perlu `npm run build` ulang.
   - Jika Anda memasukkan ratusan foto langsung lewat folder `src/assets/catalog/...` di kode sumber, Anda **harus menjalankan `npm run build` ulang** lalu restart server agar terbaca oleh website.

---

## 7. Domain, WhatsApp Link Preview & Pengaturan Toko

- **Link Produk & Foto di Pesan WhatsApp:**  
  File `src/utils/whatsapp.ts` otomatis mengambil domain aktif dari browser (`window.location.origin`). Jadi saat website sudah online di domain resmi Anda (misalnya `https://barokahstore.com`), pesan WhatsApp otomatis mengirim link foto dan link detail style menggunakan domain asli tersebut—**tidak perlu ubah kode**.
- **Syarat Preview Gambar WhatsApp:**  
  Pastikan domain Anda sudah menggunakan **HTTPS (SSL valid)** dan dapat diakses publik tanpa firewall yang memblokir bot WhatsApp.
- **Informasi Toko, Nomor WA & Alamat (`src/data/brand.ts`):**  
  Jika suatu saat nomor WhatsApp (`+62 819-9913-0819`), alamat toko (`Jalan Camplung Tanduk No. 15, Seminyak, Bali`), atau link Google Maps berubah, edit pada `src/data/brand.ts` lalu jalankan `npm run build` dan restart server.
- **File Gambar Screenshot Chat Lama (Opsional):**  
  Jika folder `public/assets/aistudio/` masih ada dari proses preview/pengembangan, folder tersebut aman untuk dihapus sebelum upload ke server production karena tidak dipakai oleh halaman website.

---

## 8. Checklist Singkat Sebelum Go-Live

- [ ] Node.js 22+ terpasang (atau gunakan `tsx server.ts` jika Node 20).
- [ ] File `.env` sudah diisi (`NODE_ENV=production`, `ADMIN_PASSCODE`, `SESSION_SECRET`).
- [ ] `npm install` dan `npm run build` sukses tanpa error.
- [ ] Nginx / reverse proxy sudah mengarah ke port aplikasi dengan `client_max_body_size 250M`.
- [ ] HTTPS / SSL aktif pada domain.
- [ ] Sudah tes login ke `https://domainanda.com/admin`, coba upload 1 produk, lalu cek apakah foto terbuka di browser dan tombol **Inquire to WhatsApp** mengarah ke domain asli.
- [ ] Folder `storage/` masuk daftar pengecualian saat deploy ulang dan punya jadwal backup.
