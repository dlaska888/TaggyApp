﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaggyAppBackend.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedFileMetaData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "Files",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "Files");
        }
    }
}
