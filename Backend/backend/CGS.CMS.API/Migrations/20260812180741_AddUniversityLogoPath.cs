using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CGS.CMS.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUniversityLogoPath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UniversityLogoPath",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "SiteSettings",
                keyColumn: "Id",
                keyValue: 1,
                column: "UniversityLogoPath",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UniversityLogoPath",
                table: "SiteSettings");
        }
    }
}
