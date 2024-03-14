---
title: Autoformat and Sort class Tailwind CSS
description: Autoformat adn Sort class Tailwind CSS
---

Dengan tailwind css kita akan didapati menulisa banyak class pada tag html, tentu itu butuh penataan biar rapi. Maka dari itu sebenarnya tailwind css bersama prettier sudah menyediakan tools untuk penataan class yang terlalu banyak. Cek dibawah ini caranya.

- pastikan sudah terinstall Prettier pada project, dengan cara cek apda file `package.json`

```json
"devDependencies": {
        "prettier": "^3.0.3",
    }
```

jika belum bisa lakukan install secara manual dengan `run yarn add --dev --exact prettier` atau `npm i --dev --exact prettier`

- install prettier-plugin-tailwindcss untuk sorting tailwindcss :

`yarn`

```bash
yarn add -D prettier prettier-plugin-tailwindcss
```

`npm`

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

- Pada root project, buat file bernama `.prettierrc.json`
- Tambahkan kode pada file tersebut seperti dibawah ini :

```json
{
  "tabWidth": 4,
  "semi": true,
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```
