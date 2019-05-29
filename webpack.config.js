var webpack = require('webpack');
var ExtracTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var HotMiddleWareConfig = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'


//路径是相对于package.json所在的路径
var entry_map = {
    HotMiddleWareConfig,
    'index':'./public/index/index.js'
}

module.exports = {
    entry:entry_map,
    output:{
        path:path.resolve(process.cwd(),'dist/'),
        filename:'[name].js',
    },
    plugins:[
        new ExtracTextPlugin("[name].css"),
        new webpack.optimize.OccurenceOrderPlugin(),
        // 在 webpack 插件中引入 webpack.HotModuleReplacementPlugin
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    devtool:'eval-source-map',
    module:{
        loaders:[
            {
                test:/\.js[x]?$/,
                exclude:/(node_modules)|(global\/lib\/)/,
                loader:'babel-loader',
                query: {
                    presets: ['es2015']
                    // 如果安装了React的话
                    // presets: ['react', 'es2015']
                }
            },
            {
                test:/\.css$/,
                loader:ExtracTextPlugin.extract('style-loader','css-loader')
            },
            {
                test:/\.scss$/,
                //!代表先执行 ？是传递给loader的参数，?sourceMap表示使用sourceMap， js使用sourcemap通过devtool: sourcemap来指定。
                loader:ExtracTextPlugin.extract('style-loader','css-loader?sourceMap&-convertValues!sass-loader?sourceMap')
            },
            // image & font
            { test: /\.(woff|woff2|eot|ttf|otf)$/i, loader: 'url-loader?limit=8192&name=[name].[ext]'},
            { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url-loader?limit=8192&name=[name].[ext]'},
        ]
    },
    devServer:{
        host: 'localhost', //可选，ip
        port: 3000, //可选，端口
        contentBase:path.resolve(__dirname,'dist'), //可选，基本目录结构
        compress: true //可选，压缩
    }
}