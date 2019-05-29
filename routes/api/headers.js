/**
 * header请求参数验证
 */
const jwt = require('jsonwebtoken');
const constant = require('../../utils/constant');
const routesPath = require('../route.config').Routes;

//请求数据设备类型
function apptype(req,res,next){
    let type = req.headers['app-type'];
    if(type){
        next();
    }else{
        res.json({
            code:constant.RESULT.ARG_ERROR.code,
            msg:'app-type不能为空',
            data:''
        })
    }
}

//token验证
function token(req,res,next){

    //取token 数据
    let token = req.headers.authorization;
    console.log(req,res);
    if(token){
        jwt.verify(token,constant.jwtsecret,(err,decoded)=>{
            if(err){
                res.json({
                    code:constant.RESULT.TOKEN_ERR.code,
                    msg:constant.RESULT.TOKEN_ERR.msg,
                    data:''
                })
            }else{
                req.decoded = decoded;
                next();//继续下一个路由
            }
        })
    }else{
        res.json({
            code:constant.RESULT.TOKEN_NO_FIND.code,
            msg:constant.RESULT.TOKEN_NO_FIND.msg,
            data:''
        })
    }

}

function create_token(params){
    let token = jwt.sign(params,constant.jwtsecret,{ expiresIn: 60 * 60 });
    return token
}

function checkAuthPath(originalUrl){
    return new Promise((resolve,reject)=>{
        try {
            var status =true;
            routesPath.forEach((item,index,arr)=>{
                if(originalUrl === "/api"+item){
                    status = false
                }
            })
            resolve(status)
        } catch (error) {
            reject(false);
        }
    })
}


exports.apptype = apptype;
exports.token = token;
exports.create_token = create_token;
exports.checkAuthPath = checkAuthPath;