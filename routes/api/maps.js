//用户子路由
const express = require('express');
const Maps = require('../../servers/controllers/maps/maps');
const router = express.Router();

router.post('/init',Maps.initMapsList)
router.post('/info',Maps.getMapList)
router.post('/removeAll',Maps.removeMaps)
router.post('/add',Maps.addMaps)
module.exports = router;