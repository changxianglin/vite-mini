const fs = require('fs')
const path = require('path')
const Koa = require('koa')

const app = new Koa()

function rewriteImport(content) {
  return content.replace(/from ['"]([^'"]+)['"]/g, function (s0, s1) {
    if (s1[0] !== '.' && s1[1] !== '/') {
      return `from '/@modules/${s1}'`
    } else {
      return s0
    }
  })
}

app.use(async ctx => {
  const { request: { url } } = ctx
  console.log('路径', request)
  
  if (url == '/') {
    console.log('首页')
    ctx.type = 'text/html'
    let content = fs.readFileSync('./index.html', 'utf-8')
    content = content.replace('<script ',`
      <script>
        window.process = {env:{ NODE_ENV:'dev'}}
      </script>
      <script 
    `)
    ctx.body = content
  } else if (url.endsWith('.js')) {
    const p = path.resolve(__dirname, url.slice(1))
    ctx.type = 'application/javascript'
    const content = fs.readFileSync(p, 'utf-8')
    ctx.body = rewriteImport(content)
  }
  
  if(url.startsWith('/@modules/')){
    // 这是一个node_module里的东西
    console.log('添加依赖库')
    const prefix = path.resolve(__dirname,'node_modules',url.replace('/@modules/',''))
    const module = require(prefix + '/package.json').module
    console.log('perfix', prefix, module)
    const p = path.resolve(prefix,module)
    const ret = fs.readFileSync(p,'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(ret)
  }

  if (url.indexOf('.vue') > -1) {
    const p = path.resolve(__dirname, url.split('?')[0].slice(1))
    const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'))
    
    if(!query.type){
      ctx.type = 'application/javascript'
      // 借用vue自导的compile框架 解析单文件组件，其实相当于vue-loader做的事情
      ctx.body = `
      // option组件
  ${rewriteImport(descriptor.script.content.replace('export default ','const __script = '))}
  import { render as __render } from "${url}?type=template"
  __script.render = __render
  export default __script
      `
    }
  }

  if(request.query.type ==='template'){
    // 模板内容
    const template = descriptor.template
    // 要在server端吧compiler做了
    const render = compilerDom.compile(template.content, {mode:"module"}).code
    ctx.type = 'application/javascript'
  
    ctx.body = rewriteImport(render)
  }
})

app.listen(3001, () => {
  console.log('app run start 3001')
})