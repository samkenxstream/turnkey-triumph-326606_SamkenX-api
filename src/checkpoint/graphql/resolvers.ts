import { AsyncMySqlPool } from '../mysql';
import { CheckpointsStore, MetadataId } from '../stores/checkpoints';
import { Logger } from '../utils/logger';

/**
 *
 */
export interface ResolverContext {
  log: Logger;
  mysql: AsyncMySqlPool;
  checkpointsStore: CheckpointsStore;
}

export async function queryMulti(parent, args, context: ResolverContext, info) {
  const { log, mysql } = context;

  const params: any = [];
  let whereSql = '';
  if (args.where) {
    Object.entries(args.where).map(w => {
      whereSql += !whereSql ? `WHERE ${w[0]} = ? ` : ` AND ${w[0]} = ?`;
      params.push(w[1]);
    });
  }
  const first = args?.first || 1000;
  const skip = args?.skip || 0;
  const orderBy = 'created';
  const orderDirection = 'DESC';
  params.push(skip, first);

  const query = `SELECT * FROM ${info.fieldName} ${whereSql} ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;
  log.debug({ sql: query, args }, 'executing multi query');

  return await mysql.queryAsync(query, params);
}

export async function querySingle(parent, args, context: ResolverContext, info) {
  const { log, mysql } = context;

  const query = `SELECT * FROM ${info.fieldName}s WHERE id = ? LIMIT 1`;
  log.debug({ sql: query, args }, 'executing single query');

  const [item] = await mysql.queryAsync(query, [args.id]);
  return item;
}

export async function queryLastIndexedBlock(_parent, _args, ctx: ResolverContext) {
  return ctx.checkpointsStore.getMetadataNumber(MetadataId.LastIndexedBlock);
}
