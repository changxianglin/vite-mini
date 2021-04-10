
const net = require('net');
 
function portInUse(port){
    return new Promise((resolve, reject)=>{
        let server = net.createServer().listen(port);
        server.on('listening',function(){
            server.close();
            resolve(port);
        });
        server.on('error',function(err){
            if(err.code == 'EADDRINUSE'){
                resolve(err);
            }
        });             
    });
}
 
const tryUsePort = async function(port, portAvailableCallback){
    let res = await portInUse(port);
    if(res instanceof Error){
        console.log(`端口：${port}被占用\n`);
        port++;
        tryUsePort(port, portAvailableCallback);
    }else{
        portAvailableCallback(port);
    }
}
 
// 测试 
let port=3000;
tryUsePort(port ,function(port){
    // do something ...
    console.log(`端口：${port}可用\n`);
    net.createServer().listen(port);
});