# Pull Request Template

## Summary

Refatoração estrutural do backend (apps/api) para adoção do padrão Clean Architecture, utilizando use-cases como camada de orquestração de regras de negócio. A estrutura agora segue uma separação clara de responsabilidades entre domain, application, infrastructure e interfaces.

## Type

- [ ] feat
- [ ] fix
- [ ] docs
- [ ] style
- [x] refactor
- [ ] perf
- [ ] test
- [ ] build
- [ ] ci
- [ ] chore
- [ ] revert

## Changes

### Estrutura Adotada

```
apps/api/src/
├── domain/                    # Entidades e interfaces de repositories
│   └── repositories/
│       ├── task.repository.interface.ts
│       └── dashboard.repository.interface.ts
│
├── application/               # Use Cases - regras de negócio isoladas
│   ├── tasks/
│   │   ├── list-tasks.use-case.ts
│   │   ├── create-task.use-case.ts
│   │   ├── update-task.use-case.ts
│   │   ├── complete-task.use-case.ts
│   │   └── delete-task.use-case.ts
│   └── dashboard/
│       └── get-dashboard.use-case.ts
│
├── infrastructure/            # Implementações concretas dos repositories
│   └── database/
│       ├── sqlite/
│       │   ├── task.sqlite.repository.ts
│       │   └── dashboard.sqlite.repository.ts
│       └── supabase/
│           ├── task.supabase.repository.ts
│           └── dashboard.supabase.repository.ts
│
└── interfaces/               # Controllers HTTP
    ├── tasks/
    │   └── task.controller.ts
    ├── dashboard/
    │   └── dashboard.controller.ts
    └── auth/
        └── auth.controller.ts
```

### Principais Decisões Técnicas

1. **Domain Layer**: Contém apenas interfaces abstratas (ITaskRepository, IDashboardRepository) que definem os contratos de persistência

2. **Application Layer**: Use Cases isolam completamente as regras de negócio:
   - Validações de input
   - Transações de dados
   - Lançamentos de exceções (ValidationError, NotFoundError)

3. **Infrastructure Layer**: Implementações concretas dos repositories:
   - SQLite repositories
   - Supabase repositories
   - Factories para seleção de implementação

4. **Interfaces Layer**: Controllers HTTP que:
   - Recebem requests HTTP
   - Chamam os use cases apropriados
   - Formatam responses

### Alterações Realizadas

- Novas pastas: domain/, application/, infrastructure/, interfaces/
- Removida pasta: modules/ (legado)
- Atualizado app.ts para usar novos controllers
- Validação de funcionamento com API em execução local

## Test

### Local Development
```bash
# Install dependencies
bun install

# Run development
bun run dev

# Test health endpoint
curl http://localhost:3000/health

# Test tasks endpoint
curl http://localhost:3000/api/v1/tasks

# Test dashboard endpoint
curl http://localhost:3000/api/v1/dashboard
```

## Screenshots (if applicable)

N/A - Esta é uma refatoração estrutural, sem alterações visuais.
