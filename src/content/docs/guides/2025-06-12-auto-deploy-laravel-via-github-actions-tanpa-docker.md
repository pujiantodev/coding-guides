---
title: Auto Deploy Laravel via GitHub Actions (Tanpa Docker)
description: sedikit pengalaman saat mencoba membuat auto deploy laravel via github actions.
lastUpdated: 2025-06-12
sidebar:
  label: Auto Deploy GitHub Actions
  badge:
    text: Baru
---

Ini adalah rangkuman lengkap tentang cara melakukan auto deploy Laravel menggunakan GitHub Actions tanpa Docker. Saya membuat ini dengan bantuan chatGPT, termasuk rangkuman yang akan kamu di bawah ini.

## 1. 👤 **Buat User `deploy` di Server**

```bash
sudo adduser --disabled-password --gecos "" deploy
```

* Tanpa password login
* Tidak masuk ke grup `sudo`

---

## 2. 🔐 **Setup SSH Key untuk GitHub Actions → Server (Akses ke Server)**

### Di lokal:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy_key -C "github-deploy"
```

* Upload **private key** ke GitHub Secrets:

  * `SSH_PRIVATE_KEY`: isi dari `github_deploy_key`
* Tempelkan **public key** ke server:

```bash
sudo mkdir -p /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys
# Paste isi github_deploy_key.pub
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

---

## 3. 🗝️ **Setup SSH Key untuk Server → GitHub (akses `git pull`)**

### Di server (user `deploy`):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_server_github -C "server-github"
chmod 600 ~/.ssh/id_ed25519_server_github
```

### Tambahkan public key (`.pub`) ke:

> **GitHub → Repo → Settings → Deploy Keys → Add Deploy Key**

* Centang: `Allow write access` (jika butuh)

### SSH config:

```bash
nano ~/.ssh/config
```

```ini
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_server_github
  IdentitiesOnly yes
```

---

## 4. 🔄 **Ubah Git Remote di Server menjadi SSH**

```bash
cd /var/www/your-laravel-project
git remote set-url origin git@github.com:username/repo.git
```

---

## 5. 🔐 **Tambahkan GitHub ke known\_hosts di Server**

```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts
```

---

## 6. 📂 **Beri Akses Penuh ke Folder Laravel**

```bash
sudo chown -R deploy:www-data /var/www/your-laravel-project
sudo chmod -R ug+rw /var/www/your-laravel-project
sudo find /var/www/your-laravel-project -type d -exec chmod 775 {} \;
```

---

## 7. 🔒 **Izinkan `deploy` Restart Queue tanpa Password**

```bash
sudo visudo
```

Tambahkan:

```
deploy ALL=(ALL) NOPASSWD: /usr/bin/supervisorctl restart queue-all
```

---

## 8. 🔐 **Tambahkan Secrets di GitHub Repo**

| Name                 | Value                           |
| -------------------- | ------------------------------- |
| `SSH_PRIVATE_KEY`    | isi dari `github_deploy_key`    |
| `DEPLOY_SERVER_USER` | `deploy`                        |
| `DEPLOY_SERVER_IP`   | IP public server                |
| `DEPLOY_APP_PATH`    | `/var/www/your-laravel-project` |

---

## 9. 🚀 **File GitHub Actions: `.github/workflows/deploy-prod.yml`**

```yaml
name: Deploy Laravel to Production

on:
  push:
    branches:
      - prod

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repo
        uses: actions/checkout@v3

      - name: 🔐 Setup SSH Key
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: 📡 Add known hosts (server & GitHub)
        run: |
          ssh-keyscan -H ${{ secrets.DEPLOY_SERVER_IP }} >> ~/.ssh/known_hosts
          ssh-keyscan -H github.com >> ~/.ssh/known_hosts

      - name: 🚀 Deploy to Server
        run: |
          ssh ${{ secrets.DEPLOY_SERVER_USER }}@${{ secrets.DEPLOY_SERVER_IP }} << 'EOF'
            ssh-keyscan github.com >> ~/.ssh/known_hosts

            cd ${{ secrets.DEPLOY_APP_PATH }}
            git pull origin prod

            composer install --no-dev --optimize-autoloader
            pnpm install
            pnpm build

            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache

            sudo /usr/bin/supervisorctl restart queue-all
            echo "✅ Deployment complete!"
          EOF
```

---

## 🧪 **Test**

* Push ke branch `prod`
* GitHub Actions jalan
* Server otomatis menarik kode terbaru, install dependensi, build, dan restart queue
