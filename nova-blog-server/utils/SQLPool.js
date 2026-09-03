import mysql from 'mysql2/promise';

let pool;

function initialPool() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
};

async function query(sql, params) {
  let connection;
  try {
    if(!pool) initialPool();
    connection = await pool.getConnection();
    const [results, fields] = await connection.execute(sql, params);
    return [results, fields];
  } catch(error) {
    console.error('获取数据库连接失败:', error);
  } finally {
    if (connection) connection.release()
  }
}

async function insert(table, data) {
  try {
    const values = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
    const keys = values.map(([key]) => key).join(', ')
    const placeholders = values.map(() => '?').join(', ')
    const sql = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`
    return await query(sql, values.map(([_, value]) => value))
  } catch (e) {
    console.error('插入数据失败:', e);
    throw e;
  }
}

async function updata(table, data, condition) {
  try {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const whereClause = Object.keys(condition).map(key => `${key} = ?`).join(' AND ')
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`
    return await query(sql, [...Object.values(data), ...Object.values(condition)])
  } catch (e) {
    console.error('更新数据失败:', e);
  }
}

async function remove(table, condition, isSoftDelete = true) {
  try {
    const whereClause = Object.keys(condition).map(key => `${key} = ?`).join(' AND ')
    if (isSoftDelete) {
      const sql = `UPDATE ${table} SET is_deleted = 1 WHERE ${whereClause}`;
      return await query(sql, Object.values(condition));
    } else {
      const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
      return await query(sql, Object.values(condition));
    }
  } catch (e) {
    console.error('删除数据失败:', e);
  }
}

export {
  query,
  insert,
  updata,
  remove
};