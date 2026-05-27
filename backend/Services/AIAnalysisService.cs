using System.Text.Json;
using Anthropic;
using Anthropic.Models.Messages;
using JobTracker.DTOs;
using Anthropic.Core;
using Anthropic.Models.Beta.Files;
using Anthropic.Models.Beta.Messages;
using JobTracker.Repositories;
using JobTracker.Models;

namespace JobTracker.Services
{
    public class AIAnalysisService : IAIAnalysisService
    {
        private readonly AnthropicClient _anthropicClient;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStatusHistoryRepository _statusHistoryRepository;

        public AIAnalysisService(AnthropicClient anthropicClient, IApplicationRepository applicationRepository, IStatusHistoryRepository statusHistoryRepository)
        {
            this._anthropicClient = anthropicClient;
            this._applicationRepository = applicationRepository;
            this._statusHistoryRepository = statusHistoryRepository;
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
                The attached document is a CV. Analyse it together with the following job offer.
                Respond ONLY in JSON with this exact structure. Do not use markdown code blocks. Return pure JSON only.
                Always respond in English unless explicitly asked otherwise.
                {
                "matchScore": <number from 0 to 100>,
                "summary": "<brief summary>",
                "strengths": ["<strength 1>", "<strength 2>"],
                "weaknesses": ["<weakness 1>", "<weakness 2>"],
                "suggestions": ["<suggestion 1>", "<suggestion 2>"]
                }

                Job offer:
                {{jobOfferText}}
                """;
        }

        private string BuildPrompt(string cvText, string jobOfferText)
        {
            return $$"""
                Analyse the following CV and job offer. Respond ONLY in JSON with this exact structure.
                Do not use markdown code blocks. Return pure JSON only.
                Always respond in English unless explicitly asked otherwise.
                {
                  "matchScore": <number from 0 to 100>,
                  "summary": "<brief summary>",
                  "strengths": ["<strength 1>", "<strength 2>"],
                  "weaknesses": ["<weakness 1>", "<weakness 2>"],
                  "suggestions": ["<suggestion 1>", "<suggestion 2>"]
                }

                CV:
                {{cvText}}

                Job offer:
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

        public async Task<ApplicationInsightsResults> GetApplicationInsightsAsync(int applicationId, int userId)
        {
            var application = await _applicationRepository.GetByIdAsync(applicationId, userId);
            if (application == null) throw new ArgumentException("Aplicación no encontrada.");

            var statusHistory = await _statusHistoryRepository.GetStatusHistoryByApplicationIdAsync(applicationId);

            var prompt = BuildInsightsPrompt(application, statusHistory);
            var response = await _anthropicClient.Messages.Create(new Anthropic.Models.Messages.MessageCreateParams
            {
                Model = "claude-haiku-4-5-20251001",
                MaxTokens = 512,
                Messages = [new() { Role = Anthropic.Models.Messages.Role.User, Content = prompt }]
            });
            response.Content[0].TryPickText(out var textBlock);
            return ParseApplicationInsightsResponse(textBlock?.Text ?? string.Empty);
        }

        private string BuildInsightsPrompt(Application application, List<StatusHistory> statusHistory)
        {
            var historial = string.Join("\n", statusHistory.Select(sh => $"- {sh.Status} el {sh.ChangedAt:dd/MM/yyyy}"));
            return $$"""
                Analyse the following job application history.
                Respond ONLY in JSON with this exact structure. Do not use markdown code blocks. Return pure JSON only.
                Always respond in English unless explicitly asked otherwise.
                {
                "overview": "<what is happening with this application, max 2 sentences>",
                "whatToExpect": "<what may happen next, max 2 sentences>",
                "recommendations": ["<concrete recommendation 1>", "<concrete recommendation 2>", "<concrete recommendation 3>"]
                }

                Empresa: {{application.CompanyName}}
                Puesto: {{application.JobTitle}}

                Historial de estados:
                {{historial}}
                """;
        }

        private ApplicationInsightsResults ParseApplicationInsightsResponse(string responseText)
        {
            var cleaned = responseText.Trim();

            if (cleaned.StartsWith("```"))
            {
                cleaned = cleaned.Substring(cleaned.IndexOf('\n') + 1);
                cleaned = cleaned.Substring(0, cleaned.LastIndexOf("```")).Trim();
            }

            var result = JsonSerializer.Deserialize<ApplicationInsightsResults>(cleaned, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return result ?? new ApplicationInsightsResults();
        }
        
    }
}