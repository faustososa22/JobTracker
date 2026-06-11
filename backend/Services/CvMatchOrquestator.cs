using System.Text;
using System.Text.Json;
using Anthropic;
using JobTracker.DTOs;
using Microsoft.Extensions.AI;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.ChatCompletion;
using OllamaSharp;

namespace JobTracker.Services
{
    public class CvMatchOrquestator : ICvMatchOrquestator
    {
        private readonly AnthropicClient _anthropicClient;

        public CvMatchOrquestator(AnthropicClient anthropicClient)
        {
            this._anthropicClient = anthropicClient;
        }
        public async Task<CvMatchResults> MatchAsync(string cvText, string jobOfferText)
        {
            //1 From anthropicclient to chatclient
            IChatClient chatClient = _anthropicClient.AsIChatClient("claude-sonnet-4-6");
            //2 add middleware to replace while(true)
            IChatClient pipeline = chatClient.AsBuilder().UseFunctionInvocation().Build();
            //3 conver to type that semantic kernel can use as a chat completion service
            IChatCompletionService svc = pipeline.AsChatCompletionService();

            //4 build kernel and add the chat completion service to the DI container
            var builder = Kernel.CreateBuilder();
            builder.Services.AddSingleton<IChatCompletionService>(svc);
            var kernel = builder.Build();

            //5 Create agents
            //CV ANALYZER
            var cvAnalyzer = new ChatCompletionAgent
            {
                Name = "CvAnalyzer",
                Instructions = """
                You are a professional CV analyzer who help people to extract al relevant information about their cv.
                Extract skills, experience and education from de cv provided, do not make up any information.
                Respond only in JSON with fields: skills, experience, education. No markdown.
                """,
                Kernel = kernel
            };

            //Job Description Analyzer
            var jobAnalyzer = new ChatCompletionAgent
            {
                Name = "JobAnalyzer",
                Instructions = """
                You are a professional Job analyzer who help people to extract al relevant information about a job description.
                Extract necessary skills, experience and education required from de job description provided, do not make up any information.
                Respond only in JSON with fields: skills, experience, education. No markdown.
                """,
                Kernel = kernel
            };

            //Match Evaluator
            var matchEvaluator = new ChatCompletionAgent
            {
                Name = "MatchEvaluator",
                Instructions = """
                You are a professional match evaluator who help people to evaluate their cv and a job description.
                Use only the cv and job information provided, do not make up any information.
                Respond only in JSON with fields: matchScore, sumary, strengths, weaknesses and suggestions. No markdown.
                """,
                Kernel = kernel
            };

            //6 Call agents and Create chat history

            //CV analyzer
            var cvHistory = new ChatHistory();
            cvHistory.AddUserMessage(cvText);

            var cvResult = new StringBuilder();
            await foreach (var chunk in cvAnalyzer.InvokeAsync(cvHistory))
            {
                cvResult.Append(chunk.Message.Content);
            }
            var cvAnalysisText = cvResult.ToString();

            //Job decription analyzer
            var jobHistory = new ChatHistory();
            jobHistory.AddUserMessage(jobOfferText);

            var jobResult = new StringBuilder();
            await foreach (var chunk in jobAnalyzer.InvokeAsync(jobHistory))
            {
                jobResult.Append(chunk.Message.Content);
            }

            var jobResultText = jobResult.ToString();

            //Match Evaluator
            var matchHistory = new ChatHistory();
            matchHistory.AddUserMessage($"CV Analysis:\n{cvAnalysisText}\n\nJob Analysis:\n{jobResultText}");

            var matchResult = new StringBuilder();
            await foreach (var chunk in matchEvaluator.InvokeAsync(matchHistory))
            {
                matchResult.Append(chunk.Message.Content);
            }
            
            var matchResultText = matchResult.ToString();
            return JsonSerializer.Deserialize<CvMatchResults>(matchResultText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new CvMatchResults();

        }
    }
}