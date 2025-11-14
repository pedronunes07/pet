# Configuração da API Backend

Este documento contém instruções para configurar a API ASP.NET Core para funcionar com o frontend Angular.

## 🔧 Configuração de CORS

Para que o frontend Angular possa se comunicar com a API, é necessário configurar o CORS (Cross-Origin Resource Sharing) na API.

### Verificar Configuração de CORS na API

No arquivo `SistemaPet.WebAPI/Program.cs` (ou `Startup.cs` se estiver usando uma versão mais antiga), certifique-se de que o CORS está configurado da seguinte forma:

```csharp
// Adicione isso no Program.cs

var builder = WebApplication.CreateBuilder(args);

// ... outras configurações ...

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ... outras configurações ...

// Usar CORS
app.UseCors("AllowAngularApp");

// ... outras configurações ...

app.Run();
```

### Configuração Alternativa (Permitir Qualquer Origem - Apenas para Desenvolvimento)

⚠️ **Atenção**: Use apenas em desenvolvimento!

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

## 🚀 Como Executar a API

1. Navegue até a pasta do projeto da API:
```bash
cd SistemaPet.WebAPI
```

2. Restaure as dependências:
```bash
dotnet restore
```

3. Execute a API:
```bash
dotnet run
```

A API estará disponível em:
- **HTTP**: `http://localhost:5281`
- **HTTPS**: `https://localhost:7240`
- **Swagger**: `https://localhost:7240/swagger`

## ✅ Verificar se a API está Funcionando

1. Abra o navegador e acesse: `http://localhost:5281/swagger`
2. Você deve ver a interface do Swagger com todos os endpoints disponíveis
3. Teste um endpoint GET (por exemplo, `GET /api/pet`) para verificar se está retornando dados

## 🔍 Verificar Portas

Se a API estiver rodando em uma porta diferente de 5281, você precisa atualizar:

1. **No Frontend Angular**: Edite `src/environments/environment.ts` e altere a `apiUrl`
2. **No Proxy**: Edite `proxy.conf.json` e altere o `target` para a porta correta

## 🐛 Problemas Comuns

### Erro 404 ao acessar endpoints

- Verifique se a API está rodando
- Verifique se a rota está correta (deve começar com `/api/`)
- Verifique o console da API para ver se há erros

### Erro de CORS no navegador

- Certifique-se de que o CORS está configurado na API
- Verifique se a origem `http://localhost:4200` está permitida
- Reinicie a API após alterar a configuração de CORS

### API não inicia

- Verifique se o .NET 8.0 SDK está instalado: `dotnet --version`
- Verifique se todas as dependências estão instaladas: `dotnet restore`
- Verifique os logs de erro no console

## 📝 Estrutura Esperada da API

A API deve ter os seguintes controllers:

- `PetController` com endpoints:
  - `GET /api/pet`
  - `GET /api/pet/{id}`
  - `POST /api/pet`
  - `PUT /api/pet/{id}`
  - `DELETE /api/pet/{id}`

- `DonoController` com endpoints:
  - `GET /api/dono`
  - `GET /api/dono/{id}`
  - `POST /api/dono`
  - `PUT /api/dono/{id}`
  - `DELETE /api/dono/{id}`

## 🔗 Links Úteis

- [Repositório da API](https://github.com/pedronunes07/SistemaPet)
- [Documentação ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors)

