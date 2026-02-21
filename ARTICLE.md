# Construindo uma Arquitetura de Monorepo Full-Stack com Bun, Elysia e React

## Introdução

Quando começamos a trabalhar em projetos full-stack, uma das primeiras decisões arquiteturais é como organizar o código. Este artigo explora os desafios e soluções de implementar um **monorepo full-stack moderno** usando Bun, Elysia, React e TypeScript, utilizando o projeto [bunstack-playground](https://github.com/ruanvalente/bunstack-playground) como base.

## Por que um Monorepo?

### Vantagens

1. **Compartilhamento de Código**: Reutilizar tipos, schemas e configurações entre frontend e backend sem publicar pacotes
2. **Sincronização Automática**: Alterações no schema ou tipos são refletidas simultaneamente em ambas as aplicações
3. **Dependências Centralizadas**: Um único `package.json` gerencia todas as dependências
4. **Desenvolvimento Simplificado**: Executar toda a stack com um único comando
5. **Refatorações Facilitadas**: Ferramentas como TypeScript cross-package ajudam a refatorar globalmente

### Desafios

1. **Complexidade de Build**: Necessário orquestrar múltiplas builds
2. **Gerenciamento de Dependências**: Versions conflitantes podem aparecer
3. **Performance**: Monorepos crescem rapidamente em tamanho
4. **Isolamento**: Mudanças acidentais podem impactar múltiplos apps

## Estrutura do Projeto

```
bunstack-playground/
├── apps/
│   ├── api/              # Backend Elysia
│   └── web/              # Frontend React
├── packages/
│   └── shared/           # Código compartilhado
├── turbo.json            # Configuração do build orchestration
├── tsconfig.base.json    # TypeScript base shared
└── package.json          # Root package
```

## 1. Camada Compartilhada (`packages/shared`)

### Problema

Como manter tipos sincronizados entre API e Frontend sem duplicação?

### Solução

Criar um package `shared` que exporta:

```typescript
// packages/shared/src/domain/task.domain.ts
export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

// packages/shared/src/http/task.schema.ts
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  completed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type TaskDTO = z.infer<typeof taskSchema>;
```

**Benefícios**:
- Single source of truth para tipos
- Validação com Zod funciona em ambos os ambientes
- Type inference automática (`z.infer`)

```typescript
// apps/api/src/modules/tasks/task.routes.ts
import { taskSchema } from '@bunstack-playground/shared/http';

// apps/web/src/features/tasks/queries/task.querie.ts
import type { Task } from '@bunstack-playground/shared/domain';
```

## 2. Build Orchestration com Turbo

### Problema

Como executar múltiplas builds de forma eficiente?

### Solução

Usar Turbo para orquestrar builds:

```json
// turbo.json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "outputs": ["dist/**", "build/**"],
      "cache": true
    },
    "lint": {
      "outputs": [".eslintcache"]
    }
  }
}
```

**Vantagens**:
- Executa tasks em paralelo quando possível
- Caching inteligente de builds
- Respeta dependências entre packages

## 3. Padrão de Repositório Multi-Database

### Problema

Como suportar múltiplos bancos de dados (SQLite para dev, Supabase para prod)?

### Solução

Implementar **Repository Pattern** com Factory:

```typescript
// apps/api/src/modules/tasks/task.repository.ts
export abstract class TaskRepositoryImpl {
  abstract findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain>;
  abstract create(title: string): Promise<Task>;
  abstract updateTitle(id: string, title: string): Promise<Task | null>;
  // ... outros métodos
}

// apps/api/src/modules/tasks/task.sqlite.repository.ts
export class TaskSqliteRepository implements TaskRepositoryImpl {
  async findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain> {
    // Implementação SQLite
  }
}

// apps/api/src/modules/tasks/task.supabase.repository.ts
export class TaskSupabaseRepository implements TaskRepositoryImpl {
  async findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain> {
    // Implementação Supabase
  }
}

// apps/api/src/modules/tasks/task.repository.factory.ts
export function getTaskRepository() {
  const isSupabaseConfigured = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
  
  const useSupabase = isSupabaseConfigured || config.isProduction();

  if (useSupabase) {
    return new TaskSupabaseRepository();
  }

  return new TaskSqliteRepository();
}
```

**Benefícios**:
- Mesmo código funciona com diferentes databases
- Fácil de testar (mock repositories)
- Migração entre databases sem quebrar API

## 4. Sincronização de Estado com React Query

### Problema

Como manter frontend sincronizado com dados do backend em tempo real?

### Solução

Usar React Query com query keys bem estruturados:

```typescript
// apps/web/src/features/tasks/queries/task.querie.ts
export async function getTasks(
  page = 1,
  pageSize = 10,
  filters?: TaskFilters
): Promise<PaginatedTasksResponseDTO> {
  return httpClient<PaginatedTasksResponseDTO>(
    `${API_URL}/api/${API_VERSION}/tasks`,
    {
      method: 'GET',
      body: JSON.stringify({ page, pageSize, ...filters }),
    }
  );
}

// apps/web/src/features/tasks/hooks/use-create-task.ts
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createTask(title),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

**Padrão**: Query keys estruturados

```typescript
// ✅ Bom
queryKey: ['tasks', page, pageSize, filters]
queryKey: ['dashboard', days]
queryKey: ['task', taskId]

// ❌ Ruim
queryKey: ['data']
queryKey: ['myQuery']
```

## 5. Tratamento de Erros Centralizado

### Problema

Como padronizar tratamento de erros entre API e Frontend?

### Solução

Criar classe base de erro:

```typescript
// apps/api/src/shared/errors.ts
export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation Error') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
```

Usar nas rotas:

```typescript
// apps/api/src/modules/tasks/task.routes.ts
.patch(
  '/:id/complete',
  async ({ body, params, set }) => {
    try {
      const task = await taskService.complete(params.id, body.completed);
      return task;
    } catch (error) {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { message: error.message };
      }
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return { message: 'Internal server error' };
    }
  }
)
```

## 6. Migrações e Seeds de Banco de Dados

### Problema

Como gerenciar alterações de schema de forma estruturada?

### Solução

Implementar sistema de migrações:

```typescript
// apps/api/src/infra/database/migrations.ts
export function runMigrations() {
  createTasksTableMigration();
  addUpdatedAtToTasksMigration();
}

// apps/api/src/infra/database/migrations/tasks/create_tasks_table.migration.ts
export function createTasksTableMigration() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

// apps/api/src/infra/database/seeds/task.seed.ts
export async function seedTasks(): Promise<void> {
  const count = db.prepare(`SELECT COUNT(*) as total FROM tasks`).get();
  
  if (count.total > 0) {
    console.log('🟡 Seed ignorado (dados já existem)');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO tasks (id, title, completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(crypto.randomUUID(), 'Estudar Bun', 0, now, now);
  
  console.log('🟢 Seed executado com sucesso');
}
```

**Padrão Idempotente**: Migrações podem ser executadas múltiplas vezes
```typescript
CREATE TABLE IF NOT EXISTS tasks (...)
```

## 7. Configuração por Ambiente

### Problema

Como gerenciar diferentes configurações entre desenvolvimento, staging e produção?

### Solução

Centralizar configurações:

```typescript
// apps/api/src/config.ts
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const config = {
  environment: (process.env.NODE_ENV || 'development') as Environment,

  isDevelopment(): boolean {
    return this.environment === Environment.DEVELOPMENT;
  },

  isProduction(): boolean {
    return this.environment === Environment.PRODUCTION;
  },

  shouldRunSeeds(): boolean {
    if (process.env.RAILWAY_STATIC_URL) return false;
    return this.isDevelopment();
  },

  shouldRunMigrations(): boolean {
    if (process.env.RAILWAY_STATIC_URL) return false;
    return this.isDevelopment();
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// apps/api/src/server.ts
async function start() {
  if (config.shouldRunSeeds()) {
    runSeeds();
  }
  
  if (config.shouldRunMigrations()) {
    runMigrations();
  }

  Bun.serve({
    port: PORT,
    fetch: app.handle,
  });
}
```

**Uso em CORS**:

```typescript
// apps/api/src/app.ts
app.use(
  cors({
    origin: config.isProduction()
      ? 'https://bunstack-production.up.railway.app'
      : true,
    credentials: true,
  })
);
```

## 8. Type Safety Cross-Package

### Problema

Como garantir type safety entre diferentes packages sem perder type inference?

### Solução

Aproveitar `tsconfig` base compartilhada:

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@bunstack-playground/shared": ["packages/shared/src"],
      "@bunstack-playground/shared/*": ["packages/shared/src/*"]
    }
  }
}

// apps/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/api/*": ["./src/*"],
      "@bunstack-playground/shared": ["../../packages/shared/src"]
    }
  }
}

// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/web/*": ["./src/*"],
      "@bunstack-playground/shared": ["../../packages/shared/src"]
    }
  }
}
```

## 9. Padrão de Features Isoladas (Frontend)

### Problema

Como organizar código frontend de forma escalável?

### Solução

Estrutura de features:

```
apps/web/src/features/tasks/
├── ui/
│   ├── task-item.tsx
│   ├── create-task-modal.tsx
│   └── task-form.tsx
├── widgets/
│   ├── task-list-widget.tsx
│   └── create-task-widget.tsx
├── hooks/
│   ├── use-create-task.ts
│   └── use-toggle-task.ts
├── queries/
│   └── task.querie.ts
├── loaders/
│   └── tasksLoader.ts
├── routes/
│   └── routes.tsx
└── store/
    └── (optional) task.store.ts
```

**Benefícios**:
- Features são auto-contidas
- Fácil de deletar/mover sem quebrar imports
- Reutilização clara de dependências

## 10. Dashboard em Tempo Real

### Problema

Como agregar dados de múltiplas fontes e exibir em dashboard?

### Solução

Service specializado com múltiplas queries:

```typescript
// apps/api/src/modules/dashboard/dashboard.supabase.repository.ts
export class DashboardSupabaseRepository implements DashboardRepository {
  async getDashboardData(days: number = 30): Promise<DashboardData> {
    const currentStats = await this.getCurrentPeriodStats(days);
    const previousStats = await this.getPreviousPeriodStats(days);
    const tasksByDay = await this.getTasksByDay(days);
    const completedByDay = await this.getCompletedByDay(days);

    const kpis = this.calculateKPIs(currentStats, previousStats);

    return {
      kpis,
      charts: { tasksByDay, completedByDay },
      totals: {
        totalTasks: currentStats.total,
        completedTasks: currentStats.completed,
        pendingTasks: currentStats.pending,
      },
    };
  }

  private async getCurrentPeriodStats(days: number): Promise<PeriodStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: allTasks } = await supabase
      .from('tasks')
      .select('completed')
      .gte('created_at', startDate.toISOString());

    const total = allTasks?.length || 0;
    const completed = allTasks?.filter(
      (t) => t.completed === true || t.completed === 'true' || t.completed === 1
    ).length || 0;

    return { total, completed, pending: total - completed };
  }

  // ... outros métodos
}
```

Frontend:

```typescript
// apps/web/src/screens/dashboard/dashboard.page.tsx
export default function DashboardPage() {
  const initialData = useLoaderData() as DashboardResponseDTO;

  const { data: dashboard } = useQuery<DashboardResponseDTO>({
    queryKey: ['dashboard', 30],
    queryFn: () => getDashboardData(30),
    initialData,
    staleTime: 0,
    refetchOnMount: true,
  });

  return (
    <section>
      <KPIWidget kpis={dashboard.kpis} />
      <ChartsWidget charts={dashboard.charts} />
      <SummaryWidget totals={dashboard.totals} />
    </section>
  );
}
```

## Desafios Específicos Encontrados

### 1. **Versionamento de Dependências**

**Problema**: Diferentes versões do React/TypeScript entre apps

```json
// ❌ Ruim - Versões diferentes
{
  "dependencies": {
    "react": "19.0.0",  // Em apps/web
    "react": "18.2.0"   // Em apps/api
  }
}

// ✅ Bom - Workspaces do Bun
{
  "workspaces": ["apps/*", "packages/*"],
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

### 2. **Circular Dependencies**

**Problema**: `packages/shared` importa de `apps/api`

```typescript
// ❌ Criar ciclo
// packages/shared/src/index.ts
export * from '@/api/shared/errors';

// ✅ Solução: Manter shared puro
// apps/api/src/shared/errors.ts (apenas em api)
// packages/shared/src/domain/errors.ts (tipos genéricos)
```

### 3. **Build Performance**

**Problema**: Monorepo crescendo lentamente

```bash
# ❌ Rebuild tudo
turbo build

# ✅ Rebuild seletivo
turbo build --filter=@bunstack-playground/web
turbo build --filter=api
```

### 4. **TypeScript Cross-Package**

**Problema**: Tipos não acompanhando em watch mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "declarationMap": true,      // Mapeia para source
    "sourceMap": true,           // Debug sources
    "skipLibCheck": false         // Verifica tipos
  }
}
```

## Best Practices Aprendidas

1. **Mantenha `shared` Puro**: Sem dependências de framework específicas
2. **Query Keys Estruturados**: Use arrays para keys do React Query
3. **Validação em Ambos Lados**: Frontend valida UX, backend valida segurança
4. **Migrações Idempotentes**: `CREATE TABLE IF NOT EXISTS`
5. **Configuração Centralizada**: Uma source of truth para variáveis
6. **Error Handling Padronizado**: Classes de erro reutilizáveis
7. **Type Inference**: Use `z.infer` para derivar tipos de schemas

## Performance e Escalabilidade

### Otimizações Implementadas

```typescript
// Code splitting (Vite)
// apps/web/vite.config.ts
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-chart': ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
}

// Query cache (React Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutos
      gcTime: 24 * 60 * 60 * 1000,     // 24 horas
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Skeleton loading
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardPage />
</Suspense>
```

## Conclusão

Um monorepo bem estruturado oferece:

✅ **Desenvolvimento mais rápido**: Compartilhamento de código sem publicar pacotes
✅ **Type safety completo**: Types sincronizados automaticamente
✅ **Manutenção simplificada**: Mudanças impactam tudo de forma controlada
✅ **Escalabilidade**: Fácil adicionar novos apps, features e packages

⚠️ **Complexidade**: Requer disciplina estrutural e boas práticas

Este projeto exemplifica como construir um monorepo production-ready usando ferramentas modernas. O código está disponível em [bunstack-playground](https://github.com/ruanvalente/bunstack-playground).

---

**Autor**: [Ruan Valente](https://github.com/ruanvalente)  
**Stack**: Bun, Elysia, React, TypeScript, Tailwind CSS, React Query
