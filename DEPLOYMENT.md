# CGS deployment

## Architecture

- Website: Vercel, rooted at `Website`
- API: Render Docker service, configured by `render.yaml`
- Database: Supabase PostgreSQL
- Uploaded media: Cloudinary

## 1. Supabase

Create a project and copy its **ADO.NET/Npgsql connection string**. It normally
looks like this:

```text
Host=db.<project-ref>.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=<password>;SSL Mode=Require;Trust Server Certificate=true
```

Do not use the SQL Server connection string from `appsettings.json`.

## 2. Cloudinary

Create an account and copy `Cloud name`, `API Key`, and `API Secret` from the
Cloudinary dashboard. Uploaded images and documents are stored there because
Render's local filesystem is temporary.

## 3. Render

Connect the GitHub repository and use the root `render.yaml`, or create a
Docker web service with root directory `Backend/backend/CGS.CMS.API`.

Set these environment variables in Render:

```text
ConnectionStrings__DefaultConnection=<Supabase Npgsql connection string>
Database__EnsureCreated=true
ASPNETCORE_ENVIRONMENT=Production
Jwt__Key=<long random secret, at least 32 characters>
Cors__AllowedOrigins__0=https://<your-vercel-domain>
Cloudinary__CloudName=<cloud name>
Cloudinary__ApiKey=<api key>
Cloudinary__ApiSecret=<api secret>
```

The first production start creates the schema and seed records in a fresh
Supabase database. The existing SQL Server migration files are not used by the
PostgreSQL deployment. Export/import existing SQL Server content separately if
the current local data must be preserved.

After deployment, verify:

```text
https://<render-service>.onrender.com/api/about
```

## 4. Vercel

Import the repository, set **Root Directory** to `Website`, and use the default
Create React App build settings:

```text
Build command: npm run build
Output directory: build
```

Add this Vercel environment variable for Production:

```text
REACT_APP_API_URL=https://<render-service>.onrender.com/api
```

Redeploy after adding the variable. The included `Website/vercel.json` keeps
React Router routes working on direct page loads.

## Important free-tier limits

Render free services sleep when idle, Supabase free projects have quotas and
may pause under provider policy, and Cloudinary has monthly usage limits. These
are free tiers, not an unconditional lifetime availability guarantee.