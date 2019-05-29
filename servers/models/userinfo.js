const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//时间格式化模块
const dtime = require('time-formater');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id:Number,
    name:String,
    password:{
        type:String,
        default:'123456'
    },
    nickName:String,
    avatarUrl:String,
    city:String,
    province:String,
    country:String,
    gender:{
        type:Number,
        default:0
    },
    age:String,
    level:String,
    mobile:String,
    openids:String,
    unionid:String,
    update_at:Date,
    create_at:Date,
    isDeleted:{type:Number,default:0}
})

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
userSchema.pre('save',function(next){
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }


    var user = this;
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10,function(err,salt){
            if(err){
                return next(err);
            }

            bcrypt.hash(user.password,salt,function(err,hash){
                if(err){
                    return next(err);
                }
                user.password = hash;
                next();
            })
        })
    }else{
        return next();
    }
})

//校验
userSchema.methods.comparePassword = function(passw,cb){
    bcrypt.compare(passw,this.password,(err,isMatch)=>{
        if(err){
            return cb(err);
        }
        cb(null,isMatch)
    })
}

//建立索引
userSchema.index({id:1})

const userinfo = mongoose.model('userinfo',userSchema);

module.exports = userinfo;