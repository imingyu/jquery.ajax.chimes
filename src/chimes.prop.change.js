/* Name:ajax.chimes.prop.change
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
    Button Loading风铃
    作者：mingyuhisoft@163.com
    日期：2016-7-4
    简介：在ajax发起后为某个button显示loading效果
    使用方法：
    1.显示调用风铃==>
    [html]
    <button type="button" class="btn-test">按钮</button>
    [js]
    $.ajax({
        type:"GET",
        url:"url",
        chimes:{
            ButtonLoading:{
                element:".btn-test",
                changeProps:{
                    innerHTML:"加载中..."
                }
            }
        }
    }).done(function(data){
        alert("success");
    });
    2.无需显示调用，风铃系统根据html属性自行判断添加风铃==>
    [html]
    <div id="container">
        <button type="button" data-chimes-key="123" data-chimes-rule="ButtonLoading">按钮</button>
    </div>

    [js]
    $.ajax({
        type:"GET",
        url:"url",
        chimes:{
            key:"123",
            contextElement:"#container"
        }
    }).done(function(data){
        alert("success");
    });
    */

    AjaxChimes.createChime({
        name:"PropChange",
        init:function () {
            this.element = null;
            this.oldProps = {};
        },
        getDefaultOptions:function(){
            return {
            };
        },
        changeButton:function(){
            var ops=this.options,
                element=this.element,
                self=this;
            if(typeof ops.changeProps ==="object"){
                for(var i in ops.changeProps){
                    self.oldProps[i]=element.prop(i);
                    element.prop(i,ops.changeProps[i]);
                }
            }
            self.oldProps.sid=self.id;
        },
        recovery:function(){
            var ops=this.options,
                recoveryProps=ops.recoveryProps || {},
                hasRecovery=[],
                element=this.element,
                self=this;
            if(typeof ops.changeProps ==="object"){
                for(var i in self.oldProps){
                    if(recoveryProps.hasOwnProperty(i)){
                        var recoveryValue=recoveryProps[i];
                        if(typeof recoveryValue ==="function"){
                            recoveryValue.call(element,self.oldProps[i]);
                        }else{
                            element.prop(i, recoveryValue);
                        }
                        hasRecovery.push(i);
                    }else{
                        element.prop(i,self.oldProps[i]);
                    }
                }
            }
            for(var i in recoveryProps){
                if(hasRecovery.indexOf(i)===-1){
                    var recoveryValue=recoveryProps[i];
                    if(typeof recoveryValue ==="function"){
                        recoveryValue.call(element);
                    }else{
                        element.prop(i, recoveryValue);
                    }
                }
            }
            self.oldProps=null;
            hasRecovery.length=0;
            hasRecovery=null;
        },
        install:function(){
            var ops=this.options,
                ajaxOptions=this.ajaxOptions,
                self=this;
            if(ops.element){
                this.element=$(ops.element);
                this.xhr.always(function(){
                    self.recovery();
                });
            }
        },
        run:function(){
            this.changeButton();
        },
        uninstall:function(){
            this.element=null;
        }
    });
}));