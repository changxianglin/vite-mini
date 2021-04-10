const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); //需npm安装
const net = require('net')
const Koa = require('koa'); //需npm安装
const { resolve } = require('path');
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

let port = 8070

// 找端口需要递归寻找

// app.listen(port, () => {
// 	console.log('app run port 8090', 'http://localhost:8090')
// }).on('error', () => {
// 	console.log('端口被使用掉')
// 	port += 1
// 	app.listen(port, () => {
// 		console.log(`app run port ${port + 1}`)
// 	})
// })

var findPort = function (port) {
	return new Promise((resolve, reject) => {
		const server = app.listen(port)
		server.on('listening', () => {
			console.log('可用', port)
			server.close()
			resolve(port)
		})
		server.on('error', (err) => {
			console.log('端口被占用', port)
			if (err.code === 'EADDRINUSE') {
				resolve(err)	
			}
		})
	})
}

// findPort(port)

const startServer = async function (port, callback) {
	const canRun = await findPort(port)
	if (canRun instanceof Error) {
		console.log('端口被用掉,继续往下')
		port++
		startServer(port, callback)
	} else {
		callback(port)
	}
}

startServer(port, function(port) {
	app.listen(port, () => {
		console.log('app run in port ', port)
	})
})
