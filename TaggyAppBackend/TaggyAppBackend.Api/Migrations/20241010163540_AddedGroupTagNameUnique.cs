using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaggyAppBackend.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddedGroupTagNameUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tags_Name_GroupId",
                table: "Tags",
                columns: new[] { "Name", "GroupId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tags_Name_GroupId",
                table: "Tags");
        }
    }
}
