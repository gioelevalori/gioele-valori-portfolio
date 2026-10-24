using System.Security.Claims;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("Spazio") ?? throw new InvalidOperationException("Configure ConnectionStrings__Spazio.");
builder.Services.AddDbContext<SpazioDb>(options => options.UseNpgsql(connection));
builder.Services.AddIdentityApiEndpoints<DemoUser>(options => {
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 12;
    options.Lockout.MaxFailedAccessAttempts = 5;
}).AddEntityFrameworkStores<SpazioDb>();
builder.Services.AddAuthorization();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => {
    var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
    if (origins.Length > 0) policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();
}));
builder.Services.AddRateLimiter(options => {
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(context.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions {PermitLimit=12,Window=TimeSpan.FromMinutes(1)}));
    options.AddPolicy("tasks", context => RateLimitPartition.GetFixedWindowLimiter(context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "anonymous", _ => new FixedWindowRateLimiterOptions {PermitLimit=120,Window=TimeSpan.FromMinutes(1)}));
});
builder.Services.AddHostedService<ExpiredDemoCleanup>();
var app = builder.Build();
app.UseExceptionHandler();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
if (builder.Configuration.GetValue<bool>("Database:Initialize")) {
    await using var scope = app.Services.CreateAsyncScope();
    await scope.ServiceProvider.GetRequiredService<SpazioDb>().Database.EnsureCreatedAsync();
}
app.MapGet("/health", async (SpazioDb db) => await db.Database.CanConnectAsync() ? Results.Ok(new {status="healthy",storage="PostgreSQL"}) : Results.Problem(statusCode:503));
app.MapGroup("/api/auth").RequireRateLimiting("auth").MapIdentityApi<DemoUser>();
var tasks = app.MapGroup("/api/tasks").RequireAuthorization().RequireRateLimiting("tasks");
tasks.MapGet("/", async (ClaimsPrincipal user, SpazioDb db, CancellationToken ct) => {
    var owner = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var items = await db.Tasks.AsNoTracking().Where(t=>t.OwnerId==owner).OrderBy(t=>t.CreatedAt).ToListAsync(ct);
    return Results.Ok(items.Select(t=>t.ToDto()));
});
tasks.MapPost("/", async (TaskInput input, ClaimsPrincipal user, SpazioDb db, CancellationToken ct) => {
    var error=Validation.Check(input); if(error is not null) return Results.ValidationProblem(new Dictionary<string,string[]>{{"task",[error]}});
    var owner=user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    if(await db.Tasks.CountAsync(t=>t.OwnerId==owner,ct)>=200) return Results.Problem("The demo allows 200 tasks per account.",statusCode:409);
    var task=new WorkTask {OwnerId=owner,Title=input.Title.Trim(),Tag=input.Tag.Trim(),State=input.State,Due=Validation.Due(input.Due)};
    db.Tasks.Add(task);await db.SaveChangesAsync(ct);return Results.Created("/api/tasks/"+task.Id,task.ToDto());
});
tasks.MapPatch("/{id:guid}", async (Guid id, StateInput input, ClaimsPrincipal user, SpazioDb db, CancellationToken ct) => {
    if(!Validation.States.Contains(input.State))return Results.ValidationProblem(new Dictionary<string,string[]>{{"state",["Unknown state."]}});
    var owner=user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var task=await db.Tasks.SingleOrDefaultAsync(t=>t.Id==id&&t.OwnerId==owner,ct);
    if(task is null)return Results.NotFound();task.State=input.State;await db.SaveChangesAsync(ct);return Results.Ok(task.ToDto());
});
tasks.MapDelete("/{id:guid}", async (Guid id, ClaimsPrincipal user, SpazioDb db, CancellationToken ct) => {
    var owner=user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var count=await db.Tasks.Where(t=>t.Id==id&&t.OwnerId==owner).ExecuteDeleteAsync(ct);
    return count==0?Results.NotFound():Results.NoContent();
});
tasks.MapPost("/reset", async (ClaimsPrincipal user, SpazioDb db, CancellationToken ct) => {
    var owner=user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    await using var transaction=await db.Database.BeginTransactionAsync(ct);
    await db.Tasks.Where(t=>t.OwnerId==owner).ExecuteDeleteAsync(ct);
    var rows=new[] {new WorkTask{OwnerId=owner,Title="Disegnare la pagina profilo",Tag="Design",Sample=true},new WorkTask{OwnerId=owner,Title="Preparare i componenti Angular",Tag="Frontend",Sample=true},new WorkTask{OwnerId=owner,Title="Sviluppare la bacheca",Tag="Frontend",State="In corso",Sample=true},new WorkTask{OwnerId=owner,Title="Definire i colori del progetto",Tag="Design",State="Completate",Sample=true}};
    db.Tasks.AddRange(rows);await db.SaveChangesAsync(ct);await transaction.CommitAsync(ct);return Results.Ok(rows.Select(t=>t.ToDto()));
});
app.Run();

public sealed class DemoUser : IdentityUser {public DateTime CreatedAt {get;set;}=DateTime.UtcNow;}
public sealed class WorkTask {
 public Guid Id {get;set;}=Guid.NewGuid();public string OwnerId {get;set;}="";public string Title {get;set;}="";public string Tag {get;set;}="";public string State {get;set;}="Da fare";public DateOnly? Due {get;set;}public bool Sample {get;set;}public DateTime CreatedAt {get;set;}=DateTime.UtcNow;
 public object ToDto()=>new {id=Id,title=Title,tag=Tag,state=State,due=Due?.ToString("yyyy-MM-dd")??"",sample=Sample};
}
public sealed record TaskInput(string Title,string Tag,string State,string? Due);
public sealed record StateInput(string State);
public static class Validation {
 public static readonly string[] States=["Da fare","In corso","Completate"];
 public static DateOnly? Due(string? value)=>string.IsNullOrEmpty(value)?null:DateOnly.ParseExact(value,"yyyy-MM-dd");
 public static string? Check(TaskInput input){
  if(string.IsNullOrWhiteSpace(input.Title)||input.Title.Trim().Length>90)return "Title must contain 1–90 characters.";
  if(input.Tag is null||input.Tag.Length>30)return "Category must contain at most 30 characters.";
  if(!States.Contains(input.State))return "Unknown state.";
  if(!string.IsNullOrEmpty(input.Due)&&!DateOnly.TryParseExact(input.Due,"yyyy-MM-dd",out _))return "Invalid date.";
  return null;
 }
}
public sealed class SpazioDb(DbContextOptions<SpazioDb> options):IdentityDbContext<DemoUser>(options){
 public DbSet<WorkTask> Tasks=>Set<WorkTask>();
 protected override void OnModelCreating(ModelBuilder model){base.OnModelCreating(model);model.Entity<WorkTask>(entity=>{entity.HasIndex(t=>new{t.OwnerId,t.CreatedAt});entity.Property(t=>t.Title).HasMaxLength(90);entity.Property(t=>t.Tag).HasMaxLength(30);entity.Property(t=>t.State).HasMaxLength(20);entity.HasOne<DemoUser>().WithMany().HasForeignKey(t=>t.OwnerId).OnDelete(DeleteBehavior.Cascade);});}
}
public sealed class ExpiredDemoCleanup(IServiceScopeFactory scopes,ILogger<ExpiredDemoCleanup> logger):BackgroundService{
 protected override async Task ExecuteAsync(CancellationToken ct){using var timer=new PeriodicTimer(TimeSpan.FromHours(1));while(await timer.WaitForNextTickAsync(ct)){try{await using var scope=scopes.CreateAsyncScope();var db=scope.ServiceProvider.GetRequiredService<SpazioDb>();var cutoff=DateTime.UtcNow.AddDays(-1);await db.Users.Where(u=>u.CreatedAt<cutoff).ExecuteDeleteAsync(ct);}catch(Exception ex)when(!ct.IsCancellationRequested){logger.LogWarning(ex,"Demo cleanup failed; will retry.");}}}
}
public partial class Program {}
