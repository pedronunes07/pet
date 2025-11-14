# Sistema Pet - Frontend Angular

Sistema de gerenciamento de pets desenvolvido em Angular que se conecta à API ASP.NET Core.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- .NET 8.0 SDK (para a API backend)
- Git (para clonar o repositório da API)

## 🚀 Como Executar o Projeto Completo

Este projeto consiste em duas partes:
1. **Frontend Angular** (este projeto)
2. **Backend ASP.NET Core API** (repositório separado)

### Passo 1: Clonar e Configurar a API Backend

1. Clone o repositório da API:
```bash
git clone https://github.com/pedronunes07/SistemaPet.git
cd SistemaPet
```

2. Navegue até a pasta da WebAPI:
```bash
cd SistemaPet.WebAPI
```

3. Restaure as dependências e execute a API:
```bash
dotnet restore
dotnet run
```

A API estará disponível em:
- **HTTP**: `http://localhost:5281`
- **HTTPS**: `https://localhost:7240`
- **Swagger UI**: `https://localhost:7240/swagger`

⚠️ **Importante**: Mantenha a API rodando enquanto usar o frontend.

### Passo 2: Configurar e Executar o Frontend Angular

1. Navegue até a pasta do projeto Angular:
```bash
cd sistema-pet
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm start
# ou
ng serve
```

4. Abra seu navegador e acesse:
```
http://localhost:4200
```

## 🔧 Configuração

### URL da API

A URL da API está configurada em `src/environments/environment.ts`. Por padrão, está configurada para:
```typescript
apiUrl: 'http://localhost:5281/api'
```

Se você precisar alterar a URL da API, edite o arquivo `src/environments/environment.ts`.

### Proxy de Desenvolvimento

O projeto inclui um arquivo `proxy.conf.json` que pode ser usado para redirecionar requisições `/api` para o backend durante o desenvolvimento. Isso ajuda a evitar problemas de CORS.

O proxy já está configurado no `angular.json` e será usado automaticamente quando você executar `ng serve`.

## 📡 Endpoints da API

O frontend se conecta aos seguintes endpoints:

### Pets
- `GET /api/pet` - Lista todos os pets
- `GET /api/pet/{id}` - Busca pet por ID
- `POST /api/pet` - Cria novo pet
- `PUT /api/pet/{id}` - Atualiza pet
- `DELETE /api/pet/{id}` - Exclui pet

### Donos
- `GET /api/dono` - Lista todos os donos
- `GET /api/dono/{id}` - Busca dono por ID
- `POST /api/dono` - Cria novo dono
- `PUT /api/dono/{id}` - Atualiza dono
- `DELETE /api/dono/{id}` - Exclui dono e seus pets

## 🛠️ Tecnologias Utilizadas

- **Angular 20.3**
- **TypeScript**
- **RxJS**
- **Angular Signals** (para gerenciamento de estado reativo)

## 📁 Estrutura do Projeto

```
sistema-pet/
├── src/
│   ├── app/
│   │   ├── model/          # Modelos de dados (Pet, Dono)
│   │   ├── service/         # Serviços de comunicação com API
│   │   ├── pet/            # Componentes relacionados a pets
│   │   │   ├── dashboard/  # Dashboard principal
│   │   │   ├── pet-form/   # Formulário de cadastro/edição de pets
│   │   │   ├── pet-list/   # Lista de pets
│   │   │   └── dono-form/  # Formulário de cadastro/edição de donos
│   │   └── app.routes.ts   # Configuração de rotas
│   ├── environments/       # Configurações de ambiente
│   └── main.ts            # Ponto de entrada da aplicação
├── proxy.conf.json        # Configuração de proxy para desenvolvimento
└── angular.json           # Configuração do Angular CLI
```

## 🐛 Solução de Problemas

### Erro de CORS

Se você encontrar erros de CORS, certifique-se de que:

1. A API está rodando na porta 5281
2. O CORS está configurado na API para aceitar requisições de `http://localhost:4200`
3. O proxy está configurado corretamente (já está no `angular.json`)

### API não encontrada

Se o frontend não conseguir se conectar à API:

1. Verifique se a API está rodando: acesse `http://localhost:5281/swagger` no navegador
2. Verifique a URL configurada em `src/environments/environment.ts`
3. Verifique o console do navegador para ver erros específicos

### Erro ao instalar dependências

Se encontrar problemas ao instalar as dependências:

```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstale as dependências
npm install
```

## 📝 Scripts Disponíveis

- `npm start` ou `ng serve` - Inicia o servidor de desenvolvimento
- `npm run build` ou `ng build` - Compila o projeto para produção
- `npm test` ou `ng test` - Executa os testes unitários

## 🔗 Links Úteis

- [Repositório da API](https://github.com/pedronunes07/SistemaPet)
- [Documentação Angular](https://angular.dev)
- [Swagger da API](https://localhost:7240/swagger) (quando a API estiver rodando)

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.
