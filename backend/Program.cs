using System.Text;
using Anthropic;
using Anthropic.Core;
using JobTracker.Data;
using JobTracker.Models;
using JobTracker.Repositories;
using JobTracker.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.VectorData;
using Microsoft.IdentityModel.Tokens;
using Microsoft.SemanticKernel.ChatCompletion;
using OpenAI.VectorStores;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options => options.SuppressAsyncSuffixInActionNames = false);
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<JobTrackerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
    o => o.UseVector()));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IStatusHistoryRepository, StatusHistoryRepository>();
builder.Services.AddScoped<IStatusHistoryService, StatusHistoryService>();
builder.Services.AddScoped<IAIAnalysisService, AIAnalysisService>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<ICvIndexService, CvIndexService>();
builder.Services.AddScoped<IEvaluationService, EvaluationService>();
builder.Services.AddScoped<ICvMatchOrquestator, CvMatchOrquestator>();
builder.Services.AddScoped<IEvaluationScoreRepository, EvaluationScoreRepository>();
//Anthropic API client
builder.Services.AddScoped(sp => new AnthropicClient { ApiKey = builder.Configuration["Anthropic:ApiKey"]! });
builder.Services.AddScoped<IChatCompletionService>(sp =>
{
    var anthropicClient = sp.GetRequiredService<AnthropicClient>();
    return anthropicClient.AsIChatClient("claude-haiku-4-5-20251001").AsChatCompletionService();
});

// Ollama embedding generator
builder.Services.AddOllamaEmbeddingGenerator("nomic-embed-text", new Uri("http://localhost:11434"));

// Registrar OpenApi con el transformer
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

//JWT`
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["AllowedOrigins"]!.Split(","))
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

//peRMITIR FRONTEND
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.Map("/health", async context =>
{
    await context.Response.WriteAsJsonAsync(new { status = "healthy" });
});

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<JobTrackerContext>();
    db.Database.Migrate();
}

app.Run();
