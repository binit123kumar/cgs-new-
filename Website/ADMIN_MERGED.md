# Backend Integration + Embedded Admin Panel

✅ Poora project build test kiya gaya hai (`npm run build` → **Compiled successfully**).

## Kya-kya hai is version mein

1. **Public website ↔ Backend connected** (About, Faculty, Staff, Gallery, Slider CMS se data lete hain, fallback ke saath — pehle wali README dekho niche)
2. **Admin Panel ab isi project ke andar hai**, alag port (3001) ki zaroorat nahi:
   - `localhost:3000/admin` → Admin login/dashboard
   - Footer ke bottom mein **"Admin Login"** button seedha wahin le jaata hai

## Naya folder: `src/admin/`

Poora Admin Panel yahan hai — apna CSS (`admin.css`, `.cgs-admin-scope` ke andar scoped taaki public website ke design se clash na ho), apne pages, components, sab kuch. `src/App.js` mein ek route hai:
```js
<Route path="/admin/*" element={<AdminApp />} />
```
Yeh route public website ke header/footer ke bina, **poori tarah alag/full-screen** render hota hai.

## Setup (pehle jaisa hi hai, extra kuch nahi)

```bash
cp .env.example .env
npm install
npm start
```

`.env` mein wahi ek variable hai jo pehle tha:
```
REACT_APP_API_URL=https://localhost:7050/api
```
(Admin Panel bhi isi variable ko use karta hai — do alag `.env` values ki zaroorat nahi)

## ⚠️ Ek fix bhi shamil hai

`npm install` ke baad kabhi-kabhi ek purana known `react-scripts`/`eslint-plugin-jest` version-conflict bug aata hai jisse `npm run build`/`npm start` fail ho sakta hai ("jest/globals is unknown" jaisa error). Isse pehle se `.env.example` mein `DISABLE_ESLINT_PLUGIN=true` daal ke fix kar diya hai — kuch extra karne ki zaroorat nahi.

## Login

```
http://localhost:3000/admin
Username: admin
Password: Admin@123
```

## Standalone Admin Panel ka kya hua?

Purana alag `CGS-CMS-AdminPanel` (port 3001 wala, Vite se banaya) **abhi bhi kaam karta hai**, agar kabhi alag se chalana ho. Lekin ab default/normal use ke liye isी merged version (`localhost:3000/admin`) use karna better hai — ek hi cheez chalani padegi.
