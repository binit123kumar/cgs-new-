# CGS CMS — Backend (ASP.NET Core 8 Web API + EF Core + SQL Server)

Poore CMS (About, Faculty, Staff, Gallery, News, Events, Notice, Slider, Courses,
Downloads, Publications, Settings) ke liye complete backend, dashboard image mein
dikhaye gaye Add/Edit/List/Delete flow ke saath.

## ⚠️ Important — Yeh code build/run *nahi* hua hai is sandbox mein

Is chat environment mein .NET SDK aur NuGet access nahi hai, isliye maine code
compile/test nahi kar paaya. Code standard, well-tested patterns follow karta hai,
lekin apne local machine par pehli baar run karte waqt chhoti build errors
(typo, package version mismatch) aa sakti hain — wo normal hai, fix karna easy hoga.

## 1. Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (Express/Developer/full) — ya SQL Server LocalDB
- Visual Studio 2022 / VS Code / Rider (koi bhi)

## 2. Connection string set karein

`CGS.CMS.API/appsettings.json` mein apna SQL Server instance daalein:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=CGS_CMS_DB;Trusted_Connection=True;TrustServerCertificate=True;"
```

LocalDB use kar rahe hain to:
```
Server=(localdb)\\mssqllocaldb;Database=CGS_CMS_DB;Trusted_Connection=True;
```

## 3. Database banayein — do options hain

**Option A (recommended) — EF Core Migrations:**
```bash
cd CGS.CMS.API
dotnet restore
dotnet tool install --global dotnet-ef   # agar pehle se nahi hai
dotnet ef migrations add InitialCreate
dotnet ef database update
```
Migration khud table + seed data (default admin login) bana dega.

**Option B — Raw SQL (agar EF tools install nahi karna):**
SSMS ya Azure Data Studio kholein aur `Database/01_CreateDatabase.sql` phir
`Database/02_SeedData.sql` run karein.

> Note: `Program.cs` mein `db.Database.Migrate()` startup par already call hota
> hai — agar Option A use kar rahe hain to app khud future migrations apply
> kar dega. Option B use karein to us line ko comment kar dena chahiye taaki
> conflict na ho (migrations history table na hone se error aa sakta hai) —
> ya phir simply Option A hi use karein, wahi zyada robust hai.

## 4. Run karein

```bash
cd CGS.CMS.API
dotnet run
```

Swagger UI khulega: `https://localhost:7050/swagger` — yahan se saare 12 modules
ke endpoints test kar sakte hain.

## 5. Default login

```
Username: admin
Password: Admin@123
```

`POST /api/auth/login` call karke JWT token milega. Har protected endpoint
(Create/Update/Delete/Toggle-status) ke liye header mein:
```
Authorization: Bearer <token>
```

`GET` endpoints (list/detail) public hain — public website in modules ko bina
login ke fetch kar sakti hai, jaisa image mein "Show On Website" flags se dikh
raha hai.

## 6. Har module ke endpoints (pattern same hai sabke liye)

Example — About (baaki 10 modules bhi isi pattern par hain: Faculty, Staff,
Gallery, News, Events, Notice, Slider, Courses, Downloads, Publications):

| Method | Route                          | Auth | Notes |
|--------|---------------------------------|------|-------|
| GET    | `/api/about`                    | No   | List, DisplayOrder se sorted |
| GET    | `/api/about/{id}`                | No   | Single record |
| POST   | `/api/about`                     | Yes  | `multipart/form-data` — image upload sath |
| PUT    | `/api/about/{id}`                 | Yes  | Update, naya image optional |
| DELETE | `/api/about/{id}`                 | Yes  | Deletes record + uploaded file |
| PATCH  | `/api/about/{id}/toggle-status`   | Yes  | Active/Inactive toggle |

Extra:
- `GET /api/dashboard/counts` — Dashboard ke saare card badges (About: 1, Faculty: 0, etc) ek call mein.
- `GET /api/settings` / `PUT /api/settings` — Settings singleton row.

## 7. File uploads

Images/PDFs `wwwroot/uploads/{module}/` mein save hote hain aur response mein
web-relative path milta hai jaise `/uploads/about/xyz123.jpg` — React frontend
mein isse seedha `<img src={API_BASE_URL + item.imagePath} />` jaisa use kar
sakte hain.

## 8. React frontend (`cgs-main`) se connect karna

Uploaded `cgs-main` React project abhi ek plain public website hai (backend se
connected nahi). Ussey is API se connect karne ke liye:

1. `.env` mein `REACT_APP_API_URL=https://localhost:7050/api` add karein.
2. `fetch(`${process.env.REACT_APP_API_URL}/about`)` jaisa calls components mein use karein.
3. Admin CMS panel (jo image mein dikhaya gaya hai) alag se banana hoga — yeh
   sirf backend hai. Agar chahiye to us admin dashboard UI (React/Bootstrap)
   ka code bhi bana sakta hoon — bataiye.

## Project structure

```
CGS.CMS.API/
  Controllers/       -> 13 controllers (Auth, Dashboard, + 11 modules incl. Settings)
  Models/Entities.cs  -> All EF Core entities
  Data/ApplicationDbContext.cs
  DTOs/               -> Login + Dashboard DTOs (module Form DTOs live inside their controllers)
  Services/           -> JWT TokenService, FileService (uploads)
  Program.cs          -> JWT auth, CORS, Swagger, static files, auto-migrate
Database/
  01_CreateDatabase.sql
  02_SeedData.sql
```
