using System.Text.Json;
using Anthropic;
using JobTracker.DTOs;
using Microsoft.Extensions.AI;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace JobTracker.Services
{
    public class EvaluationService : IEvaluationService
    {
        private readonly AnthropicClient _anthropicClient;

        public EvaluationService(AnthropicClient anthropicClient)
        {
            this._anthropicClient = anthropicClient;
        }
        public async Task<EvaluationResult> EvaluateAsync(string question, string response)
        {
            IChatClient chatClient = _anthropicClient.AsIChatClient("claude-haiku-4-5-20251001");
            var builder = Kernel.CreateBuilder();
            var cs = chatClient.AsChatCompletionService();
            builder.Services.AddSingleton<IChatCompletionService>(cs);
            var kernel = builder.Build();

            var chatHistory = new ChatHistory(BuildEvaluatorSystemPrompt());
            chatHistory.AddUserMessage($"Question: {question}\n\nJob Coach Response: {response}");
            var chatService = kernel.GetRequiredService<IChatCompletionService>();

            var result = await chatService.GetChatMessageContentAsync(chatHistory, kernel: kernel);
            
            var cleaned = (result?.Content ?? string.Empty).Trim();

            if (cleaned.StartsWith("```"))
            {
                cleaned = cleaned.Substring(cleaned.IndexOf('\n') + 1);
                cleaned = cleaned.Substring(0, cleaned.LastIndexOf("```")).Trim();
            }

            var finalResult = JsonSerializer.Deserialize<EvaluationResult>(cleaned, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return finalResult ?? new EvaluationResult();
            
        }

        private string BuildEvaluatorSystemPrompt()
        {
            var prompt = $$"""
                        You are an evaluator of job coach AI responses. Your job is to assess whether a response meets the quality criteria for the user's question.

                        Given a user question and a job coach response, score each criterion from 1 to 5 using the rubric below. Then calculate the average as the final score.

                        ## Rubric

                        **Relevance**
                        - 5: Answers the question directly without going off-topic
                        - 3: Partially answers the question
                        - 1: Answers something unrelated to the question

                        **Grounding**
                        - 5: Uses only real data from the tools, invents nothing
                        - 3: Uses some user data but invents part of the answer
                        - 1: Invents the entire response, uses no provided data

                        **Actionability**
                        - 5: Steps are clear and 100% executable by the user
                        - 3: Steps are unclear, user needs to research further
                        - 1: No clear steps given

                        **Tone**
                        - 5: Empathetic to user frustration, direct and warm
                        - 3: Friendly but slightly off, mildly irritating
                        - 1: Cold, no empathy, robotic

                        **Scope**
                        - 5: Stays perfectly on topic throughout
                        - 3: Mostly on topic, occasionally drifts
                        - 1: Completely off topic

                        Only evaluate responses — do not answer other questions. 
                        Respond only in JSON with a score per criterion and a final average score.
                        For example: 
                        {
                        "relevance": 4.0,
                        "grounding": 3.5,
                        "actionability": 5.0,
                        "tone": 4.0,
                        "scope": 4.5,
                        "average": 4.2
                        }

                        """;
                        return prompt;
        }
    }
}