import { remultNextApp } from 'remult/remult-next';
import { Task } from './shared/Task';
import { TasksController } from './shared/TasksController';
import { getUserOnServer } from './auth';
import { createPostgresDataProvider } from 'remult/postgres';

export const api = remultNextApp({
  entities: [Task],
  admin: true,
  controllers: [TasksController],
  getUser: getUserOnServer,
  dataProvider: createPostgresDataProvider({
    connectionString:
      process.env['POSTGRES_URL'] || process.env['DATABASE_URL'],
    configuration: {
      ssl: Boolean(process.env['POSTGRES_URL']),
    },
  }),
});

export const { DELETE, GET, POST, PUT } = api;
