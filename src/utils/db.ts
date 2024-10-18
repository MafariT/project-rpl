import { MikroORM } from '@mikro-orm/mysql';
import mikroOrmConfig from './mikro-orm.config';

let orm: MikroORM;

export async function initORM() {
  orm = await MikroORM.init(mikroOrmConfig);
  return orm;
}


export function getORM() {
  if (!orm) {
    throw new Error('ORM is not initialized. Please call initORM() first.');
  }
  return orm;
}
