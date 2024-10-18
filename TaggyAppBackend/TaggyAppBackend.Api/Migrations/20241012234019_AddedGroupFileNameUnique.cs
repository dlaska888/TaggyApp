using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaggyAppBackend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedGroupFileNameUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Files_UntrustedName_GroupId",
                table: "Files",
                columns: new[] { "UntrustedName", "GroupId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Files_UntrustedName_GroupId",
                table: "Files");
        }
    }
}
