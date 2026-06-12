using JobTracker.Models;
using JobTracker.Repositories;
using JobTracker.Services;
using Moq;

namespace JobTracker.Tests.Services
{
    public class ApplicationServiceTests
    {
        private Mock<IApplicationRepository> _mockRepoApplication = new Mock<IApplicationRepository>();
        private Mock<IStatusHistoryRepository> _mockRepoStatusHistory= new Mock<IStatusHistoryRepository>();
        private ApplicationService _service;
        public ApplicationServiceTests()
        {
            _service = new ApplicationService(_mockRepoApplication.Object, _mockRepoStatusHistory.Object);
        }

        private Application CreateTestApplication() => new Application
        {
                Id = 1,
                JobTitle = "Test Job",
                Description = "Job description test",
                CompanyName = "Test company",
                AppliedDate = DateTimeOffset.UtcNow,
                LastUpdated = DateTimeOffset.UtcNow
        };

        [Fact]
        public async Task CreateApplicationAsync_ShouldReturnCreatedApplication()
        {
            //Arrange
            var application = CreateTestApplication();

            _mockRepoApplication
                .Setup(r => r.CreateAsync(It.IsAny<Application>()))
                .ReturnsAsync(application);

            _mockRepoStatusHistory
                .Setup(r => r.CreateStatusHistoryAsync(It.IsAny<StatusHistory>()))
                .ReturnsAsync(new StatusHistory());

            //Act
            var result = await _service.CreateApplicationAsync(application);

            //Assert
            Assert.NotNull(result);
        }

        [Fact]
         public async Task CreateApplicationAsync_ShouldConvertDatesToUtc()
        {
            //Arrange
            var application = CreateTestApplication();

            _mockRepoApplication
                .Setup(r => r.CreateAsync(It.IsAny<Application>()))
                .ReturnsAsync(application);

            _mockRepoStatusHistory
                .Setup(r => r.CreateStatusHistoryAsync(It.IsAny<StatusHistory>()))
                .ReturnsAsync(new StatusHistory());

            //Act
            var result = await _service.CreateApplicationAsync(application);

            //Assert
            Assert.Equal(TimeSpan.Zero, result.AppliedDate.Offset);
            Assert.Equal(TimeSpan.Zero, result.LastUpdated.Offset);
        }

        [Fact]
         public async Task CreateApplicationAsync_ShouldCreateStatusHistory()
        {
            //Arrange
            var application = CreateTestApplication();

            _mockRepoApplication
                .Setup(r => r.CreateAsync(It.IsAny<Application>()))
                .ReturnsAsync(application);

            _mockRepoStatusHistory
                .Setup(r => r.CreateStatusHistoryAsync(It.IsAny<StatusHistory>()))
                .ReturnsAsync(new StatusHistory());

            //Act
            var result = await _service.CreateApplicationAsync(application);

            //Assert
            _mockRepoStatusHistory.Verify(
                r => r.CreateStatusHistoryAsync(It.IsAny<StatusHistory>()),
                Times.Once
            );
        }

        [Fact]
        public async Task UpdateApplicationAsync_ShouldReturnApplication()
        {
            //Arrange
            var application = CreateTestApplication();

            _mockRepoApplication
                .Setup(r => r.UpdateAsync(It.IsAny<Application>(), 1))
                .ReturnsAsync(application);

            //Act
            var result = await _service.UpdateApplicationAsync(application, 1);

            //Assert
            Assert.NotNull(result);
        }

                [Fact]
        public async Task UpdateApplicationAsync_ShouldConvertDatesToUtc()
        {
            //Arrange
            var application = CreateTestApplication();
            application.AppliedDate = DateTimeOffset.Now;
            application.LastUpdated = DateTimeOffset.Now;

            _mockRepoApplication
                .Setup(r => r.UpdateAsync(It.IsAny<Application>(), 1))
                .ReturnsAsync(application);

            //Act
            var result = await _service.UpdateApplicationAsync(application, 1);

            //Assert
            Assert.Equal(TimeSpan.Zero, result.AppliedDate.Offset);
            Assert.Equal(TimeSpan.Zero, result.LastUpdated.Offset);
        }

        [Fact]
        public async Task DeleteApplicationAsync_ShouldReturnTrue_WhenApplicationExists()
        {
            // Arrange
            _mockRepoApplication
                .Setup(r => r.DeleteAsync(1, 1))
                .ReturnsAsync(true);
            // Act
            var result = await _service.DeleteApplicationAsync(1,1);
        
            // Assert
            Assert.True(result);
        }
    }

}