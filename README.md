# Bunstack Playground

Uma aplicação full-stack moderna construída com **Bun**, **Elysia**, **React** e **TypeScript**, focada em gerenciamento de tarefas para o aprendizado usando arquitetura monorepo bem estruturada.

## Visão Geral do Projeto

Este é um playground/template para explorar e demonstrar as melhores práticas de desenvolvimento full-stack utilizando o ecossistema Bun. O projeto implementa um sistema de gerenciamento de tarefas com uma API robusta e uma interface web moderna.

### Tecnologias Principais

- **Runtime**: [Bun](https://bun.com) - Runtime JavaScript/TypeScript rápido e moderno
- **API Backend**: [Elysia](https://elysiajs.com) - Framework web rápido e type-safe
- **Frontend**: [React 19](https://react.dev) + [React Router 7](https://reactrouter.com)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **State Management**: [TanStack React Query](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev) - Schema validation library
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Auth**: [Supabase Auth](https://supabase.com) - Autenticação com email/password e OAuth
- **Database**: SQLite (dev) + Supabase (prod)
- **Deploy**: [Railway](https://railway.app) - Plataforma de deployment

## Arquitetura do Projeto

### Estrutura de Monorepo

```
bunstack-playground/
├── apps/
│   ├── api/                         # Backend API
│   │   └── src/
│   │       ├── domain/              # Entidades e interfaces de repositório
│   │       │   ├── repositories/   # Interfaces (task.repository.interface.ts)
│   │       │   └── erros/          # Erros customizados
│   │       ├── application/         # Use Cases
│   │       │   ├── tasks/          # list-tasks, create-task, update-task, delete-task, complete-task
│   │       │   └── dashboard/      # get-dashboard
│   │       ├── interfaces/          # Controllers (Routes)
│   │       │   ├── tasks/          # Task controller
│   │       │   ├── dashboard/      # Dashboard controller
│   │       │   └── auth/           # Auth controller
│   │       ├── infrastructure/    # Implementações concretas
│   │       │   ├── database/       # Migrações e seeds
│   │       │   ├── repositories/   # Implementações (SQLite, Supabase)
│   │       │   └── supabase/       # Cliente Supabase
│   │       ├── app.ts              # Configuração principal Elysia
│   │       ├── server.ts           # Entry point
│   │       └── config.ts           # Variáveis de ambiente
│   │
│   └── web/                         # Frontend React
│       └── src/
│           ├── features/            # Funcionalidades isoladas
│           │   ├── tasks/           # CRUD de tarefas
│           │   ├── dashboard/      # Métricas e gráficos
│           │   ├── auth/           # Login, register, callback
│           │   ├── settings/       # Configurações usuário
│           │   └── users/          # Gerenciamento de usuários
│           ├── screens/             # Páginas (tasks, dashboard, settings, users)
│           ├── shared/              # Componentes compartilhados
│           │   ├── ui/              # Componentes UI (sidebar, datatable, filter)
│           │   ├── hooks/           # Hooks customizados
│           │   ├── http/            # Cliente HTTP
│           │   ├── layouts/         # Layouts
│           │   └── config/          # Configurações
│           ├── app/                 # Setup router
│           └── main.tsx             # Entry point
│
└── packages/
    └── shared/                      # Código compartilhado
        └── src/
            ├── domain/              # Modelos de domínio
            ├── http/                # Schemas HTTP (Zod)
            └── config/              # Configurações compartilhadas
```

### Arquitetura Clean Architecture (API)

```
src/
├── domain/           # Entidades e regras de negócio
│   ├── repositories/ # Interfaces de repositório
│   └── erros/       # Erros domain-specific
├── application/     # Casos de uso (Use Cases)
│   ├── tasks/       # CreateTaskUseCase, ListTasksUseCase, etc.
│   └── dashboard/   # GetDashboardUseCase
├── interfaces/     # Controllers/Routes
│   ├── tasks/      # Task endpoints
│   ├── dashboard/  # Dashboard endpoints
│   └── auth/       # Auth endpoints
└── infrastructure/ # Implementações externas
    ├── database/   # Migrations e seeds
    ├── repositories/ # SQLite e Supabase implementations
    └── supabase/  # Cliente Supabase
```

### Arquitetura Feature-Based (Web)

```
src/
├── features/        # Funcionalidades isoladas por domínio
│   └── tasks/
│       ├── queries/   # React Query hooks
│       ├── actions/   # Mutações
│       ├── routes/    # Rotas específicas
│       ├── widgets/   # Componentes de feature
│       ├── hooks/     # Hooks específicos
│       └── loaders/  # React Router loaders
├── screens/         # Páginas completas
├── shared/          # Código reutilizável
│   ├── ui/         # Componentes genéricos
│   ├── hooks/      # Hooks genéricos
│   └── layouts/   # Layouts
└── app/           # Configuração router
```

## Funcionalidades Implementadas

### Backend API

#### Gerenciamento de Tarefas (Tasks)

- **Listar Tarefas** com paginação e filtros
  - Query parameters: `page`, `pageSize`, `sortOrder` (ASC/DESC), `sortBy`, `statusFilter`
  - Resposta paginada com metadados
- **Criar Tarefa** com validação de schema
  - Título obrigatório (mínimo 3 caracteres)
  - Status padrão: `pending`
- **Atualizar Tarefa**
  - Modificar título
  - Validação de dados
- **Completar Tarefa**
  - Marcar como concluída via PATCH
- **Deletar Tarefa**
  - Remoção segura com tratamento de erros

#### Dashboard

- **Métricas** - Total de tarefas, tarefas concluídas, pendentes
- **Progresso** - Percentage de conclusão
- **Gráficos** - Dados para visualização

#### Autenticação (Supabase Auth)

- **Registro** com email/password
- **Login** com email/password
- **Logout**
- **OAuth** com GitHub
- **JWT** - Bearer token authentication
- **Current User** - Endpoint para obter usuário logado

#### Infraestrutura

- **Migrações de Banco de Dados**
  - Sistema de migrações estruturado
  - Criação automática da tabela `tasks`
- **Seeds de Dados**
  - Dados de teste para desenvolvimento
  - População automática de tarefas de exemplo
- **CORS Configurado**
  - Permitir requisições do frontend
- **Documentação OpenAPI/Swagger**
  - Documentação interativa em `/swagger-ui`
- **Dual Database**
  - SQLite para desenvolvimento local
  - Supabase para produção

#### Health Check

- Endpoint `/health` para monitoramento

### Frontend Web

#### Funcionalidades de Tarefas

- **Listagem de Tarefas**
  - Exibição com paginação
  - Ordenação customizável
  - Interface responsiva
- **Criação de Tarefas**
  - Formulário intuitivo
  - Validação em tempo real
  - Feedback visual
- **Edição de Tarefas**
  - Modal de edição
  - Atualização de status, título e descrição
- **Exclusão de Tarefas**
  - Confirmação de ação
  - Remoção segura

#### Layout e Navegação

- **Layout Principal**
  - Sidebar com navegação
  - Estrutura responsiva
- **Roteamento**
  - Página de Tarefas (`/tasks`)
  - Página de Configurações (`/settings`)
  - Navegação aninhada com React Router 7

#### Estado e Sincronização

- **React Query Integration**
  - Cache automático de dados
  - Sincronização com servidor
  - Refetch automático
- **Actions e Queries**
  - Separação clara de responsabilidades
  - Type-safe API calls

### Código Compartilhado

#### Domain Models

- Modelos de Task (`Task`, `CreateTaskInput`, `UpdateTaskInput`)
- Tipos de resposta HTTP
- Schemas Zod para validação

#### HTTP Schemas

- `taskSchema` - Definição de tarefa
- `createTaskSchema` - Input para criar tarefa
- `paginatedTasksResponseSchema` - Resposta paginada
- `paginationQuerySchema` - Parâmetros de paginação

#### Configuração Centralizada

- `API_PORT` - Porta do servidor API
- `API_BASE_URL` - URL base para requisições

## Como Executar

### Pré-requisitos

- [Bun](https://bun.com) instalado (v1.3.6+)
- Node.js (opcional, para compatibilidade)

### Instalação

```bash
# Instalar dependências
bun install
```

### Desenvolvimento

```bash
# Executar API e Web simultaneamente
bun run dev

# Ou executar separadamente:
bun run dev:api    # Porta 4000
bun run dev:web    # Porta 5173
```

### Docker

```bash
# Desenvolvimento (com hot-reload)
./rebuild-dev.sh
# Acessos:
# API:   http://localhost:4000
# Web:   http://localhost:5173

# Produção
./rebuild.sh
# Acessos:
# API + Web: http://localhost:4000
```

### Build

```bash
# Build da aplicação web
cd apps/web
bun run build
```

### Testes

```bash
# Executar testes
bun test
```

## API Endpoints

### Tarefas (v1)

| Método   | Endpoint                     | Descrição                              |
| -------- | ---------------------------- | -------------------------------------- |
| `GET`    | `/api/v1/tasks`              | Listar tarefas com paginação e filtros |
| `POST`   | `/api/v1/tasks`              | Criar nova tarefa                      |
| `PUT`    | `/api/v1/tasks/:id`          | Atualizar título da tarefa             |
| `PATCH`  | `/api/v1/tasks/:id/complete` | Marcar tarefa como completa            |
| `DELETE` | `/api/v1/tasks/:id`          | Deletar tarefa                         |

**Query Parameters (GET /tasks):**

- `page` - Número da página (padrão: 1)
- `pageSize` - Tamanho da página (padrão: 10, máx: 100)
- `sortOrder` - Ordenação (ASC | DESC)
- `sortBy` - Campo para ordenação (created_at | updated_at)
- `statusFilter` - Filtrar por status (completed | pending)

### Dashboard (v1)

| Método | Endpoint            | Descrição                     |
| ------ | ------------------- | ----------------------------- |
| `GET`  | `/api/v1/dashboard` | Obter métricas e estatísticas |

### Autenticação (v1)

| Método | Endpoint                | Descrição                |
| ------ | ----------------------- | ------------------------ |
| `POST` | `/api/v1/auth/register` | Registrar novo usuário   |
| `POST` | `/api/v1/auth/login`    | Login com email/password |
| `POST` | `/api/v1/auth/logout`   | Logout do usuário        |
| `GET`  | `/api/v1/auth/user`     | Obter usuário atual      |
| `GET`  | `/api/v1/auth/github`   | Login via OAuth GitHub   |

### Utilitários

| Método | Endpoint      | Descrição               |
| ------ | ------------- | ----------------------- |
| `GET`  | `/health`     | Verificar saúde da API  |
| `GET`  | `/swagger-ui` | Documentação interativa |
| `GET`  | `/*`          | SPA fallback (produção) |

## 🧪 Exemplo de Requisições

### Criar Tarefa

```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Aprender Bun"
  }'
```

### Listar Tarefas com Filtros

```bash
curl "http://localhost:4000/api/v1/tasks?page=1&pageSize=10&sortOrder=DESC&statusFilter=pending"
```

### Atualizar Tarefa

```bash
curl -X PUT http://localhost:4000/api/v1/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo título"
  }'
```

### Completar Tarefa

```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/{id}/complete \
  -H "Content-Type: application/json" \
  -d '{
    "id": "{id}",
    "completed": true
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Estrutura de Pastas Explicada

### apps/api (Clean Architecture)

- **domain/**: Entidades e interfaces de repositório (Task, erros customizados)
- **application/**: Use cases (list-tasks, create-task, update-task, delete-task, complete-task, get-dashboard)
- **interfaces/**: Controllers/Routes (tasks, dashboard, auth)
- **infrastructure/**: Implementações concretas (repositories SQLite/Supabase, database, supabase client)
- **app.ts**: Configuração principal Elysia com CORS e static files
- **server.ts**: Entry point

### apps/web (Feature-Based)

- **features/**: Funcionalidades isoladas (tasks, dashboard, auth, settings, users)
  - **tasks**: Queries, actions, routes, widgets, hooks, loaders
  - **auth**: Login, register, OAuth callback, protected routes
  - **dashboard**: KPIs, gráficos
  - **settings**: Preferências usuário
- **screens/**: Páginas completas (tasks, dashboard, settings, users)
- **shared/**: Componentes reutilizáveis
  - **ui/**: Componentes (sidebar, datatable, filter, pagination, skeleton)
  - **hooks/**: Hooks customizados
  - **http/**: Cliente HTTP
  - **layouts/**: Layouts principais

### packages/shared

- **domain/**: Modelos de domínio de negócio
- **http/**: Schemas de validação HTTP (Zod)
- **config/**: Constantes compartilhadas

## Pontos-Chave da Arquitetura

1. **Type Safety**: Utilização extensiva de TypeScript em toda a stack
2. **Validação de Schema**: Zod para validação de dados na API e no cliente
3. **Separação de Responsabilidades**: Módulos, services, repositories bem definidos
4. **Código Compartilhado**: Package monorepo para evitar duplicação
5. **Configuração Centralizada**: Variáveis de ambiente e constantes em lugar único
6. **Componentes Reutilizáveis**: Layout, hooks e utilitários compartilhados
7. **State Management Moderno**: React Query para sincronização de dados
8. **Roteamento Estruturado**: React Router v7 com nested routes

## Fluxo de Dados

```
Frontend (React + React Query)
         ↓
    HTTP Client
         ↓
┌─────────────────────────────────────────┐
│  Elysia Routes (Interfaces/Controllers) │
│    → Task Controller                     │
│    → Auth Controller                      │
│    → Dashboard Controller                │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Use Cases (Application Layer)          │
│    → CreateTaskUseCase                  │
│    → ListTasksUseCase                   │
│    → UpdateTaskUseCase                  │
│    → DeleteTaskUseCase                  │
│    → CompleteTaskUseCase                │
│    → GetDashboardUseCase                │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Repository Interface (Domain Layer)    │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Repository Implementation              │
│    → SQLite (dev)                       │
│    → Supabase (prod)                    │
└─────────────────────────────────────────┘
         ↓
    Database
```

## Roadmap de Funcionalidades

### ✅ Implementados

- [x] **Autenticação e autorização** - Supabase Auth (email/password + GitHub OAuth)
- [x] **CI/CD com GitHub Actions** - Workflow para lint e deploy automático para Railway
- [x] **Docker para containerização** - Dockerfile e Dockerfile.dev com scripts rebuild
- [x] **Documentação de API** - OpenAPI/Swagger em `/swagger-ui`
- [x] **Filtros avançados nas tarefas** - statusFilter, sortBy, sortOrder
- [x] **Dashboard com métricas** - Total tarefas, concluídas, pendentes, progresso

### ⏳ Pendentes / Futuro

- [ ] **Websockets** - Atualizações em tempo real
- [ ] **Testes automatizados** - Unit, integration e e2e
- [ ] **Sistema de categorias/tags** - Organizar tarefas por categorias
- [ ] **Notifications** - Notificações em tempo real
- [ ] **Upload de arquivos** - Anexar arquivos às tarefas
- [ ] **Task comments** - Comentários em tarefas
- [ ] **Team collaboration** - Múltiplos usuários por tarefa

## Licença

Este projeto é um playground de demonstração sem licença específica.

## Contribuições

Contributions são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ por [Ruan Valente](https://www.linkedin.com/in/ruan-valente/) usando Bun 💥**
