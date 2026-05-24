using System.Text.Json;
using Anthropic;
using Anthropic.Models.Messages;
using JobTracker.Dtos;
using Anthropic.Core;
using Anthropic.Models.Beta.Files;
using Anthropic.Models.Beta.Messages;

namespace JobTracker.Services
{
    public class AIAnalysisService : IAIAnalysisService
    {
        private readonly AnthropicClient _anthropicClient;

        public AIAnalysisService(AnthropicClient anthropicClient)
        {
            this._anthropicClient = anthropicClient;
        }
        public async Task<CvMatchResults> CvMatchAsync(IFormFile? cvFile, string? cvText, string jobOfferText)
        {
            if (cvFile != null)
                return await CvMatchWithFileAsync(cvFile, jobOfferText);

            if (string.IsNullOrWhiteSpace(cvText))
                throw new ArgumentException("Debe proveer texto del CV o un archivo.");

            var prompt = BuildPrompt(cvText, jobOfferText);

            var response = await _anthropicClient.Messages.Create(new Anthropic.Models.Messages.MessageCreateParams
            {
                Model = "claude-sonnet-4-6",
                MaxTokens = 1024,
                Messages = [new() { Role = Anthropic.Models.Messages.Role.User, Content = prompt }]
            });

            response.Content[0].TryPickText(out var textBlock);
            var responseText = textBlock?.Text ?? string.Empty;
            return ParseResponse(responseText);
        }
        private async Task<CvMatchResults> CvMatchWithFileAsync(IFormFile cvFile, string jobOfferText)
        {
            var uploaded = await _anthropicClient.Beta.Files.Upload(new FileUploadParams
            {
                File = new BinaryContent
                {
                    Stream = cvFile.OpenReadStream(),
                    FileName = cvFile.FileName,
                    ContentType = new(cvFile.ContentType ?? "application/pdf")
                }
            });
            try
            {
                    var response = await _anthropicClient.Beta.Messages.Create(new Anthropic.Models.Beta.Messages.MessageCreateParams
                {
                    Model = "claude-sonnet-4-6",
                    MaxTokens = 1024,
                    Betas = ["files-api-2025-04-14"],
                    Messages =
                    [
                        new BetaMessageParam
                        {
                            Role = Anthropic.Models.Beta.Messages.Role.User,
                            Content = new List<BetaContentBlockParam>
                            {
                                new BetaTextBlockParam { Text = BuildFilePrompt(jobOfferText) },
                                new BetaRequestDocumentBlock
                                {
                                    Source = new BetaFileDocumentSource { FileID = uploaded.ID }
                                }
                            }
                        }
                    ]
                });
                response.Content[0].TryPickText(out var textBlock);
                return ParseResponse(textBlock?.Text ?? string.Empty);
            }
            finally
            {
                await _anthropicClient.Beta.Files.Delete(uploaded.ID);
            }
            
        }

        private string BuildFilePrompt(string jobOfferText)
        {
            return $$"""
                El documento adjunto es un CV. Analizalo junto a la siguiente oferta de trabajo.
                Respondé SOLO en JSON con esta estructura exacta. No uses bloques de código markdown. Devolvé únicamente el JSON puro.
                {
                "matchScore": <número del 0 al 100>,
                "summary": "<resumen breve>",
                "strengths": ["<fortaleza 1>", "<fortaleza 2>"],
                "weaknesses": ["<debilidad 1>", "<debilidad 2>"],
                "suggestions": ["<sugerencia 1>", "<sugerencia 2>"]
                }

                Oferta de trabajo:
                {{jobOfferText}}
                """;
        }

        private string BuildPrompt(string cvText, string jobOfferText)
        {
            return $$"""
                Analizá el siguiente CV y oferta de trabajo. Respondé SOLO en JSON con esta estructura exacta.
                No uses bloques de código markdown. Devolvé únicamente el JSON puro.
                {
                  "matchScore": <número del 0 al 100>,
                  "summary": "<resumen breve>",
                  "strengths": ["<fortaleza 1>", "<fortaleza 2>"],
                  "weaknesses": ["<debilidad 1>", "<debilidad 2>"],
                  "suggestions": ["<sugerencia 1>", "<sugerencia 2>"]
                }

                CV:
                {{cvText}}

                Oferta de trabajo:
                {{jobOfferText}}
                """;
        }

        private CvMatchResults ParseResponse(string responseText)
        {
            var cleaned = responseText.Trim();

            if (cleaned.StartsWith("```"))
            {
                cleaned = cleaned.Substring(cleaned.IndexOf('\n') + 1);
                cleaned = cleaned.Substring(0, cleaned.LastIndexOf("```")).Trim();
            }

            var result = JsonSerializer.Deserialize<CvMatchResults>(cleaned, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return result ?? new CvMatchResults();
        }
    }
}