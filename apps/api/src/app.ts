import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { Elysia, file } from 'elysia';

import { healthSchema } from '@bunstack-playground/shared/http';

import { authController } from './interfaces/auth/auth.controller';
import { categoryController } from './interfaces/categories/category.controller';
import { dashboardController } from './interfaces/dashboard/dashboard.controller';
import {
  csvController,
  fileController,
} from './interfaces/files/file.controller';
import { taskController } from './interfaces/tasks/task.controller';
import { userController } from './interfaces/users/user.controller';

const isProduction = process.env.NODE_ENV === 'production';
const isRailway = process.env.RAILWAY_STATIC_URL !== undefined;
const serveStatic = isProduction || isRailway;

const app = new Elysia({ name: 'bunstack-api' });

if (serveStatic) {
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
      origin: isProduction
        ? 'https://bunstack-production.up.railway.app'
        : true,
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
  .get('/health', () => healthSchema);

if (serveStatic) {
  app.get('/', () => file('apps/web/dist/index.html'));
  app.get('/*', () => file('apps/web/dist/index.html'));
} else {
  app.get('/', () => 'OK');
}

export { app };
