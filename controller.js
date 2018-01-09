const {cryptoMD5} = require('./md5')

const {EMPTY_PARAMETERS, SUCCESS, INCORRECT_PASSWORD} = require('./errorcode')
const service = require('./service')
module.exports = {
  index: async(ctx, next) => {
    let data = await service.getApp()
    console.log(data)
    await ctx.render('index', {data: data})
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
    if (username && password) {
      let _password = await service.login(username)
      // 登录成功
      if (cryptoMD5(password) === _password) {
        code = SUCCESS
      }
    } else {
      // 返回error
      code = EMPTY_PARAMETERS
    }
    ctx.response.body = {
      code: code
    }
  },
  notFound: async(ctx, next) => {
    await ctx.render('404')
  }
}
