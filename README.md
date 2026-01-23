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

## Arquitetura do Projeto

### Estrutura de Monorepo

```
bunstack-playground/
├── apps/
│   ├── api/                    # Backend API
│   │   └── src/
│   │       ├── modules/        # Módulos de negócio (tarefas, etc)
│   │       ├── infra/          # Camada de infraestrutura
│   │       │   └── database/   # Configuração e migrações de BD
│   │       ├── shared/         # Utilitários compartilhados
│   │       ├── app.ts          # Configuração da aplicação Elysia
│   │       ├── server.ts       # Inicialização do servidor
│   │       └── config.ts       # Variáveis de ambiente
│   │
│   └── web/                    # Frontend React
│       └── src/
│           ├── features/       # Funcionalidades (tasks, settings)
│           ├── screens/        # Páginas da aplicação
│           ├── shared/         # Componentes e utilitários compartilhados
│           ├── config/         # Configuração e constantes
│           ├── app/            # Setup da aplicação
│           └── main.tsx        # Ponto de entrada
│
└── packages/
    └── shared/                 # Código compartilhado entre apps
        └── src/
            ├── domain/         # Modelos de domínio
            ├── http/           # Schemas HTTP (Zod)
            └── config/         # Configurações compartilhadas
```

## Funcionalidades Implementadas

### Backend API

#### Gerenciamento de Tarefas (Tasks)

- **Listar Tarefas** com paginação
  - Query parameters: `page`, `pageSize`, `sortOrder` (ASC/DESC)
  - Resposta paginada com metadados
- **Criar Tarefa** com validação de schema
  - Título obrigatório
  - Descrição opcional
  - Status padrão: `pending`
- **Atualizar Tarefa**
  - Modificar título, descrição e status
  - Validação de dados
- **Deletar Tarefa**
  - Remoção segura com tratamento de erros
- **Obter Detalhes da Tarefa**
  - Busca por ID com validação

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
bun run dev:api    # Porta 3000
bun run dev:web    # Porta 5173
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

### Tarefas

| Método   | Endpoint     | Descrição                             |
| -------- | ------------ | ------------------------------------- |
| `GET`    | `/tasks`     | Listar todas as tarefas com paginação |
| `GET`    | `/tasks/:id` | Obter detalhes de uma tarefa          |
| `POST`   | `/tasks`     | Criar nova tarefa                     |
| `PUT`    | `/tasks/:id` | Atualizar tarefa                      |
| `DELETE` | `/tasks/:id` | Deletar tarefa                        |

### Utilitários

| Método | Endpoint      | Descrição               |
| ------ | ------------- | ----------------------- |
| `GET`  | `/health`     | Verificar saúde da API  |
| `GET`  | `/swagger-ui` | Documentação interativa |

## 🧪 Exemplo de Requisições

### Criar Tarefa

```bash
curl -X POST http://localhost:4000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Aprender Bun",
    "description": "Explorar recursos do Bun"
  }'
```

### Listar Tarefas

```bash
curl "http://localhost:4000/tasks?page=1&pageSize=10&sortOrder=DESC"
```

### Atualizar Tarefa

```bash
curl -X PUT http://localhost:4000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo título",
    "status": "completed"
  }'
```

## Estrutura de Pastas Explicada (ou não 😅)

### apps/api

- **modules/tasks**: Lógica de negócio para tarefas (rotas, serviço, repositório)
- **infra/database**: Migrações, seeds e configuração de BD
- **shared/errors**: Tratamento de erros centralizado
- **types**: Definições de tipos compartilhadas

### apps/web

- **features**: Funcionalidades isoladas (tasks, settings)
- **features/tasks**: Actions (mutations), queries, routes, UI components
- **screens**: Páginas da aplicação
- **shared/layouts**: Componentes de layout reutilizáveis
- **config**: Constantes e configurações globais

### packages/shared

- **domain**: Modelos de domínio de negócio
- **http**: Schemas de validação HTTP (Zod)
- **config**: Constantes compartilhadas

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
Frontend (React)
    ↓
React Query (cache/sync)
    ↓
API Client (HTTP)
    ↓
Elysia Routes
    ↓
Task Service (lógica)
    ↓
Task Repository (persistência)
    ↓
Database
```

## Próximos Passos ?

- [ ] Autenticação e autorização
- [ ] Websockets para atualizações em tempo real
- [ ] Testes automatizados (unit, integration, e2e)
- [ ] CI/CD com GitHub Actions
- [ ] Docker para containerização
- [ ] Documentação de API mais detalhada
- [ ] Filtros avançados nas tarefas
- [ ] Sistema de categorias/tags

## Licença

Este projeto é um playground de demonstração sem licença específica.

## Contribuições

Contributions são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ por [Ruan Valente](https://www.linkedin.com/in/ruan-valente/) usando Bun 💥**
