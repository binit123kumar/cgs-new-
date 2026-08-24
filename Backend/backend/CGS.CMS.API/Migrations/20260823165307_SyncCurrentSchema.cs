using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CGS.CMS.API.Migrations
{
    /// <inheritdoc />
    public partial class SyncCurrentSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkUrl",
                table: "NewsItems",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "GalleryItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDirector",
                table: "Faculties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsGuestFaculty",
                table: "Faculties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PdfPath",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PermissionsJson",
                table: "AdminUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDirectorMessage",
                table: "Abouts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "AimObjectiveItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SectionLabel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Heading = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IconKey = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AimObjectiveItems", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AdminUsers",
                keyColumn: "Id",
                keyValue: 1,
                column: "PermissionsJson",
                value: "{}");

            migrationBuilder.InsertData(
                table: "AimObjectiveItems",
                columns: new[] { "Id", "Body", "CreatedAt", "DisplayOrder", "Heading", "IconKey", "IsActive", "SectionLabel", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "To make the Centre for Geographical Studies a premier institution devoted to excellence in teaching, research, and outreach in Geographical Studies, GIS, Remote Sensing, and related disciplines — with a special focus on the developmental challenges of Bihar and the Gangetic Plain.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null, "bullseye", true, "Aim", null },
                    { 2, "The Centre aims to produce cutting-edge planning solutions for the myriad obstacles that Bihar has to overcome in its developmental journey. Key objectives include advancing knowledge through research in spatial sciences, building capacity in GIS and Remote Sensing, and providing quality postgraduate education in geography.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, null, "binoculars", true, "Objectives", null },
                    { 3, "The Centre envisions becoming a numero uno in the disciplinary field of Geographical research, especially incorporating the very latest in satellite imagery, Geographic Information Systems (GIS), and Remote Sensing. The Centre was born out of the vision of the Chief Minister of Bihar to give geography its rightful place in guiding state-level planning and policy.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, null, "mountain", true, "Vision", null },
                    { 4, "Providing rigorous postgraduate and doctoral programmes (M.A./M.Sc. Geography, M.Sc. GIS and Remote Sensing, PG Diploma, Certificate, and Ph.D.) under the Choice Based Credit System (CBCS) adopted from the common ordinance of Bihar Universities.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Teaching and Training", "laptop-code", true, "Mission", null },
                    { 5, "Encouraging original research on applied geographical topics including land use and land cover change, urban planning, disaster management, watershed analysis, and rural development, with special reference to the state of Bihar.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, "Research Excellence", "flask", true, "Mission", null },
                    { 6, "Training students and professionals in modern geospatial tools including ArcGIS, QGIS, Remote Sensing software, and GPS data collection, aligning skills with national and international industry standards.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 6, "Spatial Technology Capacity Building", "laptop-code", true, "Mission", null },
                    { 7, "Working closely with the Bihar Government departments, the Survey of India, NRSC, ISRO, and other agencies to ensure that research outputs translate directly into actionable policies and development programmes.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 7, "Collaboration with Government and Industry", "handshake", true, "Mission", null },
                    { 8, "Organising seminars, workshops, field camps, and extension programmes to spread geographic literacy among students, teachers, and policymakers across Bihar and the broader Eastern India region.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 8, "Public Outreach and Knowledge Dissemination", "bullhorn", true, "Mission", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AimObjectiveItems");

            migrationBuilder.DropColumn(
                name: "LinkUrl",
                table: "NewsItems");

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "GalleryItems");

            migrationBuilder.DropColumn(
                name: "IsDirector",
                table: "Faculties");

            migrationBuilder.DropColumn(
                name: "IsGuestFaculty",
                table: "Faculties");

            migrationBuilder.DropColumn(
                name: "PdfPath",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "PermissionsJson",
                table: "AdminUsers");

            migrationBuilder.DropColumn(
                name: "IsDirectorMessage",
                table: "Abouts");
        }
    }
}
