# 🔧 Guia de Troubleshooting

## Erro ao Salvar Dono

Se você está recebendo o erro "Erro ao salvar dono", siga estes passos para diagnosticar:

### 1. Verificar se a API está rodando

1. Abra o navegador e acesse: `http://localhost:5281/swagger`
2. Se a página não carregar, a API não está rodando
3. **Solução**: Execute a API:
   ```bash
   cd SistemaPet/SistemaPet.WebAPI
   dotnet run
   ```

### 2. Verificar o Console do Navegador

1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Procure por mensagens de erro que começam com:
   - `❌ ERRO AO ADICIONAR DONO`
   - `Erro completo no componente:`
4. Anote o **Status HTTP** e a **Resposta do servidor**

### 3. Erros Comuns e Soluções

#### Erro de Conexão (Status 0 ou undefined)
**Sintoma**: Mensagem "Não foi possível conectar à API"

**Causas possíveis**:
- API não está rodando
- API está rodando em porta diferente
- Problema de CORS

**Soluções**:
1. Verifique se a API está rodando na porta 5281
2. Verifique a URL em `src/environments/environment.ts`
3. Verifique a configuração de CORS na API (veja `API_SETUP.md`)

#### Erro 400 Bad Request (Validação)
**Sintoma**: Mensagem com "Erros de validação"

**Causas possíveis**:
- Campos obrigatórios não preenchidos
- Formato de dados inválido
- Validação do backend não passou

**Soluções**:
1. Verifique se todos os campos obrigatórios estão preenchidos:
   - Nome Completo
   - Email (formato válido)
   - Telefone
2. Verifique o console para ver quais campos estão com erro
3. Verifique se o email está em formato válido (ex: `usuario@email.com`)

#### Erro 500 Internal Server Error
**Sintoma**: Erro genérico do servidor

**Causas possíveis**:
- Erro no código da API
- Problema com o banco de dados
- Dados inválidos que causam exceção

**Soluções**:
1. Verifique o console da API para ver o erro completo
2. Verifique os logs da aplicação
3. Tente com dados diferentes

#### Erro 404 Not Found
**Sintoma**: Endpoint não encontrado

**Causas possíveis**:
- URL da API incorreta
- Rota não existe na API

**Soluções**:
1. Verifique se a URL está correta em `src/environments/environment.ts`
2. Verifique se o endpoint `/api/dono` existe na API
3. Teste o endpoint no Swagger: `http://localhost:5281/swagger`

### 4. Verificar Dados Enviados

No console do navegador, procure por:
```
=== ENVIANDO DONO PARA API ===
URL: ...
Dados: ...
```

Isso mostra exatamente o que está sendo enviado para a API.

### 5. Testar Diretamente na API

1. Acesse o Swagger: `http://localhost:5281/swagger`
2. Encontre o endpoint `POST /api/dono`
3. Clique em "Try it out"
4. Preencha os dados:
   ```json
   {
     "nomeCompleto": "Teste",
     "email": "teste@email.com",
     "telefone": "123456789",
     "cidade": "São Paulo"
   }
   ```
5. Clique em "Execute"
6. Veja a resposta

Se funcionar no Swagger mas não no Angular:
- Problema de CORS
- Problema com o formato dos dados enviados

### 6. Verificar CORS

Se você ver erros de CORS no console, verifique:

1. A API tem CORS configurado? (veja `API_SETUP.md`)
2. A origem `http://localhost:4200` está permitida?
3. O proxy está configurado? (já está no `angular.json`)

### 7. Limpar e Reinstalar

Se nada funcionar:

```bash
# No frontend
cd sistema-pet
rm -rf node_modules package-lock.json
npm install
npm start

# Na API
cd SistemaPet/SistemaPet.WebAPI
dotnet clean
dotnet restore
dotnet run
```

## Checklist de Diagnóstico

- [ ] API está rodando e acessível em `http://localhost:5281/swagger`
- [ ] Frontend está rodando em `http://localhost:4200`
- [ ] CORS está configurado na API
- [ ] Console do navegador não mostra erros de CORS
- [ ] Campos obrigatórios estão preenchidos
- [ ] Email está em formato válido
- [ ] Console mostra os dados sendo enviados
- [ ] Teste no Swagger funciona

## Obter Ajuda

Se o problema persistir:

1. Anote todas as mensagens de erro do console
2. Anote o Status HTTP
3. Anote a resposta completa do servidor (do console)
4. Verifique se a API está retornando algum erro específico

Com essas informações, será mais fácil identificar o problema.

