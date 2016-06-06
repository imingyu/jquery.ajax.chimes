(function (factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'), window, document);
    } else {
        factory(jQuery, window, document);
    }
} (function ($, window, document, undefined) {
    'use strict';
    
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
        this.name = spec.name;
        this.spec = spec;
        var __enabled = true;
        this.isEnabled = function () {
            return __enabled;
        };
        this.enable = function () {
            __enabled = true;
            if (typeof spec.enable === "function") {
                spec.enable.call(this);
            }
        };
        this.disable = function () {
            __enabled = false;
            if (typeof spec.disable === "function") {
                spec.disable.call(this);
            }
        };
    }
    Chime.prototype = {
        constructor: Chime,
        install: function () {
            var ops = this.spec;
        },
        uninstall: function () {
        },
        run: function () {
        },
        destroy: function () {
        }
    };


    var AjaxChimers = {};
    AjaxChimers.createChime = function (spec) {
        var Constructor = function () {
        };
        Constructor.prototype = new Chime();
        Constructor.prototype.constructor = Constructor;

        if (Constructor.getDefaultOptions) {
            Constructor.defaultOptions = Constructor.getDefaultOptions();
        }
        AjaxChimers[spec.name] = Constructor;
    };
    AjaxChimers.destroyChime = function (chimeName) {
        var chime = AjaxChimers[chimeName];
        if (chime && chime.destroy) {
            chime.destroy();
            delete AjaxChimers[chimeName];
        }
    };
    AjaxChimers.enableChime = function (chimeName) {
        var chime = AjaxChimers[chimeName];
        if (chime && chime.enable) {
            chime.enable();
        }
    };
    AjaxChimers.disableChime = function (chimeName) {
        var chime = AjaxChimers[chimeName];
        if (chime && chime.disable) {
            chime.disable();
        }
    };
    $.AjaxChimers = AjaxChimers;
}));