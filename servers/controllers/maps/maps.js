/**
 * maps 函数
 */ 
const mapsModel = require('../../models/map');
const constant = require('../../../utils/constant');




class maps {
    //查询所有
    async getMapList(req,res,next){
        await mapsModel.find({},(err,maps)=>{
            if (err) {
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: err
                })
            }
            res.json({
                code: constant.RESULT.SUCCESS.code,
                msg: constant.RESULT.SUCCESS.msg,
                data: maps
            })
        })
    }

    // const mapSchema = new Schema({
    //     name:String,
    //     longitude : String,
    //     latitude : String,
    //     coordinate_axes : String,
    //     tags:Array,
    //     head_images : String,
    //     images: Array,
    //     messaged_on : Date
    // });
    async initMapsList(req,res,next){

        const docs = [],doc_length = 100;
        for (let index = 0; index < doc_length; index++) {
            let lng = '113'+(Math.random().toString()).substring(1,8),lat = '23'+(Math.random().toString()).substring(1,9)
            let element = {
                name:"地图点测试数据"+index,
                longitude:lng,
                latitude:lat,
                coordinate_axes:lng+','+lat,
                tags:[0,Math.floor(Math.random()*10 + 1)],
                head_images:"",
                images:[],
                messaged_on:(new Date)
            };
            docs.push(element);
        }

        await mapsModel.collection.insertMany(docs,onInsert);
        
        function onInsert(err,docs){
            if(err){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: err
                })
            }else{
                res.json({
                    code: constant.RESULT.SUCCESS.code,
                    msg: constant.RESULT.SUCCESS.msg,
                    data: doc_length+' potatoes were successfully stored.'
                })
            }
        }
        
    }

    async removeMaps(req,res,next){
        await mapsModel.remove({},(err) =>　{
            if(err){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: err
                })
            }else{
                res.json({
                    code: constant.RESULT.SUCCESS.code,
                    msg: constant.RESULT.SUCCESS.msg,
                    data: "清除成功"
                })
            }
        })
    }

    async addMaps(req,res,next){
        let maps = req.body;
        await mapsModel.create(maps,(err,result)=>{
            if(err){
                res.json({
                    code: constant.RESULT.FAILD.code,
                    msg: constant.RESULT.FAILD.msg,
                    data: err
                })
            }else{
                res.json({
                    code: constant.RESULT.SUCCESS.code,
                    msg: constant.RESULT.SUCCESS.msg,
                    data: "添加成功"
                })
            }
        })
    }

}

module.exports = new maps();