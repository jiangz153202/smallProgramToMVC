const mongoose = require('mongoose');
const dbURI = require('../datebase.config').dbURI;
console.log('print dbURL',dbURI);
exports.connect = () => {
    mongoose.connect(dbURI, (err) => {
        if(err){
            console.log('数据库连接失败',new Date().toLocaleTimeString());
        }else{
            console.log('数据库连接成功',new Date().toLocaleTimeString());
        }
    })
}

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});