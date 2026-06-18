using JobTracker.Services;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Moq;

namespace JobTracker.Tests.Services
{
    public class EvaluationServiceTest
    {
        private Mock<IChatCompletionService> _mockChatCompletionService = new Mock<IChatCompletionService>();
        private EvaluationService _service;

        public EvaluationServiceTest()
        {
            _service = new EvaluationService(_mockChatCompletionService.Object);
        }

        [Fact]
        public async Task EvaluateAsync_ShouldReturnAValidJSONResponse()
        {
            //Arrange
            var fakeResponse = new ChatMessageContent(AuthorRole.Assistant, @"{""relevance"": 4.0, ""grounding"": 3.5, ""actionability"": 5.0, ""tone"": 4.0, ""scope"": 4.5, ""average"": 4.2}");

            _mockChatCompletionService
                .Setup(r => r.GetChatMessageContentsAsync(
                    It.IsAny<ChatHistory>(),
                    It.IsAny<PromptExecutionSettings?>(),
                    It.IsAny<Kernel?>(),
                    It.IsAny<CancellationToken>()
                ))
                .ReturnsAsync(new List<ChatMessageContent> {fakeResponse});


            //Act
            var result = await _service.EvaluateAsync("Cuantas aplicaciones tengo?", "Tenes 4 millones");

            //Assert
            Assert.NotNull(result);
            Assert.Equal(4.0f, result.Relevance);
        }

        [Fact]
        public async Task EvaluateAsync_ShouldCleanTheMarkdow_WhenLLMRespondWithBackticks()
        {
            //Arrange
            var fakeResponse = new ChatMessageContent(AuthorRole.Assistant, """
            ```json
            {"relevance": 4.0, "grounding": 3.5, "actionability": 5.0, "tone": 4.0, "scope": 4.5, "average": 4.2}
            ```
            """);

            _mockChatCompletionService
                .Setup(r => r.GetChatMessageContentsAsync(
                    It.IsAny<ChatHistory>(),
                    It.IsAny<PromptExecutionSettings?>(),
                    It.IsAny<Kernel?>(),
                    It.IsAny<CancellationToken>()
                ))
                .ReturnsAsync(new List<ChatMessageContent> {fakeResponse});


            //Act
            var result = await _service.EvaluateAsync("Cuantas aplicaciones tengo?", "Tenes 4 millones");

            //Assert
            Assert.NotNull(result);
            Assert.Equal(4.0f, result.Relevance);
        }

        [Fact]
        public async Task EvaluateAsync_ShouldReturnEmptyResult_WhenLLLMResponseIsInvalid()
        {
            //Arrange
            var fakeResponse = new ChatMessageContent(AuthorRole.Assistant, "");

            _mockChatCompletionService
                .Setup(r => r.GetChatMessageContentsAsync(
                    It.IsAny<ChatHistory>(),
                    It.IsAny<PromptExecutionSettings?>(),
                    It.IsAny<Kernel?>(),
                    It.IsAny<CancellationToken>()
                ))
                .ReturnsAsync(new List<ChatMessageContent> {fakeResponse});


            //Act
            var result = await _service.EvaluateAsync("Cuantas aplicaciones tengo?", "Tenes 4 millones");

            //Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.Relevance);
            Assert.Equal(0, result.Grounding);
            Assert.Equal(0, result.Actionability);
            Assert.Equal(0, result.Tone);
            Assert.Equal(0, result.Scope);
            Assert.Equal(0, result.Average);

            
        }
    }
}