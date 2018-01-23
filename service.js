const {query} = require('./async-db')

module.exports = {
  getApp:async function () {
    let sql = 'select * from app where app_id = ? and token like ? '
    return await query(sql, [1, '%123qw%'])
  },
  // 登录
  login:async function (username) {
    let sql = 'select password, account_id from account where username = ?'
    try {
      let result = await query(sql, [username])
      if(result && result.length === 1) {
        return result[0]
      }
      return ''
    } catch(err) {
      console.log(err)
      return false
    }
    
  },
  // 用户信息
  getUser:async function (username) {
    try {
      const sql = 'select account_id,username,email,phone,company,job from account where username =? limit 1'
      const result = await query(sql, [username])
      if (result && result.length === 1) {
        return result[0]
      }
      return ''
    } catch(err) {
      console.log(err)
      return ''
    }

  }, 
  // 更新用户信息
  setUser:async function (user) {
    try {
      const sql = 'update account set username = ? ,email = ? ,phone = ? ,company = ? ,job = ?, last_time = now() where account_id = ?'
      const result = await query(sql, [user.username, user.email, user.phone, user.company, user.job, user.id])
      if(result && result.changedRows === 1){
        return true
      }
      return false
    } catch(err) {
        console.log(err)
        return false
    }
  },
  // 新增或者更新项目
  setProject:async function (project) {
    try {
      if(project.app_id) {
        // 修改
        const sql = 'update app set app_name = ? ,description = ? ,token = ? ,domain = ? ,last_time = now() where app_id = ?'
        const result = await query(sql, [project.app_name, project.description, project.token, project.domain, project.app_id])
        if(result && result.changedRows === 1){
          return true
        }
        return false
      } else {
        // 新增
        /* 
        */
        const sql = 'insert into app(app_id, account_id, app_name, description, token, domain, add_time, last_time) values(0,?,?,?,replace(uuid(),"-",""),?,now(),now())'
        const result = await query(sql, [project.account_id, project.app_name, project.description, project.domain||''])
        if(result && result.affectedRows === 1 && result.insertId > 0){
          return true
        }
        return false
      }
    } catch(err) {
      console.log(err)
      return false
    }
  },
  //获取项目
  getProject:async function (account_id, app_id = 0) {
    try {
      if(app_id) {
        const sql = 'select app_id, account_id, app_name, description, token, domain from app where account_id = ? and app_id = ?'
        const result = await query(sql, [account_id, app_id])
          if(result && result.length > 0) {
            return result;
          }
          return null
      } else {
        const sql = 'select app_id, account_id, app_name, description, token, domain from app where account_id = ?'
        const result = await query(sql, [account_id])
          if(result && result.length > 0) {
            return result;
          }
          return null
      }
    } catch(err) {
      console.log(err)
      return null
    }
  },
  //获取项目,通过token
  getAppIDByToken:async function (token, domain = '') {
    try {
      let sql = 'select app_id from app where token = ?'
      if(domain) {
        sql += ' and domain = ?'
      }
      const result = await query(sql, [token, domain])
      if(result && result.length > 0) {
        return result[0].app_id
      }
      return 0
    } catch(err) {
      console.log(err)
      return 0
    }
  },
  //写入拦截请求
  addRequest:async function(request) {
    try {
      const sql = `insert into request(request_id,app_id,current_url,referer_url,client_id,request_url,request_data,response_status,
        timing,useragent,add_time) values(0,?,?,?,?,?,?,?,?,?,now())`
      const result = await query(sql, [request.app_id, request.current_url, request.referer_url || '', request.client_id, request.request_url, request.request_data || '',
      request.response_status, request.timing, request.useragent, request.add_time])
      if(result && result.affectedRows === 1 && result.insertId > 0) {
        return true
      }
      return false
    } catch(err) {
      console.log(err.sql)
      return false
    }
  },
  //写异常
  addError:async function(request) {
    try {
      const sql = 'insert into error values(0,?,?,?,?,?,?,?,now())'
      const result = await query(sql, [request.app_id, request.current_url, request.client_id, request.useragent, request.message, request.source, request.line])
      if(result && result.affectedRows === 1 && result.insertId > 0) {
        return true
      }
      return false
    } catch(err) {
      console.log(err.sql)
      return false
    }
  }
}
