import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { Elysia, file } from 'elysia';

import { authController } from './interfaces/auth/auth.controller';
import { categoryController } from './interfaces/categories/category.controller';
import { dashboardController } from './interfaces/dashboard/dashboard.controller';
import {
  csvController,
  fileController,
} from './interfaces/files/file.controller';
import { healthController } from './interfaces/health/health.controller';
import { taskController } from './interfaces/tasks/task.controller';
import { userController } from './interfaces/users/user.controller';

const isProduction = process.env.NODE_ENV === 'production';

const corsOrigin = isProduction
  ? process.env.CORS_ORIGIN || 'https://bunstack-playground.onrender.com'
  : true;

const app = new Elysia({ name: 'bunstack-api' });

const shouldServeStatic = isProduction && process.env.SERVE_STATIC === 'true';

if (shouldServeStatic) {
  app.use(
    staticPlugin({
      assets: 'apps/web/dist',
      prefix: '/',
    })
  );
}

app
  .use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  )
  .use(taskController)
  .use(dashboardController)
  .use(authController)
  .use(categoryController)
  .use(fileController)
  .use(csvController)
  .use(userController)
  .use(healthController);

if (shouldServeStatic) {
  app.get('/', () => file('apps/web/dist/index.html'));
  app.get('/*', () => file('apps/web/dist/index.html'));
} else {
  app.get('/', () => 'OK');
}

export { app };
