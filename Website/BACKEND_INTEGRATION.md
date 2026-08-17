# Backend Integration — kya badla hai

Is public website ko CMS backend se connect kar diya gaya hai. ✅ `npm run build`
test kiya gaya hai, compile successfully hua (koi error nahi).

## Kya-kya connect kiya

| Page/Component        | Ab kya karta hai |
|------------------------|-------------------|
| `components/About.jsx` | CMS ke `/api/about` (jahan "Show on About Page" checked ho) se content load karta hai |
| `components/Carousels.jsx` | CMS ke `/api/slider` se home page slides load karta hai |
| `pages/Faculty.jsx`    | CMS ke `/api/faculty` se faculty list load karta hai (Director section abhi bhi static hai) |
| `pages/Staff.jsx`      | CMS ke `/api/staff` se guest faculty cards load karta hai |
| `pages/Event.jsx`      | CMS ke `/api/gallery` se images load karta hai |

Naya file: `src/api/cmsApi.js` — saare API calls yahan se hote hain.

## ⚠️ Zaroori: Fail-soft design

**Backend abhi connect nahi hai to bhi website bilkul normal dikhega** —
maine har jagah fallback rakha hai:
- Agar backend down hai, ya
- Us module mein CMS se koi entry nahi hai,

to page apna **original static content** hi dikhayega (jo pehle se tha). Isse
production website kabhi khaali/broken nahi dikhegi, backend ready hone tak.

## Setup

1. `.env.example` ko `.env` mein copy karo:
   ```bash
   cp .env.example .env
   ```
2. Apna backend URL daalo:
   ```
   REACT_APP_API_URL=https://localhost:7050/api
   ```
3. Normal tarike se run/build karo:
   ```bash
   npm install
   npm start      # development
   npm run build  # production
   ```

## Ab kya karna hai

1. Backend (`CGS-CMS-Backend`) run karo.
2. Admin panel (`CGS-CMS-AdminPanel`) se login karke About/Faculty/Staff/
   Gallery/Slider mein data add karo.
3. Yeh website refresh karo — CMS ka data automatically dikhega (fallback ki
   jagah).

## Baaki modules

News, Events, Notice, Courses, Downloads, Publications ke liye is website
mein abhi koi matching page/section nahi hai (`cmsApi.js` mein functions ban
chuke hain — `getNews()`, `getEvents()`, `getNotices()`, etc — bas unhe kisi
naye page/component mein use karna hoga jab chaho).
