const formidable = require('formidable');
const constant = require('./constant');
const dtime = require('time-formater');
const path = require('path');
const fs = require('fs');

module.exports.uploadFiles = (req) => {
    return new Promise((resolve,reject) => {
        const PUBLIC_TEMP = 'public/',
            temp = 'temp',
            save = 'uploads';
        //设置临时存放目录 当保存成功之后 再转移目录
        const tempPath = path.join(PUBLIC_TEMP,temp);
        const savePath = path.join(PUBLIC_TEMP,save);
        //初始化
        const formParse = new formidable.IncomingForm();
        formParse.encoding='utf-8';
        formParse.keepExtensions=true;
        formParse.type = 'multipart';
        formParse.multiples = true;
        formParse.uploadDir = tempPath;
        var files=[];
        //文件都将保存在files数组中
        formParse.on('file', function (filed,file) {
            files.push([filed,file]);
        })
        console.log(files);
        formParse.parse(req,(err,filed,files) => {
            if(err){
                let result = {
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "服务器内部错误"
                };
                reject(result);
            }
            let filesUrl = [],
                keys = Object.keys(files);
                keys.forEach((key) => {
                    let filePath = files[key].path;
                    let fileExtName = '';
                    switch (files[key].type) {
                        case 'image/pjpeg':
                            extName = 'jpg';
                            break;
                        case 'image/jpeg':
                            extName = 'jpg';
                            break;
                        case 'image/png':
                            extName = 'png';
                            break;
                        case 'image/x-png':
                            extName = 'png';
                            break;
                    }
                    if(fileExtName.length === 0){
                        let result = {
                            code: constant.RESULT.FAILD.code,
                            msg: constant.RESULT.FAILD.msg,
                            data: "只支持png和jpg格式图片"
                        };
                        reject(result);
                    }

                     //使用时间模块
                    let time = dtime().format('YYYYMMDDHHmmss');
                    //生成随机数
                    let ran =parseInt(Math.random() * 8999 + 10000);
                    //生成新图片名称 
                    let avatarName = time + '_' + ran + '.' + fileExtName;
                    //更改名字和路径
                    fs.rename(filePath,savePath,function(err){
                        if(err){
                            let result = {
                                code: constant.RESULT.FAILD.code,
                                msg: constant.RESULT.FAILD.msg,
                                data: "图片上传失败"
                            };
                            reject(result);
                        }else{
                            let result = {
                                code: constant.RESULT.SUCCESS.code,
                                msg: constant.RESULT.SUCCESS.msg,
                                data: savePath+'/'+avatarName
                            };
                            resolve(result);
                        }
                    })

                })
        })
    })
}