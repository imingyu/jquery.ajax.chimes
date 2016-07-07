/* Name:ajax.chimes.render.templete
 * Author:mingyuhisoft@163.com
 * Github:https://github.com/imingyu/jquery.ajax.chimes
 */
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
    模板渲染风铃：在ajax完成后对数据进行渲染
    渲染引擎必须实现render接口，风铃会在ajax结束后，将执行render(data,templeteStr)
    */

    var RenderTemplete = AjaxChimes.createChime({
        name:"RenderTemplete",
        element: null,
        getDefaultOptions:function () {
            return {
                append:false//是否以append方式将渲染后的内容放置在dom中
                //onRendered:function(element,data,html,json){},render结束后执行的回调函数，data代表datafilter后的json
            };
        },
        install:function(){
            var ops=this.options,
                self=this;
            if(ops.element){
                this.element=$(ops.element)
            }
        },
        run:function(){
            var ops=this.options,
                self=this;
            self.xhr.always(function(json){
                var templete="",
                    engine=null,
                    data=null;
                if(typeof ops.engine==="string"){
                    engine=RenderTemplete.engines[ops.engine];
                }else if(typeof ops.engine==="function"){
                    engine=ops.engine;
                }
                
                if(engine){
                    if(ops.templete){
                        templete=ops.templete;
                    }else if(ops.templeteElement){
                        templete=$(ops.templeteElement).html();
                    }

                    if(typeof ops.dataFilter==="function"){
                        data = ops.dataFilter.call(self,json);
                    }else{
                        data=json;
                    }
                    var html = engine.call(self,data,templete);
                    if(ops.append){
                        self.element.append(html);
                    }else{
                        self.element.empty().append(html);
                    }
                    if(typeof ops.onRendered==="function"){
                        ops.onRendered.call(this,self.element,data,html,json)
                    }
                }
            });
        },
        uninstall:function(){
            this.element=null;
        },
        destroy:function(){
            this.element=null;
        }
    });
    RenderTemplete.engines={};//渲染引擎列表
    RenderTemplete.registerEngine = function (name, renderHandler) {
        RenderTemplete.engines[name]=renderHandler;
    }
}));