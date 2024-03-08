---
title: Deploy Laravel
description: A guide in my new Starlight docs site.
---

Panduan deploy Laravel di server VPS Linux.

## Composer dan Artisan

- run

```shel
composer install --optimize-autoloader --no-dev
```

- run

```
php artisan optimize
```

- run

```
php artisan migrate
```

ini optional sesuai kebutuhan.

## Supervisor

ini digunakan jika menggunakan fitur job dan queue

- Status

```
sudo supervisorctl status
```

- Restart All

```
sudo supervisorctl restart all
```
