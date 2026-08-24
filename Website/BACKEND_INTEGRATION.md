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

## Required backend changes for the new admin features

The React admin form now sends these fields. The API/database must enforce them; frontend validation alone cannot make an ID primary or unique.

- `Faculty`: add `IsGuestFaculty` (`bit`, default `0`) and return it from `GET /api/faculty`.
- `Gallery`: add required `Category` and `IsPrimary` (`bit`, default `0`). Enforce at most one active primary photo per category with a filtered unique index. `POST /api/gallery` must accept repeated `images` multipart fields and create one record per file transactionally. The first selected image is the cover if `isPrimary=true`.
- `News`: add nullable `LinkUrl` (maximum 2048 characters) and return it from the news endpoint. It may be an internal path such as `/notices` or an HTTPS URL.
- `Courses`: keep `ImagePath` for the JPG/PNG/WebP cover and add nullable `PdfPath`. Accept `image` and `pdf` multipart fields on course create/update; validate the image MIME type and allow only `application/pdf` for the PDF attachment.
- `Settings / Hero Backgrounds`: `PUT /api/settings` must accept multipart field `heroBackground`, create a stored image record, and return `heroBackgroundPath` plus `heroBackgrounds`. Add `PATCH /api/settings/hero-backgrounds/{id}/toggle` to update `IsActive` and return the refreshed `heroBackgroundPath` and `heroBackgrounds` list. The public settings response must return only the selected active path in `heroBackgroundPath`.
- Keep every module's database `Id` as an identity/sequence primary key. The admin UI pre-fills the next `displayOrder` for convenience, but the API must calculate IDs/orders safely under simultaneous uploads.

## Activity log / audit trail

The admin application includes an **Activity Log** page at `/admin/activity-log`.
For logs to cover every user and every CRUD action, they must be written by the
backend—not by browser code, which can be modified or bypassed.

- Create an append-only `ActivityLogs` table with: `Id`, `CreatedAt` (UTC),
  `UserId`, `UserName`, `Action` (`Create`, `Update`, `Delete`, `Login`,
  `Logout`), `EntityType`, `EntityId`, `EntityName`/`Summary`, `IpAddress`,
  and optional JSON `OldValues`/`NewValues`.
- In each authenticated create/update/delete controller (including Settings),
  write one record only after the transaction succeeds. Log login/logout in
  the authentication service. Do not log passwords, tokens, or file bytes.
- Prevent update/delete permissions on activity logs for normal administrators;
  only a super-admin may read them. Retain records according to your institute's
  policy.
- Add authenticated `GET /api/activity-log` with newest-first results. It may
  return either `data: []` or `data: { items: [] }`. Each item should expose
  camel-case values such as `performedBy`, `action`, `entityType`, `entityId`,
  `entityName`, `createdAt`, and `ipAddress`.

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
