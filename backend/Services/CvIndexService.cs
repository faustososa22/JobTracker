using JobTracker.Data;
using JobTracker.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.VectorData;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace JobTracker.Services
{
    public class CvIndexService : ICvIndexService
    {
        private readonly JobTrackerContext _context;
        private readonly IEmbeddingGenerator<string, Embedding<float>> _embeddingGenerator;

        public CvIndexService(JobTrackerContext _context, IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator)
        {
            this._context = _context;
            this._embeddingGenerator = embeddingGenerator;
        }
        public async Task IndexCvAsync(string cvText, int userId)
        {
            var existing = _context.CvChunks.Where(c => c.UserId == userId);
            _context.CvChunks.RemoveRange(existing);
            var chunks = cvText.Split("\n\n", StringSplitOptions.RemoveEmptyEntries);
            foreach (var chunk in chunks)
            {
            var embedding = await _embeddingGenerator.GenerateAsync(chunk);
                _context.CvChunks.Add(new CvChunk
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Content = chunk,
                    Embedding = new Vector(embedding.Vector.ToArray())
                });
            }
            await _context.SaveChangesAsync();
        }

        public async Task<List<string>> SearchCvAsync(string query, int userId)
        {
            var embedding = await _embeddingGenerator.GenerateAsync(query);
            var vector = new Vector(embedding.Vector.ToArray());

            return await _context.CvChunks
                .Where(c => c.UserId == userId)
                .OrderBy(c => c.Embedding.CosineDistance(vector))
                .Take(3)
                .Select(c => c.Content)
                .ToListAsync();   
        }
    }

}