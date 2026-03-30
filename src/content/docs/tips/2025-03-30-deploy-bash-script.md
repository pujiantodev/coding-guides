---
title: 🚀 Deploy Laravel + Vue Lebih Cepat dengan Bash Script (Alternatif CI/CD)
description: Berbagi pengalaman tentang proses Deploy aplikasi di server production. Alih-alih menggunakan CI/CD saya memilih alternatif lain yaitu Bash Script.
---

Hai, saya Eko, Web Developer dan pengguna laravel. Kali ini saya akan berbagi pengalaman tentang proses Deploy aplikasi di server production. Alih-alih menggunakan CI/CD saya memilih alternatif lain yaitu “Bash Script”

**Kenapa saya pilih Bash Script?**

Karena malas setup CI/CD, cari yang simple dan just work. Siapkan scriptnya, run script, beres.

> Memang setup CI/CD adalah investasi jangka panjang, ribet di awal setelahnya sudah otomatis jalan.

## 📁 Buat file script

Misalnya:

```bash
/home/user/scripts/deploy-app.sh
```

---

# 🧠 Full Script Deploy (Versi Generic)

```bash
#!/bin/bash

APP_DIR="/var/www/my-awesome-app"
BRANCH="main"
LOCKFILE="/tmp/deploy-app.lock"
LOGFILE="/home/user/scripts/deploy-app.log"

set -e

if [ -f "$LOCKFILE" ]; then
  echo "Deploy sedang berjalan!"
  exit 1
fi

trap "rm -f $LOCKFILE" EXIT
touch $LOCKFILE

exec > >(tee -i $LOGFILE)
exec 2>&1

echo "🚀 Deploy started at $(date)"

cd $APP_DIR

echo "📥 Pull latest code..."
git pull origin $BRANCH

echo "📦 Install PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "📦 Install JS dependencies..."
pnpm install --frozen-lockfile

echo "🏗 Build frontend..."
pnpm build

echo "🗄 Run migration..."
php artisan migrate --force

echo "⚙️ Clear cache..."
php artisan optimize:clear

echo "⚡ Optimize..."
php artisan optimize

echo "🔐 Reset permission cache..."
php artisan permission:cache-reset

echo "⏰ Run scheduler..."
php artisan schedule:run

echo "🔄 Restart supervisor..."
sudo supervisorctl restart all

echo "✅ Deploy selesai $(date)"
```

---

# 🔧 Setup

## 1. Beri permission

```bash
chmod +x /home/user/scripts/deploy-app.sh
```

---

## 2. Jalankan

```bash
/home/user/scripts/deploy-app.sh
```

Dan semua berjalan dengan aman.

---

Oh ya ada tips lagi biar lebih gampang, yaitu tambahkan **alias**:

Tambahkan alias:

```bash
alias deploy-app="/home/user/scripts/deploy-app.sh"
```

Sekarang cukup:

```bash
deploy-app
```
