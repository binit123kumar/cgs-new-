-- Seed default Super Admin login (username: admin, password: Admin@123)
-- and default site settings row. Safe to re-run.
USE CGS_CMS_DB;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.AdminUsers WHERE Username = 'admin')
INSERT INTO dbo.AdminUsers (Username, PasswordHash, FullName, Email, Role, CreatedAt)
VALUES (
    'admin',
    '$2b$11$OkpCsoEWbJIm4qtmgneViu1YanCYDPWpTaQRiQ6ELX2Ec4qO5aZFm', -- Admin@123
    'Administrator',
    'admin@cgs.edu',
    'Super Admin',
    SYSUTCDATETIME()
);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.SiteSettings)
INSERT INTO dbo.SiteSettings (SiteName, MetaTitle)
VALUES ('CGS', 'CGS - School of Geography');
GO

PRINT 'Seed data inserted.';
