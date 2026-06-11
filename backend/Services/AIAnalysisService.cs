using System.Text.Json;
using Anthropic;
using JobTracker.DTOs;
using Anthropic.Core;
using Anthropic.Models.Beta.Files;
using Anthropic.Models.Beta.Messages;
using JobTracker.Repositories;
using JobTracker.Models;
using Anthropic.Models.Messages;
using Microsoft.Extensions.AI;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel;
using System.Text;

namespace JobTracker.Services
{
    public class AIAnalysisService : IAIAnalysisService
    {
        private readonly AnthropicClient _anthropicClient;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStatusHistoryRepository _statusHistoryRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly ICvIndexService _cvIndexService;
        private readonly IEvaluationService _evaluationService;
        private readonly IEvaluationScoreRepository _evaluationScoreRepository;

        public AIAnalysisService(AnthropicClient anthropicClient, IApplicationRepository applicationRepository, IStatusHistoryRepository statusHistoryRepository, IConversationRepository conversationRepository, ICvIndexService cvIndexService, IEvaluationService evaluationService, IEvaluationScoreRepository evaluationScoreRepository)
        {
            this._anthropicClient = anthropicClient;
            this._applicationRepository = applicationRepository;
            this._statusHistoryRepository = statusHistoryRepository;
            this._conversationRepository = conversationRepository;
            this._cvIndexService = cvIndexService;
            this._evaluationService = evaluationService;
            this._evaluationScoreRepository = evaluationScoreRepository;
        }
        public async Task<CvMatchResults> CvMatchAsync(IFormFile? cvFile, string? cvText, string jobOfferText)
        {
            if (cvFile != null)
                return await CvMatchWithFileAsync(cvFile, jobOfferText);

            if (string.IsNullOrWhiteSpace(cvText))
                throw new ArgumentException("Debe proveer texto del CV o un archivo.");

            var prompt = BuildPrompt(cvText, jobOfferText);

             //create anthropic client
            IChatClient chatClient = _anthropicClient.AsIChatClient("claude-haiku-4-5-20251001");
            //build kernel
            var builder = Kernel.CreateBuilder();
            //convert chatclient to completion service
            var cs = chatClient.AsChatCompletionService();
            builder.Services.AddSingleton<IChatCompletionService>(cs);
            var kernel = builder.Build();

            //create chathistory with system prompt
            var chatHistory = new ChatHistory(BuildSystemInstructions());
            //add user prompt, what to do
            chatHistory.AddUserMessage(BuildPrompt(cvText, jobOfferText));
            var chatService = kernel.GetRequiredService<IChatCompletionService>();

            //result from chatservice parse to application insights dto.
            var result = await chatService.GetChatMessageContentAsync(chatHistory, kernel: kernel);

            return ParseResponse(result.Content ?? string.Empty);

        }
        private async Task<CvMatchResults> CvMatchWithFileAsync(IFormFile cvFile, string jobOfferText)
        {
            var uploaded = await _anthropicClient.Beta.Files.Upload(new FileUploadParams
            {
                File = new Anthropic.Core.BinaryContent
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
                    System = BuildSystemInstructions(),
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
                Job offer:
                {{jobOfferText}}
                """;
        }

        private string BuildPrompt(string cvText, string jobOfferText)
        {
            return $$"""
                CV:
                {{cvText}}

                Job offer:
                {{jobOfferText}}
                """;
        }
        private string BuildSystemInstructions()
        {
            return """
                
                Analyse the following CV and job offer. Respond ONLY in JSON with this exact structure. Do not use markdown code blocks. Return pure JSON only. Always respond in English unless explicitly asked otherwise.
                {
                  "matchScore": <number from 0 to 100>,
                  "summary": "<brief summary>",
                  "strengths": ["<strength 1>", "<strength 2>"],
                  "weaknesses": ["<weakness 1>", "<weakness 2>"],
                  "suggestions": ["<suggestion 1>", "<suggestion 2>"]
                }
            
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
            //Search application by id and userid
            var application = await _applicationRepository.GetByIdAsync(applicationId, userId);
            if (application == null) throw new ArgumentException("Aplicación no encontrada.");

            //search statushistory by application id
            var statusHistory = await _statusHistoryRepository.GetStatusHistoryByApplicationIdAsync(applicationId);

            //create anthropic client
            IChatClient chatClient = _anthropicClient.AsIChatClient("claude-haiku-4-5-20251001");
            //build kernel
            var builder = Kernel.CreateBuilder();
            //convert chatclient to completion service
            var svc = chatClient.AsChatCompletionService();
            builder.Services.AddSingleton<IChatCompletionService>(svc);
            var kernel = builder.Build();

            //create chathistory with system prompt
            var chatHistory = new ChatHistory(BuildSystemInsightPrompt());
            //add user prompt, what to do
            chatHistory.AddUserMessage(BuildInsightsPrompt(application, statusHistory));
            var chatService = kernel.GetRequiredService<IChatCompletionService>();

            //result from chatservice parse to application insights dto.
            var result = await chatService.GetChatMessageContentAsync(chatHistory, kernel: kernel);
            return ParseApplicationInsightsResponse(result.Content ?? string.Empty);
        }

        private string BuildInsightsPrompt(Application application, List<StatusHistory> statusHistory)
        {
            var historial = string.Join("\n", statusHistory.Select(sh => $"- {sh.Status} el {sh.ChangedAt:dd/MM/yyyy}"));
            return $$"""
                Empresa: {{application.CompanyName}}
                Puesto: {{application.JobTitle}}

                Historial de estados:
                {{historial}}
                """;
        }

        private string BuildSystemInsightPrompt()
        {
            return """
                Analyse the following job application history.
                Respond ONLY in JSON with this exact structure. Do not use markdown code blocks. Return pure JSON only.
                Always respond in English unless explicitly asked otherwise.
                {
                "overview": "<what is happening with this application, max 2 sentences>",
                "whatToExpect": "<what may happen next, max 2 sentences>",
                "recommendations": ["<concrete recommendation 1>", "<concrete recommendation 2>", "<concrete recommendation 3>"]
                }
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

       private string BuildSystemJobCoachPrompt(List<string> cvContext)
        {
            var cvSection = cvContext.Any()
                ? $"\n\nRelevant CV information:\n{string.Join("\n\n", cvContext)}"
                : string.Empty;

            return $$"""
                    You are a job coach who helps job seekers discover why they are not getting responses to their applications or not succeeding in their search.

                    Use the available tools to retrieve data and, based on that data, give a direct and actionable response with clear steps the user can take. For example: "You should be more descriptive about your professional experience." Use markdown format with bullet points.

                    Only answer questions related to job applications or job searching. Never invent data or search external sources — always use the data provided by the tools. Answer in the language the user writes in. If unclear, default to plain conversational English.
                    Never write phrases like "Let me check your applications" or "I'll retrieve your data".
                    Retrieve the data silently and respond directly with your analysis.{{cvSection}}
                    
                    """;
        }

        public async IAsyncEnumerable<string> GetJobCoachStreamAsync(string question, int userId, string conversationId)
        {
            //1 From anthropicclient to chatclient
            IChatClient chatClient = _anthropicClient.AsIChatClient("claude-haiku-4-5-20251001");
            //2 add middleware to rplace while(true)
            IChatClient pipeline = chatClient.AsBuilder().UseFunctionInvocation().Build();
            //3 conver to type that semantic kernel can use as a chat completion service
            IChatCompletionService svc = pipeline.AsChatCompletionService();

            //4 build kernel and add the chat completion service to the DI container
            var builder = Kernel.CreateBuilder();
            builder.Services.AddSingleton<IChatCompletionService>(svc);
            var kernel = builder.Build();
            //5 register plugins
            kernel.Plugins.AddFromObject(new JobCoachPlugin(_applicationRepository, _statusHistoryRepository, userId));

            //6 Chat history
            var conversation = await _conversationRepository.GetConversationHistoryAsync(conversationId, userId);
            var cvContext = await _cvIndexService.SearchCvAsync(question, userId);
            var chatHistory = new ChatHistory(BuildSystemJobCoachPrompt(cvContext));
            foreach(var message in conversation)
            {
                if (message.Role == "user")
                    chatHistory.AddUserMessage(message.Content);
                else if (message.Role == "assistant")
                    chatHistory.AddAssistantMessage(message.Content);
            }
            chatHistory.AddUserMessage(question);

            //7 call service
            var chatService = kernel.GetRequiredService<IChatCompletionService>();
            var settings = new PromptExecutionSettings
            {
                FunctionChoiceBehavior = FunctionChoiceBehavior.Auto()
            };

            var fullResponse = new StringBuilder();

            await foreach (var chunk in chatService.GetStreamingChatMessageContentsAsync(chatHistory, settings, kernel: kernel))
            {
                if (chunk.Content != null)
                {
                    fullResponse.Append(chunk.Content);
                    yield return chunk.Content;
                }
            }

            await _conversationRepository.SaveMessageAsync(new ConversationMessage
            {
                ConversationId = conversationId,
                UserId = userId,
                Role = "user",
                Content = question,
                Timestamp = DateTimeOffset.UtcNow
            });

            await _conversationRepository.SaveMessageAsync(new ConversationMessage
            {
                ConversationId = conversationId,
                UserId = userId,
                Role = "assistant",
                Content = fullResponse.ToString(),
                Timestamp = DateTimeOffset.UtcNow
            });

            var evaluation = await _evaluationService.EvaluateAsync(question, fullResponse.ToString());
            EvaluationScore ev = new EvaluationScore();
            ev.Relevance = evaluation.Relevance;
            ev.Grounding = evaluation.Grounding;
            ev.Actionability = evaluation.Actionability;
            ev.Tone = evaluation.Tone;
            ev.Scope = evaluation.Scope;
            ev.Average = evaluation.Average;
            ev.Question = question;
            ev.Response = fullResponse.ToString();
            ev.CreatedAt = DateTimeOffset.UtcNow;

            await _evaluationScoreRepository.SaveAsync(ev);

        }
    }
}