/**
 * Created by wzk on 2017/8/3.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

        a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
        b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
        b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
    var str = "";
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
    return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
        str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
        var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
            | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
            |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
        for(var j = 0; j < 4; j++)
        {
            if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
        }
    }
    return str;
}
var serverUrl="http://www.fooju.cn/fjw/api.php?";
var api = {
    serverUrl:'http://www.fooju.cn',
    login:serverUrl+"s=Login/login",/*登录*/
    register:serverUrl+"s=Login/register",/*注册*/
    used_lists:serverUrl+"s=Product/used_lists",/*二手房列表*/
    retal_lists:serverUrl+"s=Product/retal_lists",/*租房房列表*/
    used_detail:serverUrl+"s=Product/used_detail",/*二手房详情*/
    adLists:serverUrl+"s=Advertisement/lists",/*广告列表*/
    adDetail:serverUrl+"s=Advertisement/detail",/*广告详情*/
    bottomLists:serverUrl+"s=Bottom/lists",/*底部网站管理列表*/
    bottomDetail:serverUrl+"s=Bottom/detail",/*底部网站管理详情*/
    regionLists:serverUrl+"s=Basics/region_lists",/*区域*/
    region_detail:serverUrl+"s=Basics/region_detail",/*区域详情*/
    Agentlists:serverUrl+"s=Agent/lists",/*经济人列表*/
    Agentdetail:serverUrl+"s=Agent/detail",/*经济人详情*/
    Userlists:serverUrl+"s=User/lists",/*会员列表*/
    Userdetail:serverUrl+"s=User/detail",/*会员详情*/
    Storelists:serverUrl+"s=Store/lists",/*门店列表*/
    Storedetail:serverUrl+"s=Store/detail",/*门店详情*/
    encyTop:serverUrl+"s=Ency/encyTop",/*门店详情*/
    indexLeaderboard:serverUrl+"s=Advertisement/indexLeaderboard",/*pc通栏广告*/
    usedDropdown:serverUrl+"s=Basics/drop_down_pc",/*二手房筛选条件*/
    houseCollect:serverUrl+"s=Operation/houseCollect",/*房源收藏*/
    houseCollectCancel:serverUrl+"s=Operation/houseCollectCancel",/*房源收藏*/
    agentCollect:serverUrl+"s=Operation/agentCollect",/*经济人收藏*/
    agentCollectCancel:serverUrl+"s=Operation/agentCollectCancel",/*取消经济人收藏*/
    userCollectAgent:serverUrl+"s=Operation/userCollectAgent",/*我的经济人*/
    agentLists:serverUrl+"s=Agent/lists",/*经纪人列表*/
    new_lists:serverUrl+"s=Product/new_lists",/*新房列表*/
    village_lists:serverUrl+"s=Village/lists",/*小区列表*/
    village_school:serverUrl+"s=Village/school",/*小区列表*/
    VillageDetail:serverUrl+"s=Village/detail",/*小区详情*/
    ProductRetal_detail:serverUrl+"s=Product/retal_detail",/*租房详情*/
    ProductNew_detail:serverUrl+"s=Product/new_detail",/*新房详情*/
    EncyEncyType:serverUrl+"s=Ency/encyType",/*百科分类*/
    EncyEncyList:serverUrl+"s=Ency/encyList",/*百科分类列表*/
    EncyEncyDetail:serverUrl+"s=Ency/encyDetail",/*百科详情*/
    EncyEncyTypeList:serverUrl+"s=Ency/encyTypeList",/*百科全部分类*/
    CalculatorNewHouseTax:serverUrl+"s=Calculator/newHouseTax",/*新房税率计算*/
    CalculatorUsedHouseTax:serverUrl+"s=Calculator/usedHouseTax",/*二手房税率计算*/
    CalculatorIndex:serverUrl+"s=Calculator/index",/*房贷计算*/
    OperationUser:serverUrl+"s=Operation/user",/*帮我找房*/
    OperationOwner:serverUrl+"s=Operation/owner",/*我是业主*/
    OperationAssess:serverUrl+"s=Operation/assess",/*房屋估价*/
    villageCollectList:serverUrl+"s=Operation/villageCollectList",/*小区收藏列表*/
    collectVillage:serverUrl+"s=Operation/villageCollect",/*收藏/取消小区收藏*/
    manyCollectCancel:serverUrl+"s=Operation/manyCollectCancel",/*收藏/取消小区收藏*/
    manyVillageCollectCancel:serverUrl+"s=Operation/manyVillageCollectCancel",/*批量取消小区收藏列表*/
    userCollect:serverUrl+"s=Operation/userCollect",/*我的关注*/
    mapHouseList:serverUrl+"s=Map/mapHouseList",/*地图找房*/
    mapHouseVillage:serverUrl+"s=Map/mapHouseVillage",/*地图找房,小区列表*/
    barrageAd:serverUrl+"s=Advertisement/barrageAd",/*弹幕广告*/
    rentLabelShaixuan:serverUrl+"s=Basics/label",/*租房筛选标签*/
    updateInfo:serverUrl+"s=Login/update",/*租房筛选标签*/
    t_login:serverUrl+"Login/t_login",/*三方登陆*/
    getUrl:serverUrl+"s=Msg/getUrl",/*三方登陆*/
    recommend:serverUrl+"s=Product/recommend/plat/2",/*推荐*/
    recommendNew:serverUrl+"s=Product/recommend_pc",/*推荐*/
    regionListCopy:serverUrl+"s=Basics/regionListCopy",/*推荐*/

    // http://114.215.83.139/fjw/api.php?s=Village/school/h_type/new
    paramToUrl:function(a,b){
        var str="";
        for (var o in b){
            if(b[o] instanceof Array){
                str+="/"+o+"/"+b[o].join();
            }else{
                str+="/"+o+"/"+b[o];
            }
        }
        return a+str
    },
    to:function (href) {
        if(href != ""){
            window.open(href);
        }
        // window.location.href=href
    }
};


setInterval(function () {
    $("a").each(function (index,item) {
        if($(item).parents("ul").siblings().hasClass("userData")){
            return;
        }
        if($(item).parents("#menu").length>0){
            return;
        }
        if($("item").hasClass("fc_moreOptions")){
            return;
        }
        if(!$(item).hasClass("delete")){
            $(item).attr("target","_blank")
        }
        $("a[href='javascript:;']").removeAttr("target");
    });
},1000);

$("a[href='javascript:;']").removeAttr("target");

/*获取用户id*/
api.getUserId=function () {
    return $.cookie("userid")||"";
};
/*设置用户id*/
api.setUserId=function (userId) {
    $.cookie("userid",userId,{expires:10});
    // sessionStorage.setItem("userId",userId)
};
//loading加载
api.loading=function () {
    $('.preview').show();
    var opts = {
        lines: 13, // The number of lines to draw
        length: 13, // The length of each line
        width: 4, // The line thickness
        radius: 17, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#fff', // #rgb or #rrggbb
        speed: 1.4, // Rounds per second
        trail: 74, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9 // The z-index (defaults to 2000000000)
    };
    $.fn.spin = function(opts) {
        this.each(function() {
            var $this = $(this),
                data = $this.data();

            if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;
            }
            if (opts !== false) {
                data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
            }
        });
        return this;
    };
    $('#preview').spin(opts);
}
//loading隐藏
api.loadingHide=function () {
    $('.preview').spin(false);
    $('.preview').hide();
}
//创建flash或者img
api.createFlashOrImg=function(src,width,height) {
    var flash='<object classid="clsid27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="{width}" height="{height}" align="center">'
        +'<param name="movie" value="{src}">'
        +'<param name="quality" value="high">'
        +'<param name="play" value="1">'
        +'<param name="AllowScriptAccess" value="never">'
        +'<param name="wmode" value="opaque">'
        +'<embed src="{src}" width="{width}" height="{height}"'
        +'align="center" autostart="true" quality="high" wmode="opaque"'
        +'pluginspage="http://www.macromedia.com/go/getflashplayer"'
        +'type="application/x-shockwave-flash"></embed></object>'
    var is_array = function(value) {
        return value &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            typeof value.splice === 'function' &&
            !(value.propertyIsEnumerable('length'));
    };

    /*if(is_array(obj)){
     $.each(obj,function(index,item){
     create(item)
     })
     }else{
     create(obj)
     }*/
    function isFlash(src){
        return /\.swf/.test(src);
    }
    function create(item,width,height){
        if(isFlash(item)){

            return flash.replace(/\{width\}/g,width).replace(/\{src\}/g,item).replace(/\{height\}/g,height)

        }else{
            return	$("<img />").attr({"src":item,width:width,height:height})[0].outerHTML;
        }
    }
    return create(src,width,height)

};
//友情链接
function bottomLink() {
    $.getJSON(api.paramToUrl(api.bottomLists,{type:"link"}),function (data) {
        if(data.code===200){
            var str='<a href="{url}" class="fleft" target="_blank">{name}</a>';
            var html="";
            $.each(data.data,function (index,item) {
                html+=str.replace(/\{url\}/,item.url).replace(/\{name\}/,item.name);
            })
            $(".friendships-links .link-list").html(html)
        }
    })
}
setTimeout(function () {
    bottomLink();
},2000)
api.HTMLDecode=function(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
};
api.NewGuid=function() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};
/*关注房源*/
api.collectHouse=function (obj,callback) {
    if(api.getUserId()!=""){
        $.ajax({
            url:api.houseCollect,
            type:"post",
            data:obj,
            success:function (data) {
                callback(data)
            }
        })
    }else {
        $(".loginBox").css("display","block");
    }
};
/*取消关注房源*/
api.cancelCollectHouse=function (obj,callback) {
    $.ajax({
        url:api.houseCollectCancel,
        type:"post",
        data:obj,
        success:function (data) {
            callback(data)
        }
    })
};
/*关注小区*/
api.villageCollect=function (obj,callback) {
    if(api.getUserId()!=""){
        $.ajax({
            url:serverUrl+"s=Operation/villageCollect",
            type:"post",
            data:obj,
            success:function (data) {
                callback(data)
            }
        })
    }else {
        $(".loginBox").css("display","block");
    }
};
api.cancelCollectmanyVillage=function (obj,callback) {
    if(api.getUserId()!=""){
        $.ajax({
            url:api.manyVillageCollectCancel,
            type:"post",
            data:obj,
            success:function (data) {
                callback(data)
            }
        })
    }else {
        $(".loginBox").css("display","block");
    }
};
api.collectVillageOp=function (obj,callback) {
    if(api.getUserId()!=""){
        $.ajax({
            url:api.collectVillage,
            type:"post",
            data:obj,
            success:function (data) {
                callback(data)
            }
        })
    }else {
        $(".loginBox").css("display","block");
    }
};
/*经济人收藏*/
api.collectAgent=function (obj,callback) {
    if(api.getUserId()!=""){
        $.ajax({
            url:api.agentCollect,
            type:"post",
            data:obj,
            success:function (data) {
                callback(data)
            }
        })
    }else {
        $(".loginBox").css("display","block");
    }
};
/*取消经纪人收藏*/
api.cancelCollecttAgent=function (obj,callback) {
    $.ajax({
        url:api.agentCollectCancel,
        type:"post",
        data:obj,
        success:function (data) {
            callback(data)
        }
    })
};
/*    api.Collectvillage=function (obj,callback) {
 $.ajax({
 url:api.villageCollect,
 type:"post",
 data:obj,
 success:function (data) {
 callback(data)
 }
 })
 };*/
/*获取用户id*/
/*api.getUserId=function () {
 return $.cookie("userid");
 };*/
/*设置用户id*/
/*api.setUserId=function (userId) {
 $.cookie("userid",userId,{expires:10});
 // sessionStorage.setItem("userId",userId)
 };*/
/*是否登录*/
api.isLogin=function () {
    if(api.getUserId()){
        return true;
    }else{
        return false;
    }
};
api.getCurrentArea=function(){
    var area = $.cookie("area");
    if(area){
        return JSON.parse(area);
    }else{
        return {name:"",r_id:""};
    }
};

api.setCurrentArea=function (name,r_id) {
    var obj={};
    obj.name=name||"";
    obj.r_id=r_id||"";
    // $.cookie("userid",userId,{expires:10});
    $.cookie("area",JSON.stringify(obj),{expires:10})
    sessionStorage.setItem("area",JSON.stringify(obj))
}
// api.setUserId(63);
/*通栏广告*/
api.tonglan=function (position,location) {
    var $indexLeaderboard=$(".leaderboard");
    $.getJSON(api.paramToUrl(api.adLists,{type:7,platform:1,position:position,location:location}),function (data) {
        var str=""
        if(data.code!==200){
            return;
        }
        $.each(data.data,function (index,item) {
            if(index<3){
                //str+=  "<a href='"+item.ad_url+"'>"+api.createFlashOrImg(api.serverUrl+item.picurl,"100%",110)+"</a>";
                str+= "<div style='position: relative;' href='"+item.ad_url+"'>"+api.createFlashOrImg(api.serverUrl+item.picurl,"100%",110)+"<a style='height: 100%;position: absolute;top: 0;left: 0;display: inline-block;z-index: 2;width: 100%;' href='"+item.ad_url+"'></a></div>";
            }
        })
        if(location===2){
            $indexLeaderboard.eq(0).html(str);
        }
        if(location===3){
            $indexLeaderboard.eq(1).html(str);
        }
        removeHref();
    })
};
function removeHref() {
    $("a").each(function(index,item){
        if($(item).attr("href")===""){
            $(item).removeAttr("href")
        }
    });
};
/*对联广告*/
api.duilian=function (position) {
    $.getJSON(api.paramToUrl(api.adLists,{type:2,position:position}),function (data) {
        var left=$(".duilianLeft");
        var right=$(".duilianRight");
        if(data.code == '101'){
            return;
        }
        $.each(data.data,function (index,item) {
            var str="<a href='"+item.ad_url+"'>"+api.createFlashOrImg(api.serverUrl+item.picurl,"100%",110)+"</a><div id='close' class='close'>关闭</div>";
            if(item.location==0){
                left.html(str)
                left.show()
            }else{
                right.html(str)
                right.show();
            }
            removeHref();
        })
    });
    $(document).on("click",".duilianAd .close",function () {
        $(this).parent().hide();
    });
};
/*登录*/
function loginTwo() {
    // 判断手机号码
    var phone = document.getElementById('phone').value;
    var password = $("#password").val();
    var passMd5=hex_md5(hex_md5(password))+"fujuwang";
    $.ajax({
        url:api.login,
        type:"post",
        data:{mobile:phone,password:passMd5},
        success:function (data) {
            var data = JSON.parse(data);
            if(data.code === 200){
                api.setUserId(data.data.id);
                $.cookie("username",data.data.username,{expires:10});
                $.cookie("userpic",data.data.face,{expires:10});
                $.cookie("userphone",data.data.mobile,{expires:10});
                $(".login a").html($.cookie("username"));
                information();
                $(".register a").html("退出");
                $(".loginBox").css("display","none");
                location.reload(true);
            }else {
                alert(data.msg)
            }
        }
    })
}
$("#login").click(function () {
    loginTwo();
});
$("#loginform #password").keydown(function (ev) {
    var ev=window.event||ev;
    if(ev.keyCode === 13){
        loginTwo();
    }
});
$("body").on("click",".login a",function () {
    if($(this).html() == "请登录"){
        $(".loginBox").css("display","block");
    }else{
        window.location.href="personalCenter.html";
    }
});
//判断是否是在个人中心页面退出
function isExit(str){
    var htmlArr=["personalCenter","houseSchedule","record","myConcern","myAgent","modifyData"];
    var isExit=false;
    $.each(htmlArr,function(index,item){
        if(str.indexOf(item)!==-1){
            isExit=true;
        }
    })
    return isExit;
};
//退出登录
$("body").on("click",".register a",function () {
    if($(this).html() == "立即注册"){
        window.location.href="register.html";
    }else{
        api.setUserId("");
        $.cookie("username","");
        $(".login a").html("请登录");
        $(".register a").html("立即注册");
        if(QC.Login.check()){
            QC.Login.signOut();
        }
        if(isExit(location.href)){

            window.location.href="index.html"
        }else{
            location.reload(true);
        }
    }
});
$(".loginBox").on("click",".close",function () {
    $(".loginBox").css("display","none");
});
//判断是否登录
if(api.isLogin()){
    $(".login a").html($.cookie("username"));
    $(".register a").html("退出");
}else{
    $(".login a").html("请登录");
    $(".register a").html("立即注册");
};
$(".right-tools .richeng").on("click",function () {
    if(api.getUserId()!=""){
        api.to("houseSchedule.html");
    }else {
        $(".loginBox").css("display","block");
    }
});
$(".right-tools .guanzhu").on("click",function () {
    if(api.getUserId()!=""){
        api.to("houseSchedule.html");
    }else {
        $(".loginBox").css("display","block");
    }
});
//个人中心用户名和头像
function information() {
    if($.cookie("userpic")){
        $(".user_headPortrait img").attr("src",$.cookie("userpic"));
        $(".user_Name").html($.cookie("username"));
    }

};
information();
//面包屑导航
$(".content_top a:first").on("click",function () {
    api.to("index.html");
});
$(".content_top a:last").on("click",function () {
    location.reload(true);
});
/*登录*/
api.createScript=function (src,obj) {
    if(src.trim()){
        var s = document.createElement("script");
        var $a=$(s);
        $a.attr(obj)
        $a.attr("src",src)
        $("body").append($a);
    }
}
window.onload=function () {
    api.createScript("http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js",{
        "data-appid":"101422474" ,
        "data-redirecturi":"http://www.fooju.cn/thirdPartyLogin.html"
    })
    api.createScript("http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=1356488643&debug=true",{});
};
console.log("121234212")
//第三方登录
$("#qq").click(function () {
    QC.Login.showPopup({
        appId:"101422474",
        // redirectURI:"http://114.215.83.139/fjw/fjwpc/dist/html/thirdPartyLogin.html"
        redirectURI:"http://www.fooju.cn/thirdPartyLogin.html"
    });
});
$("#weixin").on("click",function () {
    var path=encodeURIComponent("http://www.fooju.cn/thirdPartyLogin.html");
    var appid = 'wx7965b82696744113';
    window.open('https://open.weixin.qq.com/connect/qrconnect?appid='+appid+'&redirect_uri='+path+'&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect');
});

$("html").attr("xmlns:wb","http://open.weibo.com/wb");

$("#weibo").on("click",function () {
    WB2.login(function(){//登录授权
        WB2.anyWhere(function(W){
            W.parseCMD('/account/get_uid.json',function(oResult1,bStatus){//获取用户uid
                if(bStatus){
                    W.parseCMD('/users/show.json',function(oResult2,bStatus){//通过uid获取用户信息
                        if(bStatus){
                            var args = {
                                openid:oResult2.id,//获取用户openid
                                access_token:WB2.oauthData.access_token,//获取用户access_token
                                username:oResult2.name,//获取用户名
                                userHeadImg:oResult2.profile_image_url,//获取用户微博头像
                            }
                            $.cookie("args",JSON.stringify(args));
                            console.log(args)
                            $.ajax({
                                url:serverUrl+"s=Login/nt_login",
                                type:"post",
                                data:{openid:args.openid,
                                    type:"weibo",
                                    rfrom:"pc"},
                                success:function (data) {
                                    var data=JSON.parse(data);
                                    if(data.code === 200){
                                        api.setUserId(data.data.id);
                                        $.cookie("username",data.data.username,{expires:10});
                                        $.cookie("userpic",data.data.face,{expires:10});
                                        location.href="index.html";
                                        return false;
                                    }else if(data.code === 102){
                                        location.href="thirdPartyLogin.html?weibo=true";
                                    }else if(data.code === 103){

                                    }else if(data.code === 104){

                                    }else if(data.code === 105){
                                        alert(data.msg)
                                    }
                                }
                            })
                            //然后根据实际情况进行自己网站的一些认证处理
                        }
                    },{uid:oResult1.uid},{method:'get',cache_time:30});
                }
            },{},{method:'get',cache_time:30});//默认是post请求方法
        });
    });
});



$(".search input[type=text]").keydown(function (e) {
    if(e.keyCode===13){
        location.href=location.pathname+"?q="+$(this).val();
    }
});
//放大镜
function fangda (imgSelector,scale) {

    function createSelectorAndPreview() {

        $('<div class="selector"></div>').appendTo($(imgSelector).parent()).css({
            width: 100,
            height: 100,
            position: 'absolute',
            display:"none",
            left: 0,
            top:0,
            background: "rgba(0,0,0,0.5)",
        })
        $('<div class="preview"><img style="position: absolute" src="" alt=""></div>').appendTo($(imgSelector).parents(".banner")).css({
            width: 592,
            height: 542,
            overflow: 'hidden',
            position: 'absolute',
            display:"none",
            left: '102%',
            top:0,
            boxShadow:'0 0 4px 4px #ccc'
        })

    }

    var $s,$img,$preview,$imgW,$imgH,$previewW,$previewH,$previewH,$sW,$sH;
    var scale=scale;

    function init() {

        $imgW = $img.width();
        $imgH = $img.height();

        $previewW = $preview.width();
        $previewH = $preview.height();
        $sW = $previewW/scale;
        $sH = $previewH/scale;

        $s.css({
            width:$sW,
            height:$sH,
            position:"absolute"
        });
    }

//        $(".preview img").css({"width":$imgW*scale,"height":$imgH*scale});

    $(document).on("mouseover",imgSelector+",.selector",function () {
        $(imgSelector).parent().css({
            position:"relative"
        })
        if($(this).parent().find(".selector").length===0||$(this).parents(".banner").find(".preview").length===0){
            createSelectorAndPreview();
        }
        if($(this).attr("src")!==undefined){

            $s = $(this).parent().find(".selector");
            $preview=$(this).parents(".banner").find(".preview");
            $img=$(this);
            init()
            $(this).parents(".banner").find(".preview img").css({"width":$imgW*scale,"height":$imgH*scale}).attr("src",$(this).attr("src"));
        }
        $preview.show();
        $s.show();
    })
    $(document).on("mouseout",imgSelector+",.selector",function () {
        $preview.hide();
        $s.hide();
    })

    $(document).on("mousemove",imgSelector+",.selector",function (e) {

        var positionX=e.pageX-$img.offset().left; //获取当前鼠标相对img的X坐标
        var positionY=e.pageY-$img.offset().top; //获取当前鼠标相对img的Y坐标
        var $sLeft=positionX-$sW/2,$sTop=positionY-$sH/2;
        $sLeft=$sLeft>0?$sLeft:0;
        $sTop =$sTop>0?$sTop:0;

        $sLeft=($sLeft+$sW)<$imgW?$sLeft:($imgW-$sW);
        $sTop=($sTop+$sH)<$imgH?$sTop:($imgH-$sH);

        $s.css({"left":$sLeft,"top":$sTop});

        $(this).parents(".banner").find(".preview img").css({"left":-$s.position().left*scale,"top":-$s.position().top*scale});
    })

}


