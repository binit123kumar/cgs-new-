-- =====================================================================
-- CGS CMS - SQL Server Database Creation Script
-- Run this in SSMS / Azure Data Studio if you prefer NOT to use
-- `dotnet ef migrations` (EF Core will create the same schema for you
-- automatically on first run if you use migrations instead).
-- =====================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CGS_CMS_DB')
BEGIN
    CREATE DATABASE CGS_CMS_DB;
END
GO

USE CGS_CMS_DB;
GO

-- ---------- Admin Users ----------
IF OBJECT_ID('dbo.AdminUsers', 'U') IS NULL
CREATE TABLE dbo.AdminUsers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'Super Admin',
    LastLogin DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ---------- About ----------
IF OBJECT_ID('dbo.Abouts', 'U') IS NULL
CREATE TABLE dbo.Abouts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    ImagePath NVARCHAR(500) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    ShowOnHomePage BIT NOT NULL DEFAULT 0,
    ShowOnAboutPage BIT NOT NULL DEFAULT 1,
    ShowOnFooter BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Faculty ----------
IF OBJECT_ID('dbo.Faculties', 'U') IS NULL
CREATE TABLE dbo.Faculties (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    Designation NVARCHAR(150) NULL,
    Qualification NVARCHAR(250) NULL,
    Email NVARCHAR(150) NULL,
    Phone NVARCHAR(20) NULL,
    Bio NVARCHAR(MAX) NULL,
    PhotoPath NVARCHAR(500) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Staff ----------
IF OBJECT_ID('dbo.Staffs', 'U') IS NULL
CREATE TABLE dbo.Staffs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    Designation NVARCHAR(150) NULL,
    Email NVARCHAR(150) NULL,
    Phone NVARCHAR(20) NULL,
    PhotoPath NVARCHAR(500) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Gallery ----------
IF OBJECT_ID('dbo.GalleryItems', 'U') IS NULL
CREATE TABLE dbo.GalleryItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    ImagePath NVARCHAR(500) NOT NULL,
    Category NVARCHAR(100) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- News ----------
IF OBJECT_ID('dbo.NewsItems', 'U') IS NULL
CREATE TABLE dbo.NewsItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(250) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ImagePath NVARCHAR(500) NULL,
    PublishDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Events ----------
IF OBJECT_ID('dbo.EventItems', 'U') IS NULL
CREATE TABLE dbo.EventItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(250) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    EventDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Venue NVARCHAR(200) NULL,
    ImagePath NVARCHAR(500) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Notice ----------
IF OBJECT_ID('dbo.NoticeItems', 'U') IS NULL
CREATE TABLE dbo.NoticeItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(250) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    FilePath NVARCHAR(500) NULL,
    NoticeDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Slider ----------
IF OBJECT_ID('dbo.SliderItems', 'U') IS NULL
CREATE TABLE dbo.SliderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NULL,
    ImagePath NVARCHAR(500) NOT NULL,
    LinkUrl NVARCHAR(300) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Courses ----------
IF OBJECT_ID('dbo.Courses', 'U') IS NULL
CREATE TABLE dbo.Courses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Duration NVARCHAR(100) NULL,
    Eligibility NVARCHAR(250) NULL,
    ImagePath NVARCHAR(500) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Downloads ----------
IF OBJECT_ID('dbo.DownloadItems', 'U') IS NULL
CREATE TABLE dbo.DownloadItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    Category NVARCHAR(100) NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Publications ----------
IF OBJECT_ID('dbo.Publications', 'U') IS NULL
CREATE TABLE dbo.Publications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(250) NOT NULL,
    Author NVARCHAR(200) NULL,
    Description NVARCHAR(MAX) NULL,
    FilePath NVARCHAR(500) NULL,
    PublishYear INT NULL,
    DisplayOrder INT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- ---------- Site Settings (single row) ----------
IF OBJECT_ID('dbo.SiteSettings', 'U') IS NULL
CREATE TABLE dbo.SiteSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SiteName NVARCHAR(150) NOT NULL DEFAULT 'CGS',
    LogoPath NVARCHAR(500) NULL,
    Address NVARCHAR(300) NULL,
    Phone NVARCHAR(20) NULL,
    Email NVARCHAR(150) NULL,
    Facebook NVARCHAR(MAX) NULL,
    Twitter NVARCHAR(MAX) NULL,
    Instagram NVARCHAR(MAX) NULL,
    YouTube NVARCHAR(MAX) NULL,
    MetaTitle NVARCHAR(200) NULL,
    MetaDescription NVARCHAR(MAX) NULL,
    UpdatedAt DATETIME2 NULL
);
GO

PRINT 'CGS_CMS_DB schema created successfully.';
