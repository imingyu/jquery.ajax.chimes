import angular from "angular/angular.js";
var jquery = require("jquery/dist/jquery.js");

exports.angular = window.angular =angular;
window.jquery = window.jQuery = window.$ =jquery;
exports.jquery = jquery;


var bootstrap =require("bootstrap/dist/js/bootstrap.js");
var bootstrapCSS = require("bootstrap/dist/css/bootstrap.css");
exports.bootstrap = bootstrap;
exports.bootstrapCSS = bootstrapCSS;