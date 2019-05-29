//用户子路由
const express = require('express');
const uploadFile = require('../../servers/controllers/file/file');
const router = express.Router();

router.post('/files',uploadFile.insertFile)
router.post('/fetch',uploadFile.fetchFile)

module.exports = router;