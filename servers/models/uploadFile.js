const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
    fileInfo:String,
    filePath:String,
    fileType:Schema.Types.Number,
    fileInitDate:{
        type:Date,
        default:Date.now()
    },
    fileUpdateDate:{
        type:Date,
        default:Date.now()
    }
})

ModelSchema.statics = {
    fetch:(cb) => {
        return this.find({})
               .exec(cb)
    }
}

const Model = mongoose.model('uploadFile',ModelSchema);

module.exports = Model;