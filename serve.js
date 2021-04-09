const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); //需npm安装
const Koa = require('koa'); //需npm安装
const app = new Koa();

app.use(async (ctx) => {

	let filePath = path.join(__dirname, ctx.url); //图片地址
	let file = null;
	try {
	    file = fs.readFileSync(filePath); //读取文件
	} catch (error) {
		//如果服务器不存在请求的图片，返回默认图片
	    filePath = path.join(__dirname, '/src/assets/logo.png'); //默认图片地址
	    file = fs.readFileSync(filePath); //读取文件	    
	}

	let mimeType = mime.lookup(filePath); //读取图片文件类型
	// ctx.set('content-type', mimeType); //设置返回类型
  console.log('file', file)
  ctx.type = 'image/png'
	ctx.body = file; //返回图片

});

app.listen(8090, () => {
  console.log('app run port 8090', 'http://localhost:8090')
})
