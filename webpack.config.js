var config = {},
    siteConfig = require("./config"),
    _ = require("lodash");

_.extend(config, {
    entry: {
        "dist/a": "./src/a.js"
    },
    output: {
        path: process.cwd(),
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, loader: 'babel' },
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap' },
            { test: /\.(png|jpg)$/, loader: 'file?limit=8192' }
        ]
    },
    resolve: {
        //查找module的话从这里开始查找
        //root: 'E:/github/flux-example/src', //绝对路径
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        //extensions: ['', '.js', '.json', '.scss'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            jquery: 'jquery/dist/jquery.js',
        }
    }
});

if (siteConfig.env === "dev") {
    require("./webpack.dev")(config);
}else if(siteConfig.env === "pro"){
    require("./webpack.webpack.product")(config);
}
module.exports = config;