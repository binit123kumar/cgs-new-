using System;
using System.ComponentModel.DataAnnotations;

namespace CGS.CMS.API.Models
{
    // =========================================================
    // BASE ENTITY
    // =========================================================

    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public int DisplayOrder { get; set; } = 1;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }


    // =========================================================
    // ABOUT
    // =========================================================

    public class About : BaseEntity
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? ImagePath { get; set; }

        public bool ShowOnHomePage { get; set; }

        public bool ShowOnAboutPage { get; set; } = true;

        public bool ShowOnFooter { get; set; }

        public bool IsDirectorMessage { get; set; }
    }


    // =========================================================
    // FACULTY
    // =========================================================

    public class Faculty : BaseEntity
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Designation { get; set; }

        [MaxLength(250)]
        public string? Qualification { get; set; }

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        public string? Bio { get; set; }

        public string? PhotoPath { get; set; }

        public bool IsGuestFaculty { get; set; }

        public bool IsDirector { get; set; }
    }


    // =========================================================
    // STAFF
    // =========================================================

    public class Staff : BaseEntity
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Designation { get; set; }

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        public string? PhotoPath { get; set; }
    }


    // =========================================================
    // GALLERY
    // =========================================================

    public class GalleryItem : BaseEntity
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string ImagePath { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Category { get; set; }

        public bool IsPrimary { get; set; }
    }


    // =========================================================
    // NEWS
    // =========================================================

    public class NewsItem : BaseEntity
    {
        [Required, MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? ImagePath { get; set; }

        [MaxLength(300)]
        public string? LinkUrl { get; set; }

        public DateTime PublishDate { get; set; } = DateTime.UtcNow;
    }


    // =========================================================
    // EVENT
    // =========================================================

    public class EventItem : BaseEntity
    {
        [Required, MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime EventDate { get; set; } = DateTime.UtcNow;

        [MaxLength(200)]
        public string? Venue { get; set; }

        public string? ImagePath { get; set; }
    }


    // =========================================================
    // NOTICE
    // =========================================================

    public class NoticeItem : BaseEntity
    {
        [Required, MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? FilePath { get; set; }

        public DateTime NoticeDate { get; set; } = DateTime.UtcNow;
    }


    // =========================================================
    // SLIDER
    // =========================================================

    public class SliderItem : BaseEntity
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [Required]
        public string ImagePath { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? LinkUrl { get; set; }
    }


    // =========================================================
    // COURSE
    // =========================================================

    public class Course : BaseEntity
    {
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Duration { get; set; }

        [MaxLength(250)]
        public string? Eligibility { get; set; }

        public string? ImagePath { get; set; }

        public string? PdfPath { get; set; }
    }


    // =========================================================
    // DOWNLOAD
    // =========================================================

    public class DownloadItem : BaseEntity
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Category { get; set; }
    }


    // =========================================================
    // PUBLICATION
    // =========================================================

    public class Publication : BaseEntity
    {
        [Required, MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Author { get; set; }

        public string? Description { get; set; }

        public string? FilePath { get; set; }

        public int? PublishYear { get; set; }
    }


    // =========================================================
    // AIM & OBJECTIVE
    // A flexible ordered list so the whole "Aim and Objective" page
    // is editable from Admin instead of being hardcoded in the
    // frontend. SectionLabel groups items ("Aim", "Objectives",
    // "Vision", "Mission"); Heading is only used for Mission's
    // sub-items (e.g. "Teaching and Training") and left blank for
    // the single-paragraph sections.
    // =========================================================

    public class AimObjectiveItem : BaseEntity
    {
        [Required, MaxLength(50)]
        public string SectionLabel { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Heading { get; set; }

        [Required]
        public string Body { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? IconKey { get; set; }
    }


    // =========================================================
    // SITE SETTINGS
    // =========================================================

    public class SiteSetting
    {
        [Key]
        public int Id { get; set; }


        // -----------------------------------------------------
        // WEBSITE NAME
        // -----------------------------------------------------

        [MaxLength(150)]
        public string SiteName { get; set; } = "CGS";


        // -----------------------------------------------------
        // SCHOOL OF GEOGRAPHY LOGO
        // Existing Logo
        // -----------------------------------------------------

        public string? LogoPath { get; set; }


        // -----------------------------------------------------
        // AKU / UNIVERSITY LOGO
        // New property
        // -----------------------------------------------------

        public string? UniversityLogoPath { get; set; }


        // -----------------------------------------------------
        // CONTACT INFORMATION
        // -----------------------------------------------------

        [MaxLength(300)]
        public string? Address { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(150)]
        public string? Email { get; set; }


        // -----------------------------------------------------
        // SOCIAL MEDIA
        // -----------------------------------------------------

        public string? Facebook { get; set; }

        public string? Twitter { get; set; }

        public string? Instagram { get; set; }

        public string? YouTube { get; set; }


        // -----------------------------------------------------
        // SEO
        // -----------------------------------------------------

        [MaxLength(200)]
        public string? MetaTitle { get; set; }

        public string? MetaDescription { get; set; }


        // -----------------------------------------------------
        // UPDATED DATE
        // -----------------------------------------------------

        public DateTime? UpdatedAt { get; set; }
    }


    // =========================================================
    // ADMIN USER
    // =========================================================

    public class AdminUser
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(50)]
        public string Role { get; set; } = "Super Admin";

        // JSON map: module -> allowed actions (read, create, update, delete).
        // Super Admin bypasses this map.
        public string PermissionsJson { get; set; } = "{}";

        public DateTime? LastLogin { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}