var config = {},
    siteConfig = require("./config"),
    webpack=require("webpack"),
    _ = require("lodash"),
    ExtractTextPlugin=require("extract-text-webpack-plugin");

_.extend(config, {
    entry: {
        "lib": "./src/scripts/libs.js",
        "a": "./src/a.js"
    },
    output: {
        path: "./dist",
        filename: 'scripts/[name].js',
        chunkFilename:'scripts/chunk-[chunkname].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.js$/, loader: 'babel' },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
            { test: /\.(gif|jpg|png)\??.*$/, loader: 'url-loader?limit=10000&name=images/[name].[ext]' },
            { test: /\.(woff|eot|ttf)\??.*$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
            { test: /\.(svg)\??.*$/, loader: 'url-loader?limit=10000&name=svg/[name].[ext]' }
        ]
    },
    resolve: {
        //查找module的话从这里开始查找
        //root: 'E:/github/flux-example/src', //绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        //extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
        }
    },
    externals:{
        jquery: 'window.jquery',
        "$": 'window.jquery',
        "jQuery": 'window.jquery',
        angular: 'window.angular'
    },
    plugins:[
        new ExtractTextPlugin("styles/[name].css")
    ]
});

if (siteConfig.env === "dev") {
    require("./webpack.dev")(config);
}else if(siteConfig.env === "pro"){
    require("./webpack.product")(config);
}
module.exports = config;