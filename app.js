var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/web/index');
var userRouter = require('./routes/web/users');
var apiRouter = require('./routes/api/api');
//var errorRouter
const db = require('./servers/config/db');
const constant = require('./utils/constant');

var app = express();

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,username,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})


//链接数据库
db.connect();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);  
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/public/uploads/*', function (req, res) {
  res.sendFile( __dirname + "/" + req.url );
  console.log("Request for " + req.url + " received.");
})


app.use('/', indexRouter);
app.use('/user', userRouter);
//api路由
apiRouter(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('share/error');
});

console.log('服务已开启...',new Date().toLocaleTimeString());
//module.exports = app;
var debug = require('debug')('food-express-mvc:server'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

// Environment sets...

// module.exports = app; 这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});