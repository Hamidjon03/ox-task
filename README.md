# 🏢 OX Company Management API

Bu loyiha NestJS asosida yaratilgan va kompaniya boshqaruvi hamda mahsulot qo‘shish API larini o‘z ichiga oladi.

## 📦 Texnologiyalar
- NestJS
- Prisma ORM
- PostgreSQL
- JWT (Authentication)
- Swagger (API hujjat)

---

## 🔐 Auth
Foydalanuvchi faqat `email` orqali login qiladi, unga OTP yuboriladi.

**POST** `/auth/login`  
**POST** `/auth/verify` → `access_token` qaytaradi

---

## 🏢 Company Endpoints

| Method | Endpoint              | Tavsif                                |
|--------|-----------------------|----------------------------------------|
| POST   | `/register-company`   | Tashqi OX API orqali kompaniya ro'yxatga olinadi |
| DELETE | `/company/:id`        | Kompaniyani admin o‘chira oladi       |

---

## 📦 Product Endpoints

| Method | Endpoint         | Tavsif                                |
|--------|------------------|----------------------------------------|
| POST   | `/products`      | Mahsulot yaratish                     |
| GET    | `/products`      | Barcha mahsulotlarni olish            |
| GET    | `/products/:id`  | Bitta mahsulotni olish                |
| PATCH  | `/products/:id`  | Mahsulotni tahrirlash                 |
| DELETE | `/products/:id`  | Mahsulotni o‘chirish                  |

> ⚠️ Faqat kompaniyaga biriktirilgan foydalanuvchilar mahsulot yaratishi mumkin.

---

## 🛡️ Ruxsatlar

| Role    | Tavsif                      |
|---------|-----------------------------|
| admin   | Kompaniya yaratuvchisi      |
| manager | Mavjud kompaniyaga qo‘shilgan foydalanuvchi |

---

## 🚀 Ishga tushirish

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
