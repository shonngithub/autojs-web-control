/**
 * @Author: kun
 */

import { DBM } from '@/common/dbm';
import getLogger from './log4js';

const logger = getLogger('db.ts');


const orm = new DBM({
  connectionLimit: 10,
  host: process.env.DB_HOST || '10.55.17.241',
  port: Number(process.env.DB_PORT) || 10000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PWD || '123456',
  database: 'cloud_auto',
  isDebug: false,
});

orm.setLogger(logger as any);

export default orm;
