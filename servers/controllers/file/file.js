const uploadFileModel = require('../../models/uploadFile');
const constant = require('../../../utils/constant');
// const formidableUtil = require('../../../utils/formidableUtil');
const formidable = require('formidable');

const dtime = require('time-formater');
const path = require('path');
const fs = require('fs');

class file {
    insertFile(req,res,next){
        console.log(' ########## POST /upload ####### ',(new Date).toTimeString());
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
        formParse.uploadDir = tempPath;
        formParse.maxFieldsSize = 10 * 1024 * 1024;
       
        formParse.parse(req,(err,filed,files) => {
            let uploadFile = files.file;
            if(err){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "图片服务器内部错误"
                })
            }
            console.warn('上传的图片大小',(uploadFile.size / 1024 * 1024));
            // 限制文件大小 单位默认字节 这里限制大小为2m
            if (uploadFile.size > formParse.maxFieldsSize) {
                //如果超过了 那么删除超过的图片
                fs.unlink(uploadFile.path)
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "图片大小不能超过10M"
                })
            }
            //后缀名
            let extName = '';
            switch (uploadFile.type) {
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
                case 'image/gif':
                    extName = 'gif';
                    break;
            }

            if(extName.length === 0){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "只支持png和jpg格式图片"
                })
            }

            //使用时间模块
            let time = dtime().format('YYYYMMDDHHmmss');
            //生成随机数
            let ran =parseInt(Math.random() * 8999 + 10000);
            //生成新图片名称 
            let avatarName = time + ran + '.' + extName;
            // 新图片路径
            let newPath = savePath + '\\' + avatarName;
            //存入数据库时的图片路径
            let dataSourcePath = path.join('/'+save,'/'+avatarName);//'\\' + save+ '\\' + avatarName;
            //更改名字和路径
            fs.rename(uploadFile.path,newPath,function(err){
                if(err){
                    res.json({
                        code: constant.RESULT.FAILD.code,
                        msg: constant.RESULT.FAILD.msg,
                        data: "图片上传失败"
                    })
                }else{
                    res.json({
                        code: constant.RESULT.SUCCESS.code,
                        msg: constant.RESULT.SUCCESS.msg,
                        data: dataSourcePath
                    })
                }
            })

        })
    }
    fetchFile(req,res,next){
        uploadFileModel.statics.fetch((err,uploads) => {
            if(err){
                console.log(err);
            }
            if(uploads){
                res.json({
                    code: constant.RESULT.SUCCESS.code,
                    msg: constant.RESULT.SUCCESS.msg,
                    data: avatar+'\\'+avatarName
                })
            }
        })
    }
}
module.exports = new file();