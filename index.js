const fs = require('fs')
const path = require('path')
const Koa = require('koa')

const app = new Koa()

app.use(async ctx => {
  const { request: { url } } = ctx
  console.log('路径', url)
  
  if (url == '/') {
    console.log('首页')
    ctx.type = 'text/html'
    ctx.body = fs.readFileSync('./index.html')
  } else if (url.endsWith('.js')) {
    const p = path.resolve(__dirname, url.slice(1))
    ctx.type = 'application/javascript'
    const content = fs.readFileSync(p, 'utf-8')
    ctx.body = content
  }
})

app.listen(3001, () => {
  console.log('app run start 3001')
})