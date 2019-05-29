const mongoose = require('mongoose');
const Schema    = mongoose.Schema;

const mapSchema = new Schema({
    name:String,
    address:String,
    longitude : String,
    latitude : String,
    coordinate_axes : String,//坐标轴
    discount:Number,
    number_92:Array,
    number_95:Array,
    tags:Array,
    head_images : String,
    images: Array,
    messaged_on : Date,
    isDeleted:Boolean,
    updated_on:Date
});


mapSchema.pre('save',(next) => {
    var currentDate = new Date();
    this.messaged_on = currentDate;
    this.isDeleted = false;
    next()
})

const maps = mongoose.model('maps',mapSchema);


module.exports = maps;
