using System.ComponentModel;
using System.Text.Json;
using JobTracker.Repositories;
using Microsoft.SemanticKernel;

namespace JobTracker.Services
{
    public class JobCoachPlugin
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IStatusHistoryRepository _statusRepository;
        private readonly int _userId;

        public JobCoachPlugin(IApplicationRepository applicationRepository, IStatusHistoryRepository statusRepository, int userId)
        {
            this._applicationRepository = applicationRepository;
            this._statusRepository = statusRepository;
            this._userId = userId;
        }

        [KernelFunction]
        [Description("Returns all job applications for the current user")]
        public async Task<string> GetApplicationsAsync()
        {
            return JsonSerializer.Serialize(await _applicationRepository.GetAllAsync(_userId));
        }

        [KernelFunction]
        [Description("Returns the status history for a given application")]
        public async Task<string> GetStatusHistoryAsync(int applicationId)
        {
            return JsonSerializer.Serialize(await _statusRepository.GetStatusHistoryByApplicationIdAsync(applicationId));
        }
        
    }
}