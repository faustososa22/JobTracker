using System.Text.Json;
using Anthropic;
using Anthropic.Models.Messages;
using JobTracker.Dtos;

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
            if (string.IsNullOrWhiteSpace(cvText))
                throw new ArgumentException("Debe proveer texto del CV.");

            var prompt = BuildPrompt(cvText, jobOfferText);

            var response = await _anthropicClient.Messages.Create(new MessageCreateParams
            {
                Model = "claude-sonnet-4-6",
                MaxTokens = 1024,
                Messages = [new() { Role = Role.User, Content = prompt }]
            });

            response.Content[0].TryPickText(out var textBlock);
            var responseText = textBlock?.Text ?? string.Empty;
            return ParseResponse(responseText);
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