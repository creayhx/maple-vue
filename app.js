var express = require('express'); //express模版
var bodyParser = require('body-parser'); //处理URL数据
var cookieParser = require('cookie-parser')//处理cookie
var session = require('express-session'); //会话 session
var compress = require('compression');//文件压缩
var port = process.env.port || 81;//端口
var app = express();//调用模版

app.use(compress());// 调用文件压缩 压缩文件

app.set('views','./dist');  //设置模版默认路径
app.engine('.html',require('ejs').renderFile);
app.set('view engine','html');//设置渲染模版
app.use(bodyParser.urlencoded({ extended: true }));//获取提交的数据
app.use(bodyParser.json());//获取提交的json数据
app.use(express.static('./dist'));// 设置静态目录
app.use(cookieParser()); //获取cookie
app.use(session({
	secret : 'my', //随意字符串
	resave: false, //是否重保存
	saveUninitialized: true, //保存初始化
	cookie: {maxAge: 1000 * 60 *60}, //保留时间
}));


app.disable('x-powered-by'); // 禁止显示模版名称
require('./app/router')(app); //路由事件
app.listen(port);  //监听端口
console.log('服务启动成功');
// if('development' === app.get('env')){ //debug 调试信息
// 	app.set('showStackError',true);
// 	app.use(logger(':method :url :status'));
// 	app.locals.pretty=true;
// 	mongoose.set('debug',true);
// }