using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaggyAppBackend.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedFileNameColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Path",
                table: "Files",
                newName: "TrustedName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Files",
                newName: "UntrustedName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UntrustedName",
                table: "Files",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "TrustedName",
                table: "Files",
                newName: "Path");
        }
    }
}
