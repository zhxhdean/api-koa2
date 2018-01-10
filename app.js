
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const path = require('path')
const staticFiles = require('koa-static')
const json = require('koa-json')
const cors = require('koa2-cors')

const app = new Koa()
const router = require('./router')

//跨域
app.use(cors())

//静态资源 js，css,image
app.use(staticFiles(path.resolve(__dirname, './public')))

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'views'),
  nunjucksConfig: {
    trimBlocks: true // 开启转义,防xss
  }
}))

app.use(bodyParser())
router(app)

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
