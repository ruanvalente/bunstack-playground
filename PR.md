# Pull Request Template

## Summary

Add task filtering functionality by status (completed/pending) and sorting (created_at/updated_at) with ASC/DESC order. Also includes Prettier integration with ESLint for automatic code formatting.

## Type

- [x] feat
- [x] fix
- [x] docs
- [x] style
- [x] refactor
- [x] perf
- [ ] test
- [x] build
- [x] ci
- [x] chore
- [ ] revert

## Changes

### Task Filter Feature (feat)

#### Backend
- Added `statusFilter` and `sortBy` parameters to `paginationQuerySchema`
- Updated task routes to handle new filter query parameters
- Implemented filter logic in Supabase repository (WHERE clause by completed status)
- Implemented filter logic in SQLite repository (WHERE clause by completed status)
- Dynamic sorting by `created_at` or `updated_at` in both repositories

#### Frontend
- Added `useLocalStorage` hook for state persistence
- Created `FilterWidget` component with dropdown UI
- Integrated filter in tasks page and task list widget
- Filter supports: All / Completed / Pending status
- Sorting supports: Newest (created_at DESC) / Oldest (created_at ASC) / Recently Updated (updated_at DESC) / Least Recently Updated (updated_at ASC)
- Button shows active filter (e.g., "Filter: Completed")
- Works with both Supabase (production) and SQLite (development)

### Prettier & Lint Configuration (build)

- Installed `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- Added `.prettierrc` with code style configuration (singleQuote, trailingComma, etc.)
- Updated `eslint.config.js` to integrate with Prettier
- Added format scripts to `package.json`:
  - `bun run lint` - ESLint with auto-fix
  - `bun run lint:check` - ESLint check only
  - `bun run format` - Prettier write
  - `bun run format:check` - Prettier check only
- Updated `lint-staged.config.js` to run ESLint + Prettier on commit
- Formatted entire codebase with Prettier

## Test

### Local Development
```bash
# Install dependencies
bun install

# Run development (hot reload)
bun run dev

# Run lint with auto-fix
bun run lint

# Run format
bun run format
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks?statusFilter=completed&sortBy=created_at&sortOrder=DESC` | Get filtered tasks |

### Filter Query Parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `statusFilter` | `completed`, `pending` | (all) |
| `sortBy` | `created_at`, `updated_at` | `created_at` |
| `sortOrder` | `ASC`, `DESC` | `DESC` |

## Screenshots (if applicable)

Filter Widget UI:
- Button shows "Filter" or "Filter: Completed" / "Filter: Pending" when active
- Dropdown with Status options: All, Completed, Pending
- Dropdown with Order options: Newest, Oldest, Recently Updated, Least Recently Updated
