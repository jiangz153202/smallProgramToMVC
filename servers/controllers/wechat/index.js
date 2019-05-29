const WechatConfig = require('../../config/wechat.config');
const helper = require('../../../utils/common/helper');
class Wechat {
    async getOpenId(req,res){
        try {
            // console.log(req.body);
            let appId = WechatConfig.appId;
            let secret = WechatConfig.appSecret;
            let { js_code } = req.body;
            let opts = {
                url:`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
            }
            let r1 = await helper.promiseReq(opts);
            r1 = JSON.parse(r1);
            // console.log(r1);
            res.json(r1);
        } catch (error) {
            console.log('api-error',error);   
            res.json('');
        }
    }
}
module.exports = new Wechat();