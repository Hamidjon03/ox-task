# OX Company Management API

NestJS asosida yozilgan backend ilova. Kompaniya ro'yxatga olish, foydalanuvchi roli asosida boshqarish va OX'dan mahsulotlarni olish funksiyalarini o'z ichiga oladi.

## Texnologiyalar
- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- Swagger

## Ishga tushirish

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

## Auth

**POST** `/auth/login` – Foydalanuvchi email orqali OTP olish  
**POST** `/auth/verify` – OTP orqali token olish

## Company

**POST** `/company/register` – OX orqali kompaniya qo'shish  
**DELETE** `/company/:id` – Admin o'z kompaniyasini o'chiradi

## Products

**GET** `/products?page=1&size=10` – OX API dan mahsulotlar ro'yxati  
⚠️ Faqat `manager` rolidagi foydalanuvchi, `size > 20` bo‘lsa: 400 qaytariladi

## Ruxsatlar

- `admin` – kompaniya yaratuvchisi
- `manager` – kompaniyaga qo‘shilgan foydalanuvchi

