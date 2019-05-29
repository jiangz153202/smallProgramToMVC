/**
 * 主路由
 */
const user = require('./user');
const maps = require('./maps');
const upload = require('./upload');
const wechat = require('./wechat');
const headers = require('./headers');
const routesPath = require('../route.config').Routes;
const uploadFile = require('../../servers/controllers/file/file');
module.exports = app => {
    //所有的数据都需要验证的话
    // app.use(headers.apptype)
    //所有的数据请求都需要验证token
    app.all('/api/*',function(req,res,next){
        
        headers.checkAuthPath(req.originalUrl).then(value => {
            if(value){
                next()
            }else{
                headers.token(req,res,next);
            }
        })
    })
    //功能模块自路由
    app.use('/api/user',user);
    app.use('/api/maps',maps);
    app.use('/upload',upload);
    app.use(wechat);
    //app.use('/api/xxx',xxx);
}