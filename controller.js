const {cryptoMD5} = require('./cryption')

const {EMPTY_PARAMETERS, SUCCESS, INCORRECT_PASSWORD} = require('./errorcode')
const service = require('./service')
const {validate, createToken} = require('./utils')
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
    if (username && password) {
      let _password = await service.login(username)
      // 登录成功
      if (cryptoMD5(password) === _password) {
        // 登录成功后生成token,返回给客户端
        token = createToken(username)
        code = SUCCESS
      }
    } else {
      // 返回error
      code = EMPTY_PARAMETERS
    }
    ctx.response.body = {
      code: code,
      token: token
    }
  },

  notFound: async(ctx, next) => {
    await ctx.render('404')
  }
}
