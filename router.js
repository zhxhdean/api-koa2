const router = require('koa-router')()
const controller = require('./controller')
module.exports = (app) => {
  //添加路由
  router.get('/', controller.index)

  router.post('/valid', controller.valid)

  router.get('/home', controller.home)

  router.get('/login', controller.login_page)

  router.post('/login', controller.login)
  router.get('/user', controller.getUser)
  router.post('/user', controller.setUser)
  router.get('/*', controller.notFound)
  app
    .use(router.routes())
    .use(router.allowedMethods())
}
