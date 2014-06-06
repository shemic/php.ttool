/************************************
 * jq插件区
 ************************************/

(function($)
{
	
	$.extend({
		//$().loading()的简化版
		loading:function (options)
		{
			$().loading(options);
		},
		//$().overlay()的简化版，现在可以$.overlay();这么用。
		overlay:function (options)
		{
			$().overlay(options);
		},
        //时间戳
        getTime:function ()
        {
            var time = new Date();
            return time.getTime();
        },
		//$().loadsize();的简化版
		loadsize : function () 
		{
			return $().loadsize();
		},
		esc : function (e)
		{
			// == 27
			if (e.keyCode) 
			{
				$('.overlay,.msg,.box').fadeOut(300,function(){$('.overlay,.msg,.box').remove();$(document).unbind('keydown');});
				return false;
			}
		},
		//用$.tip() 代替$().tip();
		tip : function(str, time, url)
		{
			$().tip(str, time, url);
		},
		//定时器
		timing : function ()
		{
			var now = +new Date;
			for(k in $.que) 
			{
				if(now > $.que[k]) 
				{
					$('.msg[serial='+k+'],.overlay[serial='+k+']').remove();
				}
			}
			if($('.msg').length == 0) 
			{
				clearInterval(ti);	//都消失时停止定时器
				ti = undefined;
			}
		},
		//ajax访问网站
		form : function(rel,func,pre)
		{
			var e = $(".postForm[rel="+rel+"]");
			var url = e.attr('action');
			if(!url)
			{
				$.alert('url undefined',pre);
			}
			if(e.attr('send') != 'ajax')
			{
				e.iframeSubmit({cb:$_c_e('e',func),submit:1});
				return;
			}
			var data = {};
			$(".postForm[rel="+rel+"] .post").each(function(i){if($(this).attr('id')){eval('data.'+$(this).attr('id')+'='+$_c_e('e',$(this).val()));return $(this).check({func:pre})}})
			
			if($_c_d['status'] == false)
			{
				$_c_v('status',true);
				return;
			}
			$.query(url,data,func);
		},
		query : function(url,data,func)
		{
			$.post(url+'.ajax',data,func);
		},
		//html代码过滤
		txt : function()
		{
			return $(this).html().replace(/<\/?[^>]*>/g,'').replace(/[ | ]*\n/g,'\n').replace(/\n[\s| | ]*\r/g,'\n');
		},
		serial : 0,	//做为覆盖层和提示层的编号,每次+1
		que : {}	//定时器队列,如{1:1245778952,4:1245778958}
	});

	/**
	 * 对复选框的操作.action可以是choose,cancel,reverse三种,对应全选,全取消,反选三种.默认全选.参数写错归于reverse
	 * 例: $('input[type=checkbox]').checkbox();	//全选
	 *	$('input[type=checkbox]').checkbox('reverse');	//反选
	 */
	$.fn.checkbox = function (action)
	{
		if(!action) action = 'choose';
		this.each(function (i, e){
			if(action=='choose') {
				e.checked = true;
			}else if(action=='cancel') {
				e.checked = false;
			}else{
				e.checked = !e.checked;
			}
		});
		return this;
	},
	
	/**
	 * 数据错误时进行提示
	 * 例: $('input').status('数据错误',false);	//进行验证
	 *
	 */
	$.fn.status = function (t,f)
	{
		$(this).focus();
		$_c_v('status',false);
		f ? $.alert(t,f) : $(this).tip({str:t,time:1000,place: [120,'middle']});
		//$(this).val('');
	},

    /**
     * 对iframe高度进行控制
     * 例: 
     */
    $.fn.iframe = function ()
    {
        if(!$(this).attr('id')) return;
        var frame = document.getElementById($(this).attr('id'));
        var page = document.frames ? document.frames[$(this).attr('id')].document : frame.contentDocument;
        if(frame != null && page != null)
        {
            frame.height = page.body.scrollHeight;
        }
    }
	
	/**
	 * 对数据进行监控
	 * 例: $('input').monit();
	 *
	 */
	$.fn.monit = function (c)
	{
		if(!$(this).attr('monit')) return;

	},

	/**
	 * 对数据进行验证
	 * 例: $('input').check();	//进行验证 需要有以下属性 check="1,2" lang 
	 *
	 */
	$.fn.check = function (c)
	{
		if(!$(this).attr('check')) return;

		//设置参数的默认值
		p = $.extend({
			url: false,		//验证地址
			func: false	//回调函数名称
		}, c || {});


		var d = $(this).attr('check').split(',');
		if(d[0])
		{
			//不能为空
			if($_c_e('null',$(this).val()))
			{
				$(this).status($(this).attr('lang')+'不能为空',p.func);
				return false;
			}
		}
		if(d[1])
		{
			//验证相等
			if($(d[1]).val() != $(this).val())
			{
				$(this).status($(this).attr('lang')+'不匹配',p.func);
				return false;
			}
		}
		if(d[2])
		{
			//验证正则
			var reg = '';
			var txt = '';
			switch(d[2])
			{
				case 'chi'://中文验证
					reg = /^[\u4e00-\u9fa5]*$/g;
					txt = '必须为中文';
					break;
				case 'acc'://账户验证
					reg = /^[a-zA-Z0-9_]{3,16}$/;
					txt = '只能是英文和数字,字符在3-16之间';
					break;
				case 'mail'://邮箱验证
					reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					txt = '格式不对,参考格式:XXXX@XXX.XXX';
					break;
				case 'mobile'://手机验证
					reg = /^1\d{10}$/;
					txt = '号码输入有误';
					break;
				case 'number'://手机验证
					reg = /^-?\\d+$/;
					txt = '不是一个整数';
					break;
			}
			if(!$(this).val().match(reg))
			{
				$(this).status($(this).attr('lang')+txt,p.func);
				return false;
			}
		}
		if(d[3])
		{
			if($_c_d['status_url'] == false && p.func)
			{
				$(this).status($(this).attr('lang')+'已存在',p.func);
				$_c_u('status_url');
				return false;
			}
			//验证数据库中是否存在.
			var $status = $(this);
			$.query(p.url,{val:$(this).val(),check:d[3]},function(t)
			{
				if(t == -1)
				{
					$status.tip({str:$status.attr('lang')+'已存在',time:1000,place: [120,'middle']});
					$_c_v('status_url',false);
					return false;
				}
				else
				{
					$_c_v('status_url',true);
				}
			});
		}
		return true;
	},
	/**
	 * 禁止或者激活表单元素。
	 * example: 
	 * 1.禁止或激活整个表单：$('form').disable();	$('form').disable(false);
	 * 2.禁止或激活某些元素 $('input').disable();
	 */
	$.fn.disable = function (action)
	{
		if(action == undefined) action = true;
		var items = this;
		if($(this).attr('tagName') == 'FORM')
		{
			items = this.find('input[type=text],input[type=radio],input[type=checkbox],textarea,select');
		}
		items.each(function (i,e)
		{
			e.disabled = action;
		});
		return this;
	},
	/**
	 * 获取checkbox的值.mod可以是字符串'array'或'str',空参数或写错参数都归为str方式.
	 * 例: var val = $('input[type=checkbox]').checkboxVal();
	 */
	$.fn.checkboxVal = function (mod)
	{
		if(!mod) mod = 'str';
		var array = new Array(), str = '';
		this.each(function (i, e)
		{
			if(mod=='array')
			{
				if(e.checked) array.push(e.value);
			}
			else
			{
				if(e.checked) str += e.value+',';
			}
		});
		if(mod=='array') return array;
		if(!str) return '';
		return str.substring(0, str.length - 1);
	},

	/**
	 * 生成验证数据保存的对象
	 *
	 */
	$.fn.createCheck = function ()
	{
		$(this).prepend('<input type="hidden" name="'+$(this).attr('name')+'_check" value="'+$(this).attr('check')+'" style="display:none;"/>');
	},

	/**
	 * iframe方式提交表单,当有图片上传时.如果有回调函数,PHP需要这样返回
	 * if($_GET['cb']) {
		exit("<script>top.{$_GET['cb']}('$data')</script>");
	   }
	 */
	$.fn.iframeSubmit = function (ob)
	{
		//设置参数的默认值
		p = $.extend({
			debug: 0,		//设为1会显示iframe
			url: 'javascript:;',	//上传地址
			cb: null,		//回调函数名称,不能用匿名函数形式
			submit: 0		//是否显式提交,如果不是写在表单的提交事件中则需设为1
		}, ob || {});
		if(p.url == 'javascript:;') p.url = this.attr('action');
		if(p.cb) 
		{
			var temp = p.cb.toString().match(/function[\ ]*([\w]+)/);
			$(this).prepend('<input type="hidden" name="function" value="'+temp[1]+'" style="display:none;"/>');
		}
		if(!p.debug)
		{
			if(!$('iframe[name=uploadIframe]').length)
			{
				$(this).prepend('<iframe name="uploadIframe" style="display:none;"></iframe>');
			}
			$(this).attr('target', 'uploadIframe');
		}
		$(this).get(0).encoding = 'multipart/form-data';
		$(this).attr('action', p.url + '.ajax');
		if(p.submit) $(this).submit();
	}
	//一.简化用法
	//$.tip('2秒后自动消失');
	//$.tip('0.5秒后消失',500);
	//$.tip('不自动消失',0);	//按esc键消失,或者调用$.tip('close');
	//$.tip('2秒后自动转到百度,如果按esc键马上就跳转','http://www.baidu.com');	//时间参数和网址参数顺序可对调,因此不需要写成$.tip('内容',2000,url);
	//二.复杂用法.详细可设置请查看设置参数默认值部分,可任意混合设定
	//$.tip({str:'红色文字',color: '#F00'});
	//$.tip({str:'灰色背景',background: '#ccc'});
	//$.tip({str:'透明度设定',opacity: .5});
	//$.tip({str:'透明度和内间距设置',opacity: .5,padding:'6px 20px'});
	//$.tip({str:'不显示覆盖阴影层',overlay:false});
	//$.tip({str:'显示在上方的中间',place: ['center','top']});
	//$.tip({str:'显示在左上方',place: ['left','top']});
	//$.tip({str:'任意位置',place: [100,'top']});
	//三.以上的所有用法都是针对全局显示的,其实都可以为某个元素局部显示,并且可为多个元素显示
	//$('#blogDiv,#replyDiv,#photoDiv').tip('载入中,请稍候');	//其实这种效果使用loading更方便一些.
	//$('#blogDiv,#replyDiv').tip('close');	//只关闭日志与评论部分的提示,photo部分仍然显示
	//还有太多例子了,总之看着参数随意组合吧.
	$.fn.tip = function(options,time,url)
	{
		//简化的用法,例如$('div').tip('信息');
		if(typeof options != 'object' && options != 'close') 
		{
			var options = {str: options};
			if(typeof time == 'number') options.time = time;
			if(typeof time == 'string') options.url = time;
			if(typeof url == 'number') options.time = url;
			if(typeof url == 'string') options.url = url;
		}
		
		
		//设置参数的默认值
		var p = $.extend({
			str:'&nbsp;',					//内容
			time:2000,						//延时自动消失,单位为毫秒,设为0不消失,按esc键时才消失
			url:'',							//提示消失后转向的url
			color: '#666',					//字体颜色
			background: '#fff',				//背景
			border: '2px dashed #bababa',	//边框
			fontloadsize: '12px',				//字体大小
			overlay: false,					//是否带覆盖层阴影
			textAlign: 'left',				//对齐方式
			zIndex: 1500,					//z轴
			opacity: 0.2,					//背景透明度,如果overlay设为真
			padding: '3px 40px',			//内间距
			place:['center','middle']		// ['left','top']或[150,400]
		}, options || {});
		
		var scope = this.attr('tagName') ? 1 : 0;
		this.each(function (i, e)
		{
			var e = scope ? $(e) : $('body');
			if(options=='close')
			{
				return $('.overlay[serial='+e.attr('serial')+'], .msg[serial='+e.attr('serial')+']').remove();
			}
			//取页面尺寸与偏移信息
			var ps = scope ? e.loadsize() : $.loadsize();
			
			//给层编号
			if(e.attr('serial')) 
			{
				var serial = e.attr('serial');
			}
			else
			{
				var serial = ++$.serial;
				e.attr('serial', serial) ;
			}
			
			var jq = $('.msg[serial='+serial+']');
			//创建容器
			if(!jq.length) 
			{
				var msg = '<div class="msg" serial="'+serial+'" style="position:absolute;display:none;"></div>';
				$('body').append(msg);
				jq = $('.msg[serial='+serial+']');
			}
			
			//数字转成字符串
			if(typeof p.str == 'number') p.str += '';
		
			var leng = p.str.replace(/[^\x00-\xff]/g, "**").length;	//字符串真实长度
			if(leng > 40) jq.width(200);
			jq.html(p.str);
			
			jq.css('padding',p.padding).css('z-index',p.zIndex).css('color',p.color).css('background',p.background)
			.css('border',p.border).css('text-align',p.textAlign).css('font-loadsize',p.fontloadsize);
			//创建覆盖层
			if(p.overlay)
			{
				if(scope) e.overlay(p);
				else $().overlay(p);
			}
				
			//开始定位
			var top = 0; var left = 0; var jqw = jq.outerWidth(); var jqh = jq.outerHeight();
			if(p.place[0] == 'center') left = (ps.w - jqw)/2;
			else if(p.place[0] == 'left') left = 10;
			else if(p.place[0] == 'right') left = ps.w - jqw - 20;
			else left = p.place[0];
			
			if(p.place[1] == 'middle') top = (ps.h - jqh)/2;
			else if(p.place[1] == 'top') top = 5;
			else if(p.place[1] == 'bottom') top = ps.h - jqh;
			else top = p.place[1];
			
			//显示
			jq.css('top',top+ps.y).css('left', left+ps.x).fadeIn('fast');
			
			
			if(p.time != 0) 
			{
				//加入定时器队列
				$.que[serial] = +new Date + p.time;
				
				if(typeof ti == 'undefined') 
				{	//一定要判断,不能会有多个定时器同时转动
					ti = setInterval($.timing, 100);
				}
			}
			if(p.url && p.time > 0) setTimeout("location.href='"+p.url+"'", p.time);
		});
		
		//按esc、回车、c键退出
		$(document).keydown(function (e)
		{
			if(p.url) 
			{
				setTimeout("location.href='"+p.url+"'", 100);
			}
		});
		$(this).focus();
		return this;
	}
	/**
	 * 弹出框，用于比较复杂的内容，特别是ajax载入表单，窗口
	 * 例：$.box({url: '/blog/form/34', width: 580, show:function (){alert('载入成功'}});
	 * 看着参数自由组合吧,不想写一大堆例子了
	 * 这个框组合起来可以实现confirm,alert等特定应用,当然会有简化版$.confirm, $.alert出现
	 */
	$.box = function (options)
	{
		if(options == 'close') return $('.overlay, .box').fadeOut(300,function(){$('.overlay, .box').remove()});//非手工关闭方式暂不支持关闭回调
		//参数默认值
		var p = $.extend({
			width: 600,
			height: 0,					//设为0则自动调整高度,不出现滚动条
			overlay: true,				//是否使用覆盖阴影
			border:'#eeeeee',				//整体的边框颜色
			background: '#fff',
			title: '',					//如果为空,不显示标题栏
			drag: true,					//是否可拖拽，需要drag插件，如果没有也不会报错
			url: '',					//ajax载入内容
			show:function(){},			//显示时执行的函数
			close:function(){},			//关闭时执行的函数
			str: '',					//显示的内容,与url参数不共存
			closeBtn: true,				//是否需要右上角关闭图标
			closeImg: 1,				//关闭图标图片
			buttons: [],				//按钮组,每个按钮是{text:'确定',handler:fn}形式
			buttonAlign: 'center',		//按钮置中(或left,right)
			buttonClass: 'mine-right-model-button',		//按钮的class
			style: '',					//主容器的css设置
			titleStyle:'',				//标题栏css设置
			titleImg:1					//标题栏背景设置
		}, options || {});
		
		//创建覆盖层
		if(p.overlay) $.overlay({opacity:0.2});
		
		//加入box
		if($('.box').length) $('.box').remove();
		$('body').append('<div class="box"></div>');
		var box  = $('.box');
		
		//box的调整
		box.css({position:'absolute',visibility:'hidden',overflow:'hidden',width:p.width,zIndex:99,fontloadsize:'12px',color:'#666',
			background: p.background,border:'5px solid '+p.border+'',padding: '20px 6px 10px 6px',overflowY:p.overflow});
		if(p.height) box.height(p.height);
		box.find('select').css({display:'none'});
		if(p.style) 
		{
			box.attr('style',box.attr('style') + ';' + p.style)
		}
		
		
		//加入关闭功能
		$(document).unbind('keydown');
		$(document).keydown(function (e)
		{
			if (e.keyCode == 27)
			{
				$('.overlay, .box').fadeOut(300,function(){$('.overlay, .box').remove()});
				p.close.call();
			}
		});	
		if(p.closeBtn) 
		{
			box.prepend('<a class="boxClose" href="javascript:;" title="点击或按esc键关闭"><img style="display:none;" src="'+$_c_i('close/'+p.closeImg)+'.gif"/></a>');
			$('.boxClose').css({position:'absolute',left:p.width - 5,top:5,zIndex:100,color:'#F00'}).click(function ()
			{
				$('.overlay, .box').fadeOut(300,function(){$('.overlay, .box').remove()});
				p.close.call();
			}).find('img').css('border','none');
			if (box[0].scrollHeight > box[0].offsetHeight) 
			{	//如果有滚动条,图标位置左移一点
				$('.boxClose').css('left', p.width-20);
			}
		}
		
		//加入标题栏
		if(p.title) 
		{
			box.prepend('<div class="boxTitle">'+p.title+'</div>');
			var title = box.find('.boxTitle');
			var titlePos = {position:'absolute',left:0,top:0,height:16,width:box.innerWidth(),background:'#000',
				borderTop:box.css('borderTop'),fontloadsize:'14px',color:'#fff',fontWeight:'bold',padding:4};
			if(p.titleImg)
			{
				titlePos.backgroundImage = 'url('+$_c_i('back/title'+p.titleImg+'.jpg')+')';
				titlePos.backgroundRepeat = 'repeat-x';
				titlePos.backgroundPositionY = 'top';
			}
			title.css(titlePos);
			box.css({borderTop:0,paddingTop:parseInt(box.css('paddingTop')) + 15});
			//$('.boxClose').css('top',10 + $_c_e('int',title.css('borderTop')));
			if(p.titleStyle)
			{
				title.attr('style',title.attr('style') + ';' + p.titleStyle)
			}
		}
		
		//加入按钮组
		if(p.buttons.length) 
		{
			box.append('<div class="boxBtn" style="margin-top: 16px;text-align:'+p.buttonAlign+';"></div>');
			
		}
		for(k in p.buttons) 
		{
			box.find('.boxBtn').append('<button style="margin:0 5px;float:none;display:inline;">'+p.buttons[k].text+'</button>')
				.find('button:last').click(p.buttons[k].handler);
		}
		
		if(p.buttonClass) box.find('.boxBtn button').addClass(p.buttonClass);
		
		//执行善后工作,自动置中. 显示box,ie6下select的处理
		var epilogue = function ()
		{
			box.center();	//自动置中
			box.css('visibility','visible');//先隐藏再显示,不然在IE中定位时窗口会从左边闪到中间,用透明度来隐藏比display好,不影响定位
			box.find('select').show();
			if(!box.drag || !p.drag) return ;
			//拖拽效果
			if(p.title) {
				box.drag({h: '.boxTitle'});
			}else{
				box.drag();
			}
			$("#boxContent").css({'text-align':'center','margin-top':'10px'});
		}
		//显示内容
		if(p.str) 
		{
			box.prepend('<div id="boxContent">'+p.str+'</div>');
			epilogue();
			p.show.call();
		}
		else if(p.url) 
		{
			//ajax载入内容,执行回调函数
			$.get(p.url+'.ajax', function (data) {
				box.prepend('<div id="boxContent">'+data+'</div>');
				box.find('select').css('display','none');
				setTimeout(epilogue, 0);
				p.show.call();
			})
		}
	}
	/**
	 * box插件的confirm版本
	 * @param string str	提示文本
	 * @param fn yes	按下yes的回调函数
	 * @param fn no		按下no的回调函数,默认为关闭box
	 * @example		$.confirm('确定删除?', function (){//删除操作});
	 */
	$.confirm = function (str, yes, no)
	{
		if(!yes) var yes = function (){$.box('close');};
		if(!no) var no = function (){
			$.box('close');
		};
		var options = 
		{
			str:str,
			width: 250,
			closeBtn: false,
			show: function ()
			{
				$('.box .boxBtn button:last').focus()
			},
			buttons:
			[
				{
					text:'确定', handler:function ()
					{
						yes.call();
					}
				},
				{
					text:'取消', handler:no
				}
			]
		};
		$.box(options);
	}
	/**
	 * box插件的alert版本
	 * @param string str	提示文本
	 * @param fn yes	按下yes的回调函数
	 * @example		$.alert('很遗憾的说,你的智商低于10');
	 */
	$.alert = function (str, yes)
	{
		if(!yes) var yes = function (){$.box('close');};
		var options = 
		{
			str:str,
			width: 250,
			closeBtn: false,
			show: function ()
			{
				$('.box .boxBtn button:first').focus();
			},
			buttons:
			[
				{
					text:'确定', handler:function ()
					{
						yes.call();
					}
				}
			]
		};
		$.box(options);
	}

	/**
	 * box插件的msg版本
	 * @param string str	信息文本
	 * @param string title	信息标题
	 * @param string text	信息按钮文本
	 * @param string w		宽度
	 * @param fn yes	按下yes的回调函数
	 * @example		$.msg('很遗憾的说,你的智商低于10','标题');
	 */
	$.msg = function (str, title, text, yes, show, no, width, btn)
	{
		if(!yes) var yes = function (){$.box('close');};
		if(!no) var no = function (){
			$.box('close');
		};
		var options = 
		{
			width:width ? width : 400,
			title:title ? title : '信息提示',
			closeBtn: btn ? btn : true,
			show: function ()
			{
				eval(show);
				$('.box .boxBtn button:last').focus();
			},
			buttons:
			[
				{
					text:text, handler:function ()
					{
						yes.call();
					}
				},
				{
					text:'取消', handler:no
				}
			]
		};
		if(str.indexOf('.url') == -1)
		{
			options.str = str;
		}
		else
		{
			options.url = str.replace('.url','');
		}
		$.box(options);
	}
	$.fn.extend({

		/**
		 * 显示一个覆盖层
		 * 整个页面覆盖: $().overlay(); //可以用上面的$.overlay();代替
		 * 某个元素覆盖: $('#main').overlay();
		 */
		overlay : function (options)
		{
			//设置默认值
			var m = $.extend({
				
					z : 99,		//zindex 覆盖高度
					o : 0.2,	//opacity 透明度
					l : 1,		//loading 加载的图片
					a : ''		//action 动作close or loading
			}, options || {});
			var s = this.attr('tagName') ? 1 : 0;		//范围是全局还是局部

			this.each(function(i,e)
			{
				if(s)
				{
					e = $(e);//局部
					if(e.next('.overlay').length) return;
					var p = e.loadsize();
				}
				else
				{
					e = $('body');//全局
					if($('body>.overlay[rel=0]').length) return;
					var p = $.loadsize();
				}
				if(options == 'close' || m.a == 'close') 
				{
					return $('.overlay[serial='+e.attr('serial')+']').remove();
				}
				//给层编号
				if(e.attr('serial')) 
				{
					if($('.overlay[serial='+e.attr('serial')+']').length) return;	//不重复添加覆盖层
					var serial = e.attr('serial');
				}
				else
				{
					var serial = ++$.serial;
					e.attr('serial', serial);
				}

				var o = '<div class="overlay" serial="'+serial+'" style="left:0;top:0;display:none;z-index:'+m.z+';position:absolute;text-align:left;"></div>';
				$('body').append(o);
				o = $('.overlay[serial='+serial+']');
				o.css('left',p.x);o.css('top',p.y);
				o.width(p.W).height(p.H).css('opacity',m.o).css('background','#000').fadeIn(300);

				if(m.a == 'loading') 
				{
					o.html('<img class="loading" src="'+$_c_i('common/loading/'+m.l)+'.gif" alt="loading..."/>');
					o.find('.loading').css('margin-top',p.h/2 - 8);
					o.find('.loading').css('margin-left',p.w/2 - 8);
				}
			});
			//按esc键退出
			$(document).keydown($.esc);
			return this;
		},
		loadsize : function ()
		{
			//局部元素
			if(this.attr('tagName')) 
			{
				var pos = this.offset();
				pos.x = pos.left;
				pos.y = pos.top;
				pos.w = pos.W = this.outerWidth();
				pos.h = pos.H = this.outerHeight();
				return pos;
			}
			//获取浏览器可见部分的定位宽高信息
			var w = document.documentElement.clientWidth;
			var h = document.documentElement.clientHeight;
			var x = document.documentElement.scrollLeft;
			var y = document.documentElement.scrollTop;
			if(self.pageXOffset) //兼容chrome
			{	
				x=self.pageXOffset;
				y=self.pageYOffset;
			}
			//整体正文宽高
			var W = $(document).width();
			var H = $(document).height();
			$_c_v('w',W);
			$_c_v('h',H);
			return {w:w, h:h, W:W, H:H, x:x, y:y};
		},
		//$.loading();相当于$.overlay({str:'<img class="loading" src="/res/css/images/loading.gif" alt="loading..."/>'});简化了用法
		loading : function (options)
		{
			if(options == 'close') options = {a:'close'};
			else  options = {a:'loading'};
			this.overlay(options);
			return this;
		},
		//跟随滚动条滚动
		follow : function (options)
		{
			var m = this;
			$(window).load(function()
			{
				$(m).followElect(options);
			})
			.scroll(function()
			{
				$(m).followElect(options);
			})
			.resize(function()
			{
				$(m).followElect(options);
			});
			return m;
		},
		//跟随滚动条滚动 效果
		followElect : function(options)
		{
			//设置默认值
			var m = $.extend({
					speed : "fast",
					position : "bottom",
					func : function(){},
					type : 1
			}, options || {});
			if(m.type == 2)
			{
				$(this).slideUp(m.speed,function()
				{
					$(this).slideDown(m.speed);
					$(this).css(m.position,(-parseInt($( document ).scrollTop())+1)+"px");
					m.func.call();
				});
			}
			else
			{
				$(this).css(m.position,(-parseInt($( document ).scrollTop())+1)+"px");
				m.func.call();
			}
			return this;
		},
		//元素置中
		center : function ()
		{
			//box定位
			var p = $.loadsize();
			this.css({left:(p.w-this.outerWidth())/2 + p.x,top:(p.h-this.outerHeight())/2 + p.y});
		},
		/**
		 * 拖拽插件，无依赖，为box提供拖拽功能，如果缺少本插件box也不出错，只是无拖拽功能
		 * 例: $('div').drag({h:'h2'});	//将div中的h2做为拖拽句柄
		 */
		drag : function (options)
		{
			var m = $.extend({

				h: ''			//handler 可拖拽点，默认为本身
			},options || {});

			this.each(function (i, e)
			{
				e = $(e);
				var mx,my,x,y,left,top;	//mx,my是鼠标点击位置。x,y是元素原始坐标,left,top是元素的css属性
				var mt = $_c_e('int',e.css('margin-top'));
				var ml = $_c_e('int',e.css('margin-left'));
				e.css({position:'absolute'});
				var handler = m.h ? e.find(m.h) : e;

				handler.css('cursor','pointer');
				handler.mousedown(function (ev)
				{
					ev = ev || window.event;
					var of = e.offset();x
					mx = of.left;	//元素左上角x坐标
					my = of.top;
					x = ev.pageX;	//鼠标x坐标
					y = ev.pageY;
					
					//left = $_c_e('int',e.css('left'));
					//top = $_c_e('int',e.css('top'));
					var l = $_c_d['w'] ? $_c_d['w'] : $(document).width();
					var t = $_c_d['h'] ? $_c_d['h'] : $(document).height();
					var bw = l-$(this).width()-30;
					var bh = t-$(this).height()-55;
					
					$(document).mousemove(function (ec)
					{
						ec = ec || window.event;
						var pl = mx + ec.pageX - x - ml;
						var pt = my + ec.pageY - y - mt;
						pl = pl >= bw ? bw : pl <= 0 ? 0 : pl;
						pt = pt >= bh ? bh : pt <= 0 ? 0 : pt;
						e.css({left:pl, top:pt});
					});
				});
				$(document).mouseup(function ()
				{
					$(document).unbind('mousemove');
				});
			});
			return this;
		}
	})

})(jQuery);