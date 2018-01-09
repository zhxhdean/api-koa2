const router = require('koa-router')()
const controller = require('./controller')
module.exports = (app) => {
  //添加路由
  router.get('/', controller.index)

  router.get('/home', controller.home)

  router.get('/login', controller.login_page)

  router.post('/login', controller.login)

  router.get('/*', controller.notFound)
  app
    .use(router.routes())
    .use(router.allowedMethods())
}
