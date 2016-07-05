;(function (factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'), window, document);
    } else {
        factory(jQuery, window, document);
    }
} (function ($, window, document, undefined) {
    'use strict';

    var arraySlice = Array.prototype.slice;

    /*
    ajax运行流程：
    1.初始化ajax配置参数；
    2.安装所有风铃；
    3.执行所有挂件的run事件；
    4.执行onSendBefore事件；
    5.开始发送请求；
    6.执行完成事件；
    7.卸载所有风铃；
     */

    function Chime(spec) {
        this.id = spec.id || "CHIME" + ("" + Math.random()).replace('.', '');
        this.name = spec.name;
        this.spec = spec;
        this.__xhr = spec.xhr;
        this.__ajaxOptions = spec.ajaxOptions;
        this.__orgAjaxOptions = spec.orgAjaxOptions;
        this.options = spec.options;

        for(var key in spec){
            if(!this.hasOwnProperty(key)){
                this[key]=spec[key];
            }
        }

        var __enabled = true,
            installed=false,
            uninstalled=false,
            destroyed=false;
        this.isEnabled = function () {
            return __enabled;
        };
        this.enable = function () {
            __enabled = true;
            if (typeof spec.enable === "function") {
                spec.enable.apply(this, arraySlice.call(arguments));
            }
            return this;
        };
        this.disable = function () {
            __enabled = false;
            if (typeof spec.disable === "function") {
                spec.disable.apply(this, arraySlice.call(arguments));
            }
            return this;
        };
        this.install= function () {
            if (!this.isEnabled()) return false;
            if(installed) return false;
            if(!this.constructor.enabled) return false;
            var spec = this.spec;
            installed=true;
            if(typeof spec.install==="function"){
                return spec.install.apply(this, arraySlice.call(arguments));
            }
        },
        this.uninstall= function () {
            if (!this.isEnabled()) return false;
            if(uninstalled) return false;
            uninstalled=true;
            this.__xhr = null;
            this.__ajaxOptions = null;
            this.__orgAjaxOptions = null;
            delete this.__xhr;
            delete this.__ajaxOptions;
            delete this.__orgAjaxOptions;
            var spec = this.spec;
            if(typeof spec.uninstall==="function"){
                return spec.uninstall.apply(this, arraySlice.call(arguments));
            }
        },
        this.destroy= function () {
            if(destroyed) return false;
            destroyed=true;
            var spec = this.spec;
            if(typeof spec.destroy==="function"){
                spec.destroy.apply(this, arraySlice.call(arguments));
            }
            //delete this.___xhr.chimeInstances[this.id];
            //delete this.__ajaxOptions.chimeInstances[this.id];
            delete this.spec;
            delete this.options;
            delete this.__xhr;
            delete this.__ajaxOptions;
            delete this.__orgAjaxOptions;
            AjaxChimes.destroyChime(this.name,this.id);
        }
        this.run= function () {
            if (!this.isEnabled() || !this.constructor.enabled){
                console.warn("风铃："+this.name+"已被禁用！");
                return false;
            }
            if (uninstalled){
                console.warn("风铃："+this.name+"已被卸载！");
                return false;
            }
            if (destroyed){
                console.warn("风铃："+this.name+"已被销毁！");
                return false;
            }
            var spec = this.spec;
            
            if(typeof spec.run=="function"){
                var result = spec.run.apply(this, arraySlice.call(arguments));
                return result;
            }
        }
    }

    var AjaxChimes = {};
    AjaxChimes.enabled = true;//是否启用风铃系统，说明此处可以集中控制，关闭后，设置的所有风铃将无效
    AjaxChimes.createChime = function (spec) {
        var Constructor = function (chimeOptions, xhr, ajaxOptions, orgAjaxOptions) {
            $.extend(spec,{
                ajaxOptions:ajaxOptions,
                xhr:xhr,
                orgAjaxOptions:orgAjaxOptions,
                options:$.extend(true, {}, Constructor.defaultOptions, chimeOptions)
            });
            Chime.apply(this,[spec]);
            
            this.constructor=Constructor;
        };
        Constructor.instances = {};//已经实例化的风铃
        Constructor.prototype.constructor = Constructor;
        
        Constructor.enabled=true;
        Constructor.enable=function(){
            Constructor.enabled=true;
            for(var incId in Constructor.instances){
                var inc = Constructor.instances[incId];
                if(!inc.isEnabled()){
                    inc.enable();
                }
            }
        };
        Constructor.disable=function(){
            Constructor.enabled=false;
            for(var incId in Constructor.instances){
                var inc = Constructor.instances[incId];
                if(inc.isEnabled()){
                    inc.disable();
                }
            }
        };
        if (spec.getDefaultOptions) {
            Constructor.defaultOptions = spec.getDefaultOptions();
        }
        AjaxChimes[spec.name] = Constructor;
        return Constructor;
    };
    AjaxChimes.destroyChime = function (chimeName, chimeId) {
        var chime = AjaxChimes[chimeName];
        if(chime && chime.instances[chimeId]){
            delete chime.instances[chimeId];
        }
    };
    AjaxChimes.enableChime = function (chimeName) {
        var chime = AjaxChimes[chimeName];
        if (chime && chime.enable) {
            chime.enable();
        }
    };
    AjaxChimes.disableChime = function (chimeName) {
        var chime = AjaxChimes[chimeName];
        if (chime && chime.disable) {
            chime.disable();
        }
    };
    AjaxChimes.setChimeDefaultOptions = function (chimeName, options) {
        var chime = AjaxChimes[chimeName];
        chime.defaultOptions = chime.defaultOptions || {};
        $.extend(true, chime.defaultOptions, options);
    };
    AjaxChimes.domAttrPrefix={
        key:"chimes-key",
        detail:"chimes"
    };
    AjaxChimes.convertToCamelCase = function(str){
        return str.replace("//-(/w)/g", function(all, letter){
          return letter.toUpperCase();
        });
    };
    AjaxChimes.transitionAttrToChimeOptions = function(dom){
        var result={},
            attrValue=dom.attr("data-"+AjaxChimes.domAttrPrefix.detail),
            domChimesOptions=AjaxChimes.parseJSON(attrValue);
        if(domChimesOptions){
            if($.isArray(domChimesOptions)){
                $.each(domChimesOptions,function(j, jtem){
                    if(jtem.hasOwnProperty("name")){
                        var chime = $.AjaxChimes[jtem.name];
                        result[jtem.name]=chime.transitionOptions(dom,jtem);
                    }
                });
            }else{
                if(domChimesOptions.hasOwnProperty("name")){
                    var chime = $.AjaxChimes[domChimesOptions.name];
                    if(chime.hasOwnProperty("transitionOptions")){
                        //风铃定义了options转换函数
                        result[domChimesOptions.name]=chime.transitionOptions(dom,domChimesOptions);
                    }else{
                        //未定转换函数，则默认吧dom传给element配置项，其他数据原样传递
                        result[domChimesOptions.name]=domChimesOptions;
                        result[domChimesOptions.name].element=dom;
                    }
                }
            }
        }
        return result;
    };
    AjaxChimes.parseJSON=function(str){
        if(!str) return null;
        try{
            if(JSON){
                return JSON.parse(str);
            }else{
                return $.parse(str);
            }
        }catch(ex){
            return eval('(' + str + ')');
        }
    };

    //风铃的安装与运行
    $.ajaxPrefilter(function (ops, orgOps, jqXhr) {
        //如果存在配置风铃，并且是启用了风铃系统
        if (ops.chimes && $.AjaxChimes.enabled !== false && ops.chimes.enabled !== false) {
            var needInstallChimes={},//本次ajax需要安装的风铃key列表
                beforeSendHandles = [],//定义一个beforeSend队列，保存所有的beforeSend事件
                ajaxBeforeSend = ops.beforeSend,//如果当前ajax请求配置了此设置（占据第一项beforeSend）
                ajaxChimes = {};//已经在此ajax上的风铃实例

            needInstallChimes=$.extend(needInstallChimes,ops.chimes);//从配置得到风铃列表
            /*
             * 从dom中得到风铃列表
             * 规则：
             * 1.查找contextElement下的所有没有指定key的dom；
             * 2.查找contextElement下的所有指定key=当前chimes key的dom；
             * 3.查找所有指定key=当前chimes key的dom；
             * */

            var key=''+ops.chimes.key,
                chimeElementList = [];
            if(ops.contextElement){
                var contextElement=$(ops.contextElement);
                if(contextElement.length>0){
                    //如果此次ajax定义了chimes key，则只从标注了key的dom获取风铃配置，否则将不从dom获取
                    if(key){
                        contextElement.find("[data-"+AjaxChimes.domAttrPrefix.key+"='"+key+"'][data-"+AjaxChimes.domAttrPrefix.detail+"],[data-"+AjaxChimes.domAttrPrefix.detail+"]:not([data-"+AjaxChimes.domAttrPrefix.key+"])");
                    }else{
                        contextElement.find("[data-"+AjaxChimes.domAttrPrefix.detail+"]:not([data-"+AjaxChimes.domAttrPrefix.key+"])");
                    }
                    //查找的列表也包含contextElement
                    chimeElementList.add(contextElement);
                }
            }else{
                chimeElementList = $("[data-"+AjaxChimes.domAttrPrefix.key+"='"+key+"'][data-"+AjaxChimes.domAttrPrefix.detail+"]");
            }
            chimeElementList.each(function(i,ele){
                var elementChimeOptions=AjaxChimes.transitionAttrToChimeOptions($(ele));
                if(elementChimeOptions){
                    for(var chimeName in elementChimeOptions){
                        if(needInstallChimes[chimeName]){
                            if($.isArray(needInstallChimes[chimeName])){
                                needInstallChimes[chimeName].push(elementChimeOptions[chimeName]);
                            }else{
                                var otherChimeOptions=needInstallChimes[chimeName];
                                needInstallChimes[chimeName]=[];
                                needInstallChimes[chimeName].push(otherChimeOptions);
                                needInstallChimes[chimeName].push(elementChimeOptions[chimeName]);
                            }
                        }else{
                            needInstallChimes[chimeName]=elementChimeOptions[chimeName];
                        }
                    }
                }
            });

            ops.chimeInstances = jqXhr.chimeInstances = ajaxChimes;//将风铃实例集合放置在ajax对象上
            ops.beforeSend = null;

            for (var chimeName in needInstallChimes) {
                var chime = $.AjaxChimes[chimeName],
                    chimeOptions = needInstallChimes[chimeName];
                if (chime && chime.enabled) {
                    var optionsList=[];
                    if($.isArray(chimeOptions)){
                        optionsList=chimeOptions;
                    }else{
                        optionsList.push(chimeOptions);
                    }
                    $.each(optionsList, function(i, opsItem){
                        var chimeInc = new chime(opsItem, jqXhr, ops, orgOps);
                        chimeInc.install();
                        chimeInc.run();

                        //将风铃的beforeSend事件插入到队列中
                        if (typeof ops.beforeSend === "function") {
                            beforeSendHandles.push(ops.beforeSend);
                            ops.beforeSend = null;
                        }
                        //缓存实例
                        ajaxChimes[chimeName] = ajaxChimes[chimeName] || [];
                        ajaxChimes[chimeName].push(chimeInc);
                        chime.instances[chimeInc.id] = chimeInc;
                    });
                    
                } else {
                    console.warn(chimeName + " 风铃不存在或不可用");
                }
            }

            //将beforeSend队列放入真正的beforeSend函数中
            var beforeSendCallBacks = $.Callbacks("once memory unique");
            beforeSendCallBacks.add(beforeSendHandles);
            ops.beforeSend = function (jqXhr, ops) {
                if (typeof ajaxBeforeSend === "function") {
                    //获取occupyFirstBeforeSend设置项，这项配置觉得ajax本身的beforeSend事件在何处（所有风铃之后或之前）执行，这有利于在beforeSendh中禁用某些风铃
                    if (ops.chimes.occupyFirstBeforeSend === true) {
                        var result = ajaxBeforeSend.apply(ops, [jqXhr, ops]);
                        if (result != false) {
                            beforeSendCallBacks.fireWith(ops, [jqXhr, ops]);
                        } else {
                            return false;
                        }
                    } else {
                        beforeSendCallBacks.fireWith(ops, [jqXhr, ops]);
                        return ajaxBeforeSend.apply(ops, [jqXhr, ops]);
                    }
                } else {
                    beforeSendCallBacks.fireWith(ops, [jqXhr, ops]);
                }
            };

            //最后绑定风铃引擎的ajax完成事件：后销毁所有风铃
            jqXhr.always(function(){
                $.each(ajaxChimes,function(i,item){
                    if($.isArray(item)){
                        $.each(item,function(j,jtem){
                            jtem.destroy();
                        });
                    }else{
                        item.destroy();
                    }
                });
            });
            console.log(jqXhr);
        }
    });

    $.AjaxChimes = AjaxChimes;
    if(typeof module !=="undefined" && typeof module.exports=="object"){
        module.exports = AjaxChimes;
    }
}));