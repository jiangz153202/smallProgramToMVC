//用户子路由
const express = require('express');
const User = require('../../servers/controllers/user/user');
const router = express.Router();

router.post('/register',User.register)
router.post('/singIn',User.signInByUserName)
router.post('/userinfolist',User.getUserInfoList)
router.post('/auth',User.getUserAndCreateToken)
router.post('/remove',User.deleteAllByUserModel)
router.post('/register2openid',User.register2openid);
router.post('/update2register',User.update2register);
module.exports = router;