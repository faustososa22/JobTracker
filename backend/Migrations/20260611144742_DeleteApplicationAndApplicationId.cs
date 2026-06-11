using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Migrations
{
    /// <inheritdoc />
    public partial class DeleteApplicationAndApplicationId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EvaluationScores_Applications_ApplicationId",
                table: "EvaluationScores");

            migrationBuilder.DropIndex(
                name: "IX_EvaluationScores_ApplicationId",
                table: "EvaluationScores");

            migrationBuilder.DropColumn(
                name: "ApplicationId",
                table: "EvaluationScores");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApplicationId",
                table: "EvaluationScores",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationScores_ApplicationId",
                table: "EvaluationScores",
                column: "ApplicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_EvaluationScores_Applications_ApplicationId",
                table: "EvaluationScores",
                column: "ApplicationId",
                principalTable: "Applications",
                principalColumn: "Id");
        }
    }
}
