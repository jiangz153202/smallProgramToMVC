const uploadFileModel = require('../../models/uploadFile');
const constant = require('../../../utils/constant');
const formidable = require('formidable');
const dtime = require('time-formater');
const fs = require('fs');

class file {
    insertFile(req,res,next){
        console.log(' ########## POST /upload ####### ');
        let avatar = 'public/uploads';
        //创建上传表单
        let form = new formidable.IncomingForm();

        //设置编码格式
        form.encoding = 'utf-8';
        //设置上传目录
        form.uploadDir = 'public/temp';
        //保留后缀
        form.keepExtensions = true;
        //文件大小
        form.maxFieldsSize = 2 * 1024 * 1024;
        //设置多文件上传
        form.multiples = true;
        let temp_files = [];
        //文件都将保存在file数组中
        form.on('file', function(name, file) {
            temp_files.push([name,file])
        });
        console.log(temp_files);

        form.parse(req,function(err,fields,files){
            let filesFile = files.file;
            console.log(JSON.stringify(filesFile),'======>进来了');
            if(err){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "服务器内部错误"
                })
                throw err;
            }

            
            // 限制文件大小 单位默认字节 这里限制大小为2m
            if (filesFile.size > form.maxFieldsSize) {
                fs.unlink(filesFile.path)
                return res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "图片大小不能超过2M"
                })
            }

            //后缀名
            let extName = '';
            switch (filesFile.type) {
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

            if(extName.length === 0){
                return res.json({
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
            let avatarName = time + '_' + ran + '.' + extName;
            // 新图片路径
            let newPath = form.uploadDir + '\\' + avatarName;
            //更改名字和路径
            fs.rename(filesFile.path,newPath,function(err){
                if(err){
                    res.json({
                        code: constant.RESULT.FAILD.code,
                        msg: constant.RESULT.FAILD.msg,
                        data: "图片上传失败"
                    })
                    throw err;
                }else{
                    res.json({
                        code: constant.RESULT.SUCCESS.code,
                        msg: constant.RESULT.SUCCESS.msg,
                        data: avatar+'/'+avatarName
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
                    data: avatar+'/'+avatarName
                })
            }
        })
    }
}
module.exports = new file();