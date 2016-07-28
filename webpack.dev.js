module.exports=function(webpackConfig){
    var webpackUserConfig = require("./webpack.user"),
        webpack=require("webpack");

    var entry = webpackConfig.entry,
        hotServerUrl = webpackUserConfig.hotServerUrl || "http://localhost:8080";
    //热替换
    var hotModule = [
        'webpack-dev-server/client?' + hotServerUrl,
        "webpack/hot/dev-server"
    ];
    Object.keys(entry).forEach(function (key) {
        var value = entry[key];
        if (Array.isArray(value)) {
            entry[key] = hotModule.concat(entry[key]);
        } else {
            var arr = [];
                arr = hotModule.concat(arr);
                arr.push(value);
                entry[key] = arr;
            if(value.indexOf("libs.js")===-1){
                
            }
        }
    });
    if (!webpackConfig.devServer) {
        webpackConfig.devServer = {};
    }
    webpackConfig.devServer.hot = true;
    webpackConfig.devServer.contentBase = process.cwd();
    webpackConfig.plugins = webpackConfig.plugins || [];
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
};