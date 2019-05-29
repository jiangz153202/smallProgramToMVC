//用户子路由
const express = require('express');
const WechatFile = require('../../servers/controllers/wechat');
const router = express.Router();

router.post('/openid',WechatFile.getOpenId);

module.exports = router;