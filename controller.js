const {cryptoMD5} = require('./cryption')

const {EMPTY_PARAMETERS, SUCCESS, INCORRECT_PASSWORD, NO_USER, TOKEN_ERROR, 
  TOKEN_IMMINENT_TIMEOUT, CHANGE_USER_FAIL, NO_APP} = require('./errorcode')
const service = require('./service')
const {validate, createToken, getUserNameFromToken} = require('./utils')
module.exports = {
  index: async(ctx, next) => {
    await ctx.render('index')
  },
  valid: async(ctx, next) => {
    let {token} = ctx.request.body
    console.log(token)
    ctx.response.body = {
      code: validate(token)
    }

  },
  test: async(ctx, next) => {
    await ctx.render('test')
  },
  home: async(ctx, next) => {
    ctx.response.body = `<h1>home page</h1><a href="/users/zhxh">zhxh</a>`
  },
  login_page: async(ctx, next) => {
    await ctx.render('login')
  },
  register: async(ctx, next) => {
    let {name, password} = ctx.request.body
    if (name === 'zhxh' && password === '123456') {
      ctx.response.body = {
        code: 1,
        msg: `Hello, ${name}~`
      }
    } else {
      ctx.response.body = {
        code: 0,
        msg: '账号或密码错误'
      }
    }
  },
  login: async(ctx, next) => {
    let {username, password} = ctx.request.body
    let code = INCORRECT_PASSWORD
    let token = ''
    let uid = ''
    if (username && password) {
      let result = await service.login(username)
      // 登录成功
      if (cryptoMD5(password) === result.password) {
        // 登录成功后生成token,返回给客户端
        token = createToken(username)
        uid =result.account_id
        code = SUCCESS
      }
    } else {
      // 返回error
      code = EMPTY_PARAMETERS
    }
    ctx.response.body = {
      code: code,
      token: token,
      uid: uid
    }
  },
  getUser: async(ctx, next) => {
    const {token} = ctx.request.query
    const username = getUserNameFromToken(token)
    let code = ''
    let user = {};
    if (username === '') {
      code = TOKEN_ERROR 
    } else {
      const result = await service.getUser(username)
      if (result === '') {
        code = NO_USER
      } else {
        user = {userInfo: {
          id: result.account_id,
          username: result.username,
          email: result.email,
          phone: result.phone,
          company: result.company,
          job: result.job
        }}
        code = SUCCESS
      }
    }
    ctx.response.body = {
      code: code,
      ...user
    }
  },
  setUser: async(ctx, next) => {
    const {user, token} = ctx.request.body
    const valid = validate(token)
    if(valid !== SUCCESS && valid !== TOKEN_IMMINENT_TIMEOUT) {
      ctx.response.body = {
        code: valid
      }
    } else {
      const result = await service.setUser(user)
      if(result) {
        ctx.response.body = {
          code: SUCCESS
        }
      } else {
        ctx.response.body = {
          code: CHANGE_USER_FAIL
        }
      }
    }
  },

  setProject: async(ctx, next) => {
    const {token, project} = ctx.request.body
    const valid = validate(token)
    if(valid !== SUCCESS && valid !== TOKEN_IMMINENT_TIMEOUT) {
      ctx.response.body = {
        code: valid
      }
    } else {
      const result = await service.setProject(project)
      if(result) {
        ctx.response.body = {
          code: SUCCESS
        }
      } else {
        ctx.response.body = {
          code: CHANGE_USER_FAIL
        }
      }
    }
  },
  getProject: async(ctx, next) => {
    const {account_id, app_id, token} = ctx.request.query
    const valid = validate(token)
    if(valid !== SUCCESS && valid !== TOKEN_IMMINENT_TIMEOUT) {
      ctx.response.body = {
        code: valid
      }
    } else {
      const result = await service.getProject(+account_id, +app_id)
      ctx.response.body = {
        code: SUCCESS,
        projects: result
      }
    }
  },
  collect:async(ctx, next) => {
    const {type, data} = ctx.request.body
    const app_id = await service.getAppIDByToken(data.token)
    if(!app_id) {
      ctx.response.body = {
        code: NO_APP
      }
    } else {
      data.app_id = app_id
      if(type === 0) {
        // 拦截ajax
        await service.addRequest(data)
      } else {
        // 异常
        await service.addError(data)
      }
      ctx.response.body = {
        code: SUCCESS
      }
    }
    
  },
  notFound: async(ctx, next) => {
    await ctx.render('404')
  }
}
