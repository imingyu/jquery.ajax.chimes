;(function (factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'),require('AjaxChimes'), window, document);
    } else {
        factory(jQuery,jQuery.AjaxChimes, window, document);
    }
} (function ($, AjaxChimes, window, document, undefined) {
    'use strict';

    /*
    Loading风铃
    作者：mingyuhisoft@163.com
    日期：2016-7-4
    简介：在ajax发起前为某个element显示loading效果，依赖jquery.mloading.js(npm install jquery.mloading.js)
    */

    AjaxChimes.createChime({
        name:"Loading",
        install:function(){
            var ops=this.options,
                ajaxOptions=this.__ajaxOptions;
            if(ops.element){
                ajaxOptions.beforeSend=function(){
                    $(ops.element).mLoading(ops);
                }
                this.__xhr.always(function(){
                    $(ops.element).mLoading("destroy");
                });
            }
        }
    });
}));