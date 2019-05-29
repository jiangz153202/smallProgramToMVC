/**
 * 用户controller（例如登录、注册等操作逻辑在此实现）
 */
const UserModel = require('../../models/userinfo');
const constant = require('../../../utils/constant');
const jwt = require('jsonwebtoken');

//时间格式化模块
const dtime = require('time-formater');

class user {
    async deleteAllByUserModel(req,res,next){
        await UserModel.remove({},(err)=>{
            if(err){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: "清空UserModel失败!"+err
                })
            }else{
                res.json({
                    code: constant.RESULT.SUCCESS.code,
                    msg: constant.RESULT.SUCCESS.msg,
                    data: "清空UserModel成功!"
                })
            }
        })
    }

    //注册用户
    async register(req, res, next) {
        let username = req.body.username;
        let userpassword = req.body.userpassword;
        try {
            const userinfo = {
                name: username,
                password: userpassword
            }
            await UserModel.create(userinfo);
            res.json({
                code: constant.RESULT.SUCCESS.code,
                msg: constant.RESULT.SUCCESS.msg,
                data: "注册成功"
            })
        } catch (error) {
            res.json({
                code: constant.RESULT.FAILD.code,
                msg: constant.RESULT.FAILD.msg,
                data: "注册失败"
            })
        }
    }
    
    //查询用户
    async signInByUserName(req, res, next) {
        let username = req.body.username;
        let userpassword = req.body.userpassword;
        if (!username) {
            res.status(400).send("用户名不能为空!");
        }
        if (!userpassword) {
            res.json({
                code: constant.RESULT.ARG_ERROR.code,
                msg: constant.RESULT.ARG_ERROR.msg,
                data: "请输入用户密码!"
            })
        }
        try {
            await UserModel.findOne({ name: username}, (err, user) => {
                if (err) {
                    res.json({
                        code: constant.RESULT.FAILD.code,
                        msg: constant.RESULT.FAILD.msg,
                        data: err 
                    })
                }
                
                if(user){
                    user.comparePassword(userpassword,function(err,isMatch){
                        if (err) {
                            res.json({
                                code: constant.RESULT.INTERNAL_ERROR.code,
                                msg: constant.RESULT.INTERNAL_ERROR.msg,
                                data: "服务器内部错误"
                            })
                        }
                        console.log('当前错误信息:',isMatch);
                        if(isMatch){
                            res.json({
                                code: constant.RESULT.SUCCESS.code,
                                msg: constant.RESULT.SUCCESS.msg,
                                data: user
                            })
                        }else{
                            res.json({
                                code: constant.RESULT.SUCCESS.code,
                                msg: constant.RESULT.SUCCESS.msg,
                                data: "密码错误,请重试!"
                            })
                        }
                        
                    });
                }else{
                    res.json({
                        code: constant.RESULT.NO_DATA.code,
                        msg: constant.RESULT.NO_DATA.msg,
                        data: "用户不存在！"
                    })
                }
                
               
               

            })
        } catch (error) {
            res.json({
                code: constant.RESULT.FAILD.code,
                msg: constant.RESULT.FAILD.msg,
                data: "用户查询失败！"
            })
        }
    }


    /*
     *  获取用户列表 
     *  params {} 
     */
    async getUserInfoList(req, res, next) {
        try {
            await UserModel.find((err, userlist) => {
                if (err) {
                    res.json({
                        code: constant.RESULT.FAILD.code,
                        msg: constant.RESULT.FAILD.msg,
                        data: err
                    })
                }
                if (userlist.length > 0) {
                    //如果存在用户
                    res.json({
                        code: constant.RESULT.SUCCESS.code,
                        msg: constant.RESULT.SUCCESS.msg,
                        data: userlist
                    })
                } else {
                    res.json({
                        code: constant.RESULT.NO_DATA.code,
                        msg: constant.RESULT.NO_DATA.msg,
                        data: []
                    })
                }

            })
        } catch (error) {
            res.json({
                code: constant.RESULT.FAILD.code,
                msg: constant.RESULT.FAILD.msg,
                data: "用户查询失败！"
            })
        }
    }

    /*
    *   登录方法
    */
    async getUserAndCreateToken(req, res, next) {
        let username = req.body.username;
        let userpassword = req.body.userpassword;
        if (!username) {
            res.json({
                code: constant.RESULT.ARG_ERROR.code,
                msg: constant.RESULT.ARG_ERROR.msg,
                data: "用户名不能为空!"
            })
        }
        if (!userpassword) {
            res.json({
                code: constant.RESULT.ARG_ERROR.code,
                msg: constant.RESULT.ARG_ERROR.msg,
                data: "请输入用户密码!"
            })
        }

        await UserModel.findOne({ name: username }, (err, resp) => {
            if (err) {
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: err
                })
            }

            //判断密码
            if (!resp) {
                res.json({
                    code: constant.RESULT.ARG_ERROR.code,
                    msg: constant.RESULT.ARG_ERROR.msg,
                    data: "认证失败,用户不存在"
                })
            } else if (resp) {
                resp.comparePassword(userpassword, (err, isMatch) => {
                    if (isMatch && !err) {
                        //验证成功
                        //创建token
                        var token = jwt.sign(resp.toJSON(), constant.jwtsecret, {
                            expiresIn: 1440 // 设置过期时间
                        });

                        res.json({
                            code: constant.RESULT.SUCCESS.code,
                            msg: constant.RESULT.SUCCESS.msg,
                            data: token
                        });

                    }
                })
            } else {
                res.json({
                    code: constant.RESULT.ARG_ERROR.code,
                    msg: constant.RESULT.ARG_ERROR.msg,
                    data: "输入的密码不正确,请确认再试!"
                })
            }

        })
    }

    /**
     * openid 注册 
     */
    async register2openid(req,res){
        let { openids } = req.body;
        if(!openids){
            res.json({
                code: constant.RESULT.ARG_ERROR.code,
                msg: constant.RESULT.ARG_ERROR.msg,
                data: "用户openid不能为空!"
            });
        }
        //先检查有没有这个人 如果没有就注册为新的   
        let status = await UserModel.findOne({ openids : openids},(err,result)=>{
            if(err){
                res.json({
                    code: constant.RESULT.NO_DATA.code,
                    msg: constant.RESULT.NO_DATA.msg,
                    data: "查询发生错误"
                });
            }
            if(result == null){
                //注册
                const userinfo = {
                    openids:openids
                }
                UserModel.create(userinfo,(err,result) => {
                    if(err){
                        res.json({
                            code: constant.RESULT.NO_DATA.code,
                            msg: constant.RESULT.NO_DATA.msg,
                            data: "注册发生错误"
                        });
                    }
                    //注册成功
                    res.json({
                        code: constant.RESULT.CREATE_SUCCESS.code,
                        msg: constant.RESULT.CREATE_SUCCESS.msg,
                        data: result
                    })
                });
            }else{
                res.status(200).send(result);
            }
        })
    }

    /**
     * 完善信息
     */
    async update2register(req,res){
        let { openids } = req.body;
        let params = {
            nickName : req.body.nickName,
            avatarUrl: req.body.avatarUrl,
            city:req.body.city,
            country:req.body.country,
            gender:req.body.gender,
            province:req.body.province
        }
        UserModel.findOneAndUpdate({ openids:openids},params,{ new :true},(err,result)=>{
            if(err){
                res.json({
                    code: constant.RESULT.NO_DATA.code,
                    msg: constant.RESULT.NO_DATA.msg,
                    data: "查询发生错误"
                });
            }

            res.json({
                code: constant.RESULT.UPDATE_SUCCESS.code,
                msg: constant.RESULT.UPDATE_SUCCESS.msg,
                data: result
            })
        })
    }

   
}

module.exports = new user();