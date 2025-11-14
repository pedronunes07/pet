# 🚀 Guia Rápido de Inicialização

## Iniciar o Sistema Completo (Frontend + Backend)

### Opção 1: Iniciar Manualmente

#### Terminal 1 - Backend API
```bash
# Clone o repositório da API (se ainda não tiver)
git clone https://github.com/pedronunes07/SistemaPet.git
cd SistemaPet/SistemaPet.WebAPI

# Execute a API
dotnet run
```

#### Terminal 2 - Frontend Angular
```bash
# Navegue até a pasta do frontend
cd sistema-pet

# Instale as dependências (apenas na primeira vez)
npm install

# Execute o frontend
npm start
```

### Opção 2: Usar Scripts (Windows PowerShell)

Crie um arquivo `iniciar-tudo.ps1`:

```powershell
# Iniciar API
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd SistemaPet\SistemaPet.WebAPI; dotnet run"

# Aguardar alguns segundos para a API iniciar
Start-Sleep -Seconds 5

# Iniciar Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd sistema-pet; npm start"
```

Execute:
```powershell
.\iniciar-tudo.ps1
```

## ✅ Verificar se Está Funcionando

1. **API**: Acesse `http://localhost:5281/swagger` - deve mostrar a interface do Swagger
2. **Frontend**: Acesse `http://localhost:4200` - deve mostrar o dashboard do sistema

## 🔍 Checklist de Verificação

- [ ] API está rodando na porta 5281
- [ ] Frontend está rodando na porta 4200
- [ ] CORS está configurado na API (veja `API_SETUP.md`)
- [ ] Não há erros no console do navegador
- [ ] Não há erros no console da API

## 🐛 Se Algo Não Funcionar

1. Verifique se ambas as aplicações estão rodando
2. Verifique o console do navegador (F12) para erros
3. Verifique o console da API para erros
4. Consulte `README.md` para instruções detalhadas
5. Consulte `API_SETUP.md` para configuração da API

