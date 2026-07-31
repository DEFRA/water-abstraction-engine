/**
 * Used to check if the connection to the database is healthy
 * @module CheckDatabaseDal
 */

import { db } from '../../../db/db.js'

/**
 * Used to check if the connection to the database is healthy
 *
 * Generates an array of stats for each table in the database
 *
 * This is a dump of running `SELECT * FROM pg_stat_user_tables` for the database. It's part of the database health
 * check and we use it for 2 reasons
 *
 * - confirm we can connect
 * - get some basic stats, for example number of records, for each table without needing to connect to the db
 *
 * @returns {Promise<object[]>} an array of stats for each table found in the db
 */
export default async function checkDatabaseDal() {
  return db.select().table('pg_stat_user_tables')
}
