/******************************
** 文件描述 :  Desc
** 时   间 :  xxxx.xx
*******************************/
var server = window.location.origin;
var api = server + '/v1/api';

(function($, w) {
    var Common = {
        init: function() {
            var me = this;

            me.tools();
            me.loadPage();
        },

        /********** 公共类 **********/
        // 加载页面
        loadPage: function() {
        	var me = this,
        		$header = $('#header'),
                $footer = $('#footer'),
                $nav = $('#nav'),
                $navlist = $nav.find('.nav-list');

            // 加载头部
            /*$header[0] && $header.load('page/header.html', function() {

            });*/

            // 加载底部
            /*$footer[0] && $footer.load('page/footer.html', function() {

            });*/

            /*$nav.on('click', '.menu', function() {
                if ($navlist.hasClass('on')) {
                    $navlist.removeClass('on').hide();
                } else {
                    $navlist.addClass('on').show();
                }
            });*/

            /*$(window).scroll(function() {
                if($(this).scrollTop() > 70) {
   
    		    } else {
    			    
    		    }
			});*/

			// 退出登录
            /*$header.on('click', '.btn-logout', function() {
                me.removeStorage('xxx');

                C.ajax({
                    url: '/ajax/logout',
                    success: function(res) {
                        location.href = '/';
                    }
                })
            });*/
        },

        // 弹窗操作
        tools: function() {
            // 关闭消息框
            $('body').on('click', '.mask-alert .btn-close', function() {
                $(this).closest('.mask').remove();
            });

            // 关闭确认框
            $('body').on('click', '.mask-confirm .btn-cancel', function() {
                $(this).closest('.mask').remove();
            });
        },

        /********** Fun类 **********/
        /**
         * [ajax Ajax方法]
         * @param  {object} opts [ajax配置]
         */
        ajax: function(opts) {
            var me = this;
            var o = $.extend({}, {
                url: '',
                type: 'GET',
                data: {},
                dataType: 'json',
                cache: false,
                async: false,
                success: function(response) {
                    //200 成功
                    if (response.code == '200') {
                        o.callback(response);
                    } else {
                    	if (typeof o.fail == 'function') {
                    		o.fail(response);
                    	} else {
                    		me.toast(response.msg);
                    	}
                    }
                },
                fail: function(response) {
                    me.toast(response.msg);
                }
            }, opts);

            return $.ajax({
                url: api + o.url,
                type: o.type,
                data: o.data,
                dataType: o.dataType,
                cache: o.cache,
                async: o.async,
                contentType: o.contentType,
                success: o.success
                fail: o.fail
            });
        },

		/**
         * [checkMobile 手机号验证]
         * @param  {string|number} val [待验证手机号]
         * @return {boolean}     [true | false]
         */
        checkMobile: function(val) {
            return /^(1[3456789][0-9])\d{8}$/.test(val);
        },

        /**
         * [checkIEandEdge 检测是否是IE或者Edge浏览器]
         * @return {boolean} [true | false]
         */
        checkIEandEdge: function() {
            if ((navigator.userAgent).indexOf('Edge') > -1) {
                return true;
            }

            if ((navigator.userAgent).indexOf('MSIE') > -1) {
                return true;
            }

            return false;
        },

        /**
   		 * [身份证严格验证]
   		 * @param  {string} val [18位身份证号码]
   		 * @return {boolean}     [true|false]
   		 */
  		strictIdNumber: function (val) {
    		var str,
        		result = 0;

    		val = val.toUpperCase();

    		if (val.length === 18) {
      			var map1 = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      			var map2 = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

      			str = val + '';
      			for (var i = 0, len = str.length; i < (len - 1); i++) {
        			result += str[i] * map1[i];
      			}

      			if (map2[(result % 11)] !== str[len - 1]) {
        			return false;
      			} else {
        			return true;
      			}
    		} else {
    			return false;
    		}
  		},

  		/**
         * [getQueryString 获取url中参数]
         * @param  {string} name [键名]
         * @return {string}      [键值]
         */
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                if (r[2].indexOf("%u") < 0) {
                    r[2] = decodeURIComponent(r[2]).replace(/\\/g, "%");
                }
                return unescape(r[2]);
            }
            return null;
        },

        /**
         * [substring 截取字符串]
         * @param  {string} str  [待处理字符串]
         * @param  {number} len  [截取长度]
         * @param  {string} flow [超过截取长度显示符号]
         * @return {string}      [处理后字符串]
         */
        substring: function(str, len, flow) {
            str = $.trim(str);
            if (!str) return '';

            str = str.toString();
            var newStr = "",
                strLength = str.replace(/[^\x00-\xff]/g, "**").length,
                flow = typeof(flow) == 'undefined' ? '…' : flow;
            if (strLength <= len + (strLength % 2 == 0 ? 2 : 1)) return str;
            for (var i = 0, newLength = 0, singleChar; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(/[^\x00-\xff]/g) != null) newLength += 2;
                else newLength++;

                if (newLength > len) break;
                newStr += singleChar;
            }

            if (strLength > len) newStr = $.trim(newStr) + flow;
            return newStr;
        },

        /**
         * [htmlFilter HTML标签过滤]
         * @param  {string} str [待处理字符串]
         * @return {string}     [处理后字符串]
         */
        htmlFilter: function(str) {
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
            str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
            return str;
        },

        /**
         * [htmlAttrFilter HTML属性过滤]
         * @param  {string} str [待处理字符串]
         * @return {string}     [处理后字符串]
         */
        htmlAttrFilter: function(str) {
            str = str.replace(/style\=([\\]\")*[a-zA-Z0-9\s\-\:\;\'\,\#\u4e00-\u9fa5]+([\\]*\")*/g, ''); //过滤style属性
            return str;
        },

        /**
         * [delHtmlTag 去掉所有的HTML标记]
         * @param  {string} str [待处理字符串]
         * @return {string}     [处理后字符串]
         */
        delHtmlTag: function(str) {
            var str = str.replace(/&nbsp;/g, '');
                str = str.replace(/<img[\s\w"'=:;,&\/\.\+\-\{\}\^\*\(\)\\\?\!，。！？\u4e00-\u9fa5]+>/g, '...');
                str = str.replace(/<[\w\/"'=\s\.\(\)\{\}\-\+\\,\!:;&#%，。！？\u4e00-\u9fa5]*>/g, '');

            return str;
        },

        /**
         * [timeToDate 时间转换日期]
         * @param  {time|string} time 	[时间戳或其他时间格式]
         * @param  {string} 	 flag 	[格式化输出，默认ymd，[ymd|ymdhis|y|md]]
         * @param  {string} 	 symbol [分隔符号，默认 - ]
         * @return {string}      		[格式化时间]
         */
        timeToDate: function(time, flag, symbol) {
        	symbol = symbol || '-';

        	if (typeof time == 'string' && time.length == 10) {
        		time = (time + '000') * 1
        	}

            var date = new Date(time);

            var y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                h = date.getHours(),
                i = date.getMinutes(),
                s = date.getSeconds();

                m = m < 10 ? '0' + m : m;
                d = d < 10 ? '0' + d : d;
                h = h < 10 ? '0' + h : h;
                i = i < 10 ? '0' + i : i;
                s = s < 10 ? '0' + s : s;

            switch(flag) {
            	case 'ymdhis':
            		return y + symbol + m + symbol + d + ' ' + h +':' + i + ':' + s;

            	case 'ymdhi':
            		return y + symbol + m + symbol + d + ' ' + h +':' + i;

            	case 'ymd':
            		return y + symbol + m + symbol + d;

            	case 'y':
            		return y;

            	case 'md':
            		return m + symbol + d;

            	case 'mdhi':
            		return m + symbol + d + ' ' + h +':' + i;

            	case 'dmy':
            		return d + symbol + m + symbol + y;

            	case 'his':
            		return h +':' + i + ':' + s;

            	case 'hi':
            		return h +':' + i;

            	default:
            		return y + symbol + m + symbol + d;

            }  
        },

        /**
         * [zero 补零]
         * @param  {number} num  [值]
         * @return {string}      [补零后值]
         */
        zero: function(num) {
        	return num < 10 ? '0' + num : num;
        },

        /********** 存储类 **********/
        /**
         * [cookieHelper 设置cookie 读取cookie]
         * @param  {string} name    [键名]
         * @param  {string|number|boolean} value   [键值]
         * @param  {object} options [object]
         */
        cookieHelper: function(name, value, options) {
            if (typeof value != 'undefined') {
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString();
                }
                var path = options.path ? '; path=' + options.path : '',
                    domain = options.domain ? '; domain=' + options.domain : '',
                    secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },

        /**
         * [设置本地数据] 使用localStorage，如不支持用Cookie
         * @param  {[string]} key   [键名]
         * @param  {[object]} value [键值]
         */
        setStorage: function(key, value) {
            if (window.localStorage) {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                document.cookie = key + '=' + JSON.stringify(value);
            }
        },

        /**
        * [获取本地数据] 使用localStorage，如不支持用Cookie
        * @param  {[string]} key [键名]
        * @return {[object]}     [json对象]
        */
        getStorage: function(key) {
            var value;
            if (window.localStorage) {
                value = localStorage.getItem(key);
            } else {
                var name = key + '=';
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) !== -1) {
                        value = c.substring(name.length, c.length);
                    }
                }
            }
            return JSON.parse(value);
        },

        /**
         * [删除本地数据] 使用localStorage，如不支持用Cookie
         * @param  {string} key [键名]
         */
        removeStorage: function(key) {
            if (window.localStorage) {
                localStorage.removeItem(key);
            } else {
                var oDate = new Date();
                oDate.setDate(oDate.getDate() - 1);
                document.cookie = key + ' = ' + '1' + ' ;expires = ' + oDate;
            }
        },

        /********** UI类 **********/
        /**
         * [countMaskNum 当前遮罩层统计]
         */
        countMaskNum: function() {
            return ($('.mask').length) + 15000 + 1;
        },

        /**
         * [toast 提示框]
         * @param  {string} msg   [提示消息]
         * @param  {number} times [消失时间，毫秒]
         */
        toast: function(msg, times) {
            var id = this.countMaskNum(),
                times = times || 2000,
                html = '<div id="maskToast'+ id +'" class="mask-toast" style="z-index:'+ id +';">'+ msg +'</div>';

            $('body').append(html);

            setTimeout(function() {
                $('body').find('#maskToast' + id).remove();
            }, times);
        },

        /**
         * [alert 消息框]
         * @param  {string} msg [消息内容]
         */
        alert: function(msg) {
            var html = '<div class="mask" style="z-index:'+ this.countMaskNum() +';">\
                            <section class="mask-alert">\
                                <div class="alert-title">系统消息<a class="iconfont btn-close"></a></div>\
                                <div class="alert-content">'+ msg +'</div>\
                                <div class="alert-btns">\
                                    <a class="btn btn-confirm btn-close">确定</a>\
                                </div>\
                            </section>\
                        </div>';

            $('body').append(html);
        },

        /**
         * [confirm 确认框]
         * @param  {string}   msg      [消息内容]
         * @param  {Function} callback [回调函数]
         */
        confirm: function(msg, callback) {
            var html = '<div class="mask" style="z-index:'+ this.countMaskNum() +';">\
                            <section class="mask-confirm">\
                                <div class="alert-title">系统消息<a class="iconfont btn-cancel"></a></div>\
                                <div class="alert-content">'+ msg +'</div>\
                                <div class="alert-btns">\
                                    <a class="btn btn-cancel">取消</a>\
                                    <a class="btn btn-confirm">确定</a>\
                                </div>\
                            </section>\
                        </div>';

            $('body').append(html);

            // 确认确认框
            $('body').off('click.confirm');
            $('body').on('click.confirm', '.mask-confirm .btn-confirm', function() {
                $(this).closest('.mask').remove();
                callback();
            });
        },

        /**
         * [imgRevision 图片等比缩放]
         * @param  {jQ Object} $img   [img对象]
         */
        imgRevision: function($img) {
        	$img.load(function(){
                var width = $(this).width(),
                    height = $(this).height(),
                    w = $(this).parent().width(),
                    h = $(this).parent().height();

                if (width/height > w/h) {
                    $(this).width(w);
                    $(this).css('margin-top', -1/2 * ($(this).height() - h));
                } else {
                    $(this).height(h);
                    $(this).css('margin-left', -1/2 * ($(this).width() - w));
                }
            });
        },

        /**
         * [countdown 倒计时]
         * @param  {jQ Object}  $btn   [按钮]
         * @param  {Number} 	time   [倒计时秒数]
         * @param  {String} 	txt    [倒计时结束文案]
         */
        countdown: function($btn, time, txt) {
            var t = time || 60;
            	txt = txt || '再次发送';

            var timer = setInterval(function() {
                t--;
                if (t < 0) {
                    clearInterval(timer);
                    $btn.html(txt).removeClass('disabled');
                    return;
                }

                $btn.html(t + '秒');
            }, 1000);
        }
    };

    w.C = Common;
    Common.init();
}(jQuery, window));