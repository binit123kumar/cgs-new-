using Microsoft.EntityFrameworkCore;
using CGS.CMS.API.Models;

namespace CGS.CMS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<About> Abouts => Set<About>();
        public DbSet<Faculty> Faculties => Set<Faculty>();
        public DbSet<Staff> Staffs => Set<Staff>();
        public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();
        public DbSet<NewsItem> NewsItems => Set<NewsItem>();
        public DbSet<EventItem> EventItems => Set<EventItem>();
        public DbSet<NoticeItem> NoticeItems => Set<NoticeItem>();
        public DbSet<SliderItem> SliderItems => Set<SliderItem>();
        public DbSet<Course> Courses => Set<Course>();
        public DbSet<DownloadItem> DownloadItems => Set<DownloadItem>();
        public DbSet<Publication> Publications => Set<Publication>();
        public DbSet<AimObjectiveItem> AimObjectiveItems => Set<AimObjectiveItem>();
        public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
        public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Default Super Admin -> username: admin, password: Admin@123
            // Hash generated with BCrypt.Net-Next (BCrypt.HashPassword("Admin@123"))
            modelBuilder.Entity<AdminUser>().HasData(new AdminUser
            {
                Id = 1,
                Username = "admin",
                PasswordHash = "$2b$11$OkpCsoEWbJIm4qtmgneViu1YanCYDPWpTaQRiQ6ELX2Ec4qO5aZFm",
                FullName = "Administrator",
                Email = "admin@cgs.edu",
                Role = "Super Admin",
                PermissionsJson = "{}",
                CreatedAt = new DateTime(2026, 1, 1)
            });

            modelBuilder.Entity<SiteSetting>().HasData(new SiteSetting
            {
                Id = 1,
                SiteName = "CGS",
                Address = "",
                Phone = "",
                Email = "",
                MetaTitle = "CGS - School of Geography"
            });

            // Unique username
            modelBuilder.Entity<AdminUser>().HasIndex(u => u.Username).IsUnique();

            // Seed the existing "Aim and Objective" page content so it's
            // already editable from Admin -> Aim & Objective after migration,
            // instead of starting empty.
            var seedDate = new DateTime(2026, 1, 1);
            modelBuilder.Entity<AimObjectiveItem>().HasData(
                new AimObjectiveItem { Id = 1, SectionLabel = "Aim", IconKey = "bullseye", DisplayOrder = 1, CreatedAt = seedDate, Body = "To make the Centre for Geographical Studies a premier institution devoted to excellence in teaching, research, and outreach in Geographical Studies, GIS, Remote Sensing, and related disciplines — with a special focus on the developmental challenges of Bihar and the Gangetic Plain." },
                new AimObjectiveItem { Id = 2, SectionLabel = "Objectives", IconKey = "binoculars", DisplayOrder = 2, CreatedAt = seedDate, Body = "The Centre aims to produce cutting-edge planning solutions for the myriad obstacles that Bihar has to overcome in its developmental journey. Key objectives include advancing knowledge through research in spatial sciences, building capacity in GIS and Remote Sensing, and providing quality postgraduate education in geography." },
                new AimObjectiveItem { Id = 3, SectionLabel = "Vision", IconKey = "mountain", DisplayOrder = 3, CreatedAt = seedDate, Body = "The Centre envisions becoming a numero uno in the disciplinary field of Geographical research, especially incorporating the very latest in satellite imagery, Geographic Information Systems (GIS), and Remote Sensing. The Centre was born out of the vision of the Chief Minister of Bihar to give geography its rightful place in guiding state-level planning and policy." },
                new AimObjectiveItem { Id = 4, SectionLabel = "Mission", Heading = "Teaching and Training", IconKey = "laptop-code", DisplayOrder = 4, CreatedAt = seedDate, Body = "Providing rigorous postgraduate and doctoral programmes (M.A./M.Sc. Geography, M.Sc. GIS and Remote Sensing, PG Diploma, Certificate, and Ph.D.) under the Choice Based Credit System (CBCS) adopted from the common ordinance of Bihar Universities." },
                new AimObjectiveItem { Id = 5, SectionLabel = "Mission", Heading = "Research Excellence", IconKey = "flask", DisplayOrder = 5, CreatedAt = seedDate, Body = "Encouraging original research on applied geographical topics including land use and land cover change, urban planning, disaster management, watershed analysis, and rural development, with special reference to the state of Bihar." },
                new AimObjectiveItem { Id = 6, SectionLabel = "Mission", Heading = "Spatial Technology Capacity Building", IconKey = "laptop-code", DisplayOrder = 6, CreatedAt = seedDate, Body = "Training students and professionals in modern geospatial tools including ArcGIS, QGIS, Remote Sensing software, and GPS data collection, aligning skills with national and international industry standards." },
                new AimObjectiveItem { Id = 7, SectionLabel = "Mission", Heading = "Collaboration with Government and Industry", IconKey = "handshake", DisplayOrder = 7, CreatedAt = seedDate, Body = "Working closely with the Bihar Government departments, the Survey of India, NRSC, ISRO, and other agencies to ensure that research outputs translate directly into actionable policies and development programmes." },
                new AimObjectiveItem { Id = 8, SectionLabel = "Mission", Heading = "Public Outreach and Knowledge Dissemination", IconKey = "bullhorn", DisplayOrder = 8, CreatedAt = seedDate, Body = "Organising seminars, workshops, field camps, and extension programmes to spread geographic literacy among students, teachers, and policymakers across Bihar and the broader Eastern India region." }
            );
        }
    }
}