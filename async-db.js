const mysql = require('mysql')
const pool = mysql.createPool({host: '127.0.0.1', user: 'root', password: '123', database: 'frontdb'})
// https://github.com/mysqljs/mysql
module.exports = {
  query: function (sql, values) {
    return new Promise((resolve, reject) => {
      pool
        .getConnection(function (err, conn) {
          if (err) {
            reject(err)
          } else {
            conn.query(sql, values, (err, rows) => {
              if (err) {
                reject(err)
              } else {
                resolve(rows)
              }
              conn.release()
            })
          }
        })
    })
  }
}