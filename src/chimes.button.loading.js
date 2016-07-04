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
    Button Loading风铃
    作者：mingyuhisoft@163.com
    日期：2016-7-4
    简介：在ajax发起后为某个button显示loading效果
    */

    AjaxChimes.createChime({
        name:"ButtonLoading",
        button:null,
        oldButtonProps:{},
        getDefaultOptions:function(){
            return {
                changeProps:{
                    "disabled":true
                }
            };
        },
        changeButton:function(){
            var ops=this.options,
                button=this.button,
                oldButtonProps=this.oldButtonProps;
            if(typeof ops.changeProps ==="object"){
                for(var i in ops.changeProps){
                    oldButtonProps[i]=button.prop(i);
                    button.prop(i,ops.changeProps[i]);
                }
            }
        },
        reductionButton:function(){
            var ops=this.options,
                button=this.button,
                oldButtonProps=this.oldButtonProps;
            if(typeof ops.changeProps ==="object"){
                for(var i in oldButtonProps){
                    button.prop(i,oldButtonProps[i]);
                    delete oldButtonProps[i];
                }
            }
        },
        install:function(){
            var ops=this.options,
                ajaxOptions=this.__ajaxOptions,
                self=this;
            if(ops.button){
                this.button=$(ops.button);
                this.__xhr.always(function(){
                    self.reductionButton();
                });
            }
        },
        run:function(){
            this.changeButton();
        },
        uninstall:function(){
            //this.button.removeAttr("data-bl-");
            delete this.button;
        }
    });
}));