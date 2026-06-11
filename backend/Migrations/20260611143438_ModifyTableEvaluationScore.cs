using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobTracker.Migrations
{
    /// <inheritdoc />
    public partial class ModifyTableEvaluationScore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Score",
                table: "EvaluationScores",
                newName: "Tone");

            migrationBuilder.AddColumn<float>(
                name: "Actionability",
                table: "EvaluationScores",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Average",
                table: "EvaluationScores",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Grounding",
                table: "EvaluationScores",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Relevance",
                table: "EvaluationScores",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "Scope",
                table: "EvaluationScores",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Actionability",
                table: "EvaluationScores");

            migrationBuilder.DropColumn(
                name: "Average",
                table: "EvaluationScores");

            migrationBuilder.DropColumn(
                name: "Grounding",
                table: "EvaluationScores");

            migrationBuilder.DropColumn(
                name: "Relevance",
                table: "EvaluationScores");

            migrationBuilder.DropColumn(
                name: "Scope",
                table: "EvaluationScores");

            migrationBuilder.RenameColumn(
                name: "Tone",
                table: "EvaluationScores",
                newName: "Score");
        }
    }
}
