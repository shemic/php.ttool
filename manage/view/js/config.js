/**
 * Produce for workbin-doing - PHP frame development system
 * http://produce.suwi.cn/
 *
 * @copyright Copyright (c) 2009-2011 Workbin development team CHINA Inc. (http://www.workbin.com)
 * @author smilewind(SuWi.bin)<dandeyu@sina.com>
 * @version $Id: config.script.js 2010-4-27 11:35 smilewind $
 */


/***************************
 * 使用说明：
 * $_c_d 全局数组 | $_c_v(d,v) 设置全局数组的值 | $_c_g(d,v) 设置全局变量的值 | $_c_u(d,g) 取消全局数组或者全局变量的值 | $_c_r(a,b) 取url参数
 * $_c_j(s) 加载js | $_c_c(s) 加载css | $_c_i(s) 加载图片 | $_c_f(s) 加载flash | $_c_e(e) 执行代码 | $_c_w(e) 执行弹出
 ***************************/


var $_c_d = [];
var $_c_v = function(d,v){$_c_d[d]=v};
var $_c_g = function(d,v){eval("window."+d+"='"+v+"'")};
var $_c_u = function(d,g){g=='global'?eval("delete window."+d+""):delete $_c_d[d]};
var $_c_r = function(a,b){if(!b) var b = location.href;var rs = new RegExp('[\&|\?]{1}'+a+'=([\\w]+)').exec(b);if(rs == null) return null;return rs[1];};
var $_c_j = function(s){if(!$_c_d['root']){document.write('not root is defined!');$_c_v('root','no');return}document.write('<script type="text/javascript" language="javascript" src="' +$_c_d['root'] + s + '.script.f-js"></script>');};
var $_c_c = function(s){if(!$_c_d['root']){document.write('not root is defined!');$_c_v('root','no');return}document.write('<LINK href="' + $_c_d['root'] + 'resource/css/' +s + '.css" type="text/css" rel="stylesheet">');};
var $_c_i = function(s){if(!$_c_d['root']){document.write('not root is defined!');$_c_v('root','no');return}return $_c_d['root']+'resource/img/' +s;};
var $_c_f = function(s){if(!$_c_d['root']){document.write('not root is defined!');$_c_v('root','no');return}return $_c_d['root']+'resource/swf/' +s;};
var $_c_e = function(e){return $_c_d[e]?eval($_c_d[e]):eval(e)};
var $_c_w = function(e){$_c_d[e]?$.alert($_c_d[e]):$.alert(e)};

/************************************
 * 最基本与最简单的自定义函数
 ************************************/

$_c_v('$','document.getElementById(arguments[1])');																					//快速获取id
$_c_v('jq','$(arguments[1])');																										//jq获取id
$_c_v('e','if(typeof(arguments[1]) == "string"){"\'"+escape(arguments[1])+"\'"}else{arguments[1]}');
$_c_v('u','unescape(arguments[1])');																								//加密解密
$_c_v('null','if(!arguments[1] || arguments[1] == "" || arguments[1] == "undefined"){true}else{false}');							//判断字符串是否为空
$_c_v('len','arguments[1].length');																									//获取字符串长度
$_c_v('os','if(navigator.userAgent.indexOf("MSIE")>0){1}else if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){2}else if(isSafari=navigator.userAgent.indexOf("Safari")>0){3}else if(isCamino=navigator.userAgent.indexOf("Camino")>0){4}else if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){4}else{0}');																	//获取浏览器版本
$_c_v('int','if(isNaN(arguments[1] = parseInt(arguments[1]))){0}else{arguments[1]}');												//转换为int型
$_c_v('go','location.href=arguments[1];');																							//跳转
$_c_v('time','var time = "";if(arguments[1] >= 86400){time += parseInt(arguments[1]/86400)+"天";arguments[1] = arguments[1]%86400;}if(arguments[1] >= 3600){time += parseInt(arguments[1]/3600)+"时";arguments[1] = arguments[1]%3600;}if(arguments[1] >= 60){time += parseInt(arguments[1]/60)+"分";arguments[1] = arguments[1]%60;}if(arguments[1] < 60 && arguments[1] > 0){time += arguments[1]+"秒";}time');																			//时间转换
$_c_v('debug','var str="";var o=arguments[1];for(k in o){if(typeof o[k]=="function"){str+=k+"= function \\n";}else{str += k+"="+o[k]+"\\n";}}alert(str);'); //debug
$_c_v('load','var onload=window.onload;if(typeof window.onload != "function"){window.onload = arguments[1];}else{window.onload = function() {onload();arguments[1]();}}');