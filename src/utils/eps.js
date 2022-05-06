
const Eps = {};

// 返回空或者old，判断调用新老版本的pdfjs
Eps.getBrowerType = function () {

    return ""
};


Eps.isJson = function (str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            //  //#console.log('error：' + str + '!!!' + e);
            return false;
        }
    }
    //  //#console.log('It is not a string!')
}

Eps.isIE8 = function () {
    return navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.";
}

function getParamDev(code, mdid) {
    var s = Eps.asyncAjax("/api/eps/control/main/params/getParamsDevOption", {
        code: code,
        gnid: mdid,
        yhid: window.top.getUserId()
    }, true);
    debugger;
    return s;
}


Eps.OpenEpsSoftjm = function (softName, params) {
    var ipvaule = getParamDev("REPORT0001", "");
    var pathvaule = getParamDev("REPORT0012", "");
    debugger;
    var rid = params;
    var url = "http://" + ipvaule + pathvaule+"/view/" + rid;

    //window.location.href = url;
    window.open(url);
}

Eps.OpenEpsSoftjmmb = function (softName, params) {
    var ipvaule = getParamDev("REPORT0001", "");
    var pathvaule = getParamDev("REPORT0012", "");
    var rid = params;
    var url = "http://" + ipvaule + pathvaule+"/view/" + rid;

    //window.location.href = url;
    window.open(url);
}


Eps.OpenEpsSoft = function (softName, params) {
    if (!BaseUnit.TestOcx()) {
        if (softName == "fileview") {
            window.location.href = getMkResourceUrl("control") + "soft/原文查看工具.exe";
        }
        return;
    }
    var url = "epssoft:@" + softName + "@?";
    //if(typeof(params)=="string"){
    url += params;
    //}else{
    //    var str="";
    //    for(var key in params){
    //        str+="&"+key+"="+params[key];
    //    }
    //    url+=str.substr(1);
    //}
    /*var rid = params;
    var url = "http://localhost:8085/jeecg-boot/jmreport/view/" + rid;*/

    window.location.href = url;
}
/**
 *
 * @param softName
 * @param params
 * @constructor
 */
Eps.OpenEpsElSoft = function (softName, params) {

    var url = "EpsElSoft://" + softName;
    //if(typeof(params)=="string"){
    url += params;
    //}else{
    //    var str="";
    //    for(var key in params){
    //        str+="&"+key+"="+params[key];
    //    }
    //    url+=str.substr(1);
    //}
    /*var rid = params;
    var url = "http://localhost:8085/jeecg-boot/jmreport/view/" + rid;*/

    window.location.href = url;
}


Eps.getRootUrl = function () {
    return location.protocol + "//" + location.hostname + ":" + location.port;
}
/**
 *
 * @param message
 * @param state = default / success / waring / info /danger
 */
Eps.top = function () {
     if (window.top.topMiniuiFrame) {
        return window.top.topMiniuiFrame.contentWindow;
    } else {
        return window.top;
    }
}
Eps.showTip = function (message, state) {
    var newmessage = "<font size='4'>" + message + "</font>"
    Eps.top().mini.showTips({
        content: newmessage,
        state: state || "success",
        x: "center",
        y: "top",
        timeout: 10000
    });
}

Eps.getCookie = function (name) {
    name += "=";
    var allcookies = document.cookie;
    var pos = allcookies.indexOf(name);

    // 如果找到了具有该名字的cookie，那么提取并使用它的值
    // 如果pos值为-1则说明搜索"version="失败
    if (pos != -1) {
        // cookie值开始的位置
        var start = pos + name.length;
        // 从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
        var end = allcookies.indexOf(";", start);
        // 如果end值为-1说明cookie列表里只有一个cookie
        if (end == -1)
            end = allcookies.length;
        // 提取cookie的值
        var value = allcookies.substring(start, end);
        return value;
    }
}

Eps.Constants = {
    MESSAGE_ALERT_SELECTONE: "请选择一条数据",
    MESSAGE_ALERT_DELETESUCCESS: "<b>数据删除成功</b>",
    ACTION_ADD: "add",
    ACTION_VIEW: "view",
    ACTION_EDIT: "edit",
    ACTION_COPY: "copy",
    ACTION_OTHERADD: "otheradd",
    MK_MEERED: "dagl,daly,dajd,eep,longt,kfgl,lmt,fulltext,dams,danb,datj,gpdb,kfgl,danj",
    MK_NOMEGERED: "eps/ufc,eps/tyjk,eps/workflow,eps/wdgl,eps/portal,eps/portalui,eps/dsrw,eps/daapp,eps/dasx,eps/ndjh,eps/dars,eps/xnkf",
    OPENGN_TIMEDIFF: 100000,
    MUlITUPLOAD: false,//附件是否批量上传
}

Eps.Kf_STATE_Constants = {
    DEFAULT: 0,
    WAIT_OUT_STORAGE: 1,
    ALREADY_OUT_STORAGE: 2,
    WAIT_REMOVE: 3,
    ALREADY_REMOVE: 4,
    LOSS: 5
};

Eps.Kf_SYNC_Constants = {
    OUT_OF_SYNC: 0,
    SYNC: 1
};

//String
Eps.String = Eps.String || {}
Eps.String.leftPad = function (str, len, ch) {
    //convert the `str` to String
    str = str + '';

    //needn't to pad
    len = len - str.length;
    if (len <= 0) return str;

    //convert the `ch` to String
    if (!ch && ch !== 0) ch = ' ';
    ch = ch + '';

    var pad = '';
    while (true) {
        if (len & 1) pad += ch;
        len >>= 1;
        if (len) ch += ch;
        else break;
    }
    return pad + str;
}
/*

/**
 * 修改为使用Eps.Open后续不要再用此方法打开界面
 * @param url
 * @param callback
 * @param title
 * @param width
 * @param height
 * @param data
 * @constructor
 */
Eps.open = function (url, title, width, height, data, callback) {
    //
    mini.open({
        targetWindow: window,
        url: url,
        title: title, width: width, height: height,
        onload: function () {
            var iframe = this.getIFrameEl();
            //var data = data;
            iframe.contentWindow.SetData(data);
        },
        ondestroy: function (action) {
            callback(action);
        }
    });
};

/**
 *  打开react的Dailog
 * @param router
 * @param params
 * @param callback
 * @param visible
 */
Eps.openDialog = function (router, params, callback, visible) {
    if(!visible){
        visible=true;
    }
    if (window.top && window.top.openDialog) {
        window.top.openDialog(router, params, callback,visible);
    }
};





/**
 * 打开React的普通功能
 * @param umid
 * @param params
 */
Eps.runRFunc=function(umid, params){
    if (window.top && window.top.runRFunc) {
        window.top.runRFunc(umid, params);
    }
}


Eps.downLoad = function (url, fields) {

    //创建Form
    var submitfrm = document.createElement("form");
    submitfrm.action = url;
    submitfrm.method = "post";
    submitfrm.target = "_blank";
    document.body.appendChild(submitfrm);

    if (fields) {

        for (var p in fields) {
            var input = mini.append(submitfrm, "<input type='hidden' name='" + p + "'>");
            var v = fields[p];
            if (typeof v != "string") v = mini.encode(v);
            input.value = v;
        }
    }

    submitfrm.submit();
    setTimeout(function () {
        submitfrm.parentNode.removeChild(submitfrm);
    }, 1000);
};


Eps.Open = function (url, title, data, width, height, ondestroy, showHeader) {
    window._paramCache = data;
    mini.open({
        targetWindow: window,
        url: url,
        title: title, height: height ? height : 800, width: width ? width : 600,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow._ownerdata = data;
        },
        ondestroy: function (action) {

            if (action == "ok") {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);    //必须
                if (data) {
                    ondestroy(data);
                }
            }
            if (action == "close") {
                ondestroy(data);
            }

        }
    });
//,1000);
};

window._paramCacheKey = {};
Eps.OpenKey = function (url, title, key, data, width, height, ondestroy) {
    window._paramCacheKey[key] = data;
    mini.open({
        targetWindow: window,
        url: url,
        title: title, height: height ? height : 800, width: width ? width : 600,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow._ownerdata = data;
        },
        ondestroy: function (action) {
            ondestroy(action);
        }
    });
//,1000);
};


/**
 *  打开react的Dailog
 * @param router
 * @param params
 * @param callback
 * @param visible
 */
Eps.openRDialog = function (url, title, key, data, width, height,callback) {
    Eps.setLStorage("rparams",{key:key,data:data,url:url});
   // Eps.setLStorage(`${key}_url`,url);
    mini.open({
        targetWindow: window,
        url: "/api/eps/control/main/dialog.html",
        title: title, height: height ? height : 800, width: width ? width : 600,

        ondestroy: function (action) {
            callback();
        }
    });
};

var _paramCallSetData;
Eps.OpenCallSetData = function (url, title, data, width, height) {
    window._paramCallSetData = data;
    mini.open({
        targetWindow: window,
        url: url,
        title: title, height: height ? height : 800, width: width ? width : 600
    });
};

//window.PCallSetData=function(){
//    return window._paramCallSetData;
// }


Eps.DynamicAjaxProxy = {
    kfields: {},
    createFields: function (dynamic, url, params, key) {
        if (!Eps.DynamicAjaxProxy.kfields[key]) {
            Eps.ajaxPost(url, params, function (result) {
                //
                Eps.DynamicAjaxProxy.kfields[key] = result;
                dynamic.createFields(Eps.DynamicAjaxProxy.kfields[key], key);
            })

        } else {
            dynamic.createFields(Eps.DynamicAjaxProxy.kfields[key], key);
        }

    }

}

Eps.BtnOpt = Eps.BtnOpt || {};

Eps.BtnOpt.optJson = {};

Eps.BtnOpt.hasRight = function (umid, optcode) {
    var yhid = Eps.top().getUserId();
    var boolean = false
    if (Eps.BtnOpt.optJson[yhid + "_" + umid] == optcode) {
        boolean = true;
    }
    return boolean;
};


Eps.BtnOpt.getOpts = function (umid, yhid) {

    var opts;
    if (Eps.BtnOpt.optJson.length > 0) {
        if (Eps.BtnOpt.hasRight(yhid, umid)) {
            opts = Eps.BtnOpt.optJson[yhid + "_" + umid];
        } else {
            var gninfo = Eps.asyncAjax(getMkUrl("CONTROL") + "/getFunctionInfo", {
                umid: umid
            });
            if (!gninfo) {
                Eps.BtnOpt.optJson[yhid + "_" + umid] = '';
            }
            opts = gninfo.opts
            Eps.BtnOpt.optJson[yhid + "_" + umid] = opts;

        }
    } else {
        var gninfo = Eps.asyncAjax(getMkUrl("CONTROL") + "/getFunctionInfo", {
            umid: umid
        });
        opts = gninfo.opts
        Eps.BtnOpt.optJson[yhid + "_" + umid] = opts;
    }
    return opts;
    //help init=
};

Eps.BtnOpt.initBtn = function (umid) {

    var yhid = Eps.top().getUserId();
    var opts = Eps.BtnOpt.getOpts(umid, yhid);
    Eps.BtnOpt.btHideOrShow(opts);
    //help init=
};


Eps.initHelp = function (umid) {
    var btnHelp = mini.get("help");
    if (btnHelp) {
        btnHelp.on("click", function (e) {
            mini.open({
                targetWindow: window,
                url: "/api/eps/control/main/help/getHelpFile?umid=" + umid,
                title: "帮助", width: 800, height: 600,
            });
        });
    }
};

Eps.BtnOpt.btHideOrShow = function (opts) {

    var toolbar_add = mini.get("toolbar_add");
    if (toolbar_add) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS101")) {
            toolbar_add.show();
        } else {
            toolbar_add.hide();
        }

    }
    var print_toolbar = mini.get("print_toolbar");
    if (print_toolbar) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS201")) {
            print_toolbar.show();
        } else {
            print_toolbar.hide();
        }
    }

    var yl_toolbar = mini.get("yl_toolbar");
    if (yl_toolbar) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS201")) {
            yl_toolbar.show();
        } else {
            yl_toolbar.hide();
        }
    }

    var eps_resport = mini.get("eps_resport");
    if (eps_resport) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS202")) {
            eps_resport.show();
        } else {
            eps_resport.hide();
        }
    }

    var toolbar_copy = mini.get("toolbar_copy");
    if (toolbar_copy) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS101")) {
            toolbar_copy.show();
        } else {
            toolbar_copy.hide();
        }
    }

    var toolbar_edit = mini.get("toolbar_edit");
    if (toolbar_edit) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS102")) {
            toolbar_edit.show();
        } else {
            toolbar_edit.hide();
        }
    }

    var toolbar_remove = mini.get("toolbar_remove");
    if (toolbar_remove) {
        if (opts == "all" || Eps.BtnOpt.btnHsaOpt(opts, "SYS103")) {
            toolbar_remove.show();
        } else {
            toolbar_remove.hide();
        }
    }


    /*
     if (opts == "all") {
     toolbar_add.show();
     toolbar_copy.show();
     toolbar_edit.show();
     toolbar_remove.show();
     print_toolbar.show();
     yl_toolbar.show();
     eps_resport.show();
     } else {
     if (Eps.BtnOpt.btnHsaOpt(opts, "SYS101")) {
     toolbar_add.show();
     toolbar_copy.show();
     }
     if (Eps.BtnOpt.btnHsaOpt(opts, "SYS102")) {
     toolbar_edit.show();
     }
     if (Eps.BtnOpt.btnHsaOpt(opts, "SYS103")) {
     toolbar_remove.show();
     }
     if (Eps.BtnOpt.btnHsaOpt(opts, "SYS201")) {
     print_toolbar.show();
     yl_toolbar.show();
     }
     if (Eps.BtnOpt.btnHsaOpt(opts, "SYS202")) {
     eps_resport.show();
     }
     }*/
}
Eps.BtnOpt.btnHsaOpt = function (opts, opt) {
    var boolean = opts && opt && opts.indexOf(opt) != -1;
    return boolean;
}


function getLxDak(tmzt) {
    var hz = "";
    var fi = "DAGL";
    var mc = "";
    switch (tmzt) {
        case 1 :
            hz = "_wjsj";
            fi = "DAGL";
            mc = "收集";
            break;
        case 2 :
            hz = "_wjzl";
            fi = "DAGL";
            mc = "整理"
            break;
        case 3 :
            hz = "_dagl";
            fi = "DAGL";
            mc = "管理"
            break;
        case 4 :
            hz = "_daly";
            fi = "DALY";
            mc = "利用"
            break;
        case 5 :
            hz = "_daby";
            fi = "DABY";
            mc = "编研"
            break;
        case 8 :
            hz = "_dajd";
            fi = "DAJD";
            mc = "鉴定";
            break;
        case 9 :
            hz = "_sdssj";
            fi = "DAGL";
            mc = "收集";
            break;
        case 10 :
            hz = "_daff";
            fi = "DAGL";
            mc = "分发";
            break;
        case -1 :
            hz = "_dzwjzx";
            fi = "DAGL";
            mc = "电子文件收集";
            break;
        case 0 :
            hz = "_dzwjff";
            fi = "DAGL";
            mc = "电子文件接收";
            break;
        case 11 :
            hz = "_dmzsgnk";
            fi = "DMZSGNK";
            mc = "功能";
            break;
        case 12 :
            hz = "_ywzd";
            fi = "DALY";
            mc = "业务指导";
            break;
    }
    return {fi: fi, hz: hz, mc: mc};
}

function getDakMk(tmzt) {
    switch (tmzt) {
        case 1 :
            return "DAGL";
        case 2 :
            return "DAGL";
        case 3 :
            return "DAGL";
        case 4 :
            return "DALY";
        case 5 :
            return "DABY";
        case 8 :
            return "DAJD";
        case 9 :
            return "DAGL";
        case 10 :
            return "DAGL";
        case 0 :
            return "DAGL";
        case 11 :
            return "DMZSGNK";
        case -1 :
            return "DAGL";
        case 12 :
            return "DALY";
    }
}

function getDakUrl(daklx, tmzt) {
    var hz = "";
    var fi = "DAGL";
    switch (tmzt) {
        case 1 :
            hz = "_wjsj";
            fi = "DAGL";
            break;
        case 2 :
            hz = "_wjzl";
            fi = "DAGL";
            break;
        case 3 :
            hz = "_dagl";
            fi = "DAGL";
            break;
        case 4 :
            hz = "_daly";
            fi = "DALY";
            break;
        case 5 :
            hz = "_daby";
            fi = "DABY";
            break;
        case 8 :
            hz = "_dajd";
            fi = "DAJD";
            break;
        case 9 :
            hz = "_sdssj";
            fi = "DAGL";
            break;
        case 10 :
            hz = "_daff";
            fi = "DAGL";
            break;
        case 11 :
            hz = "_dmzsgnk";
            fi = "DMZSGNK";
            break;
        case -1 :
            hz = "_dzwjzx";
            fi = "DAGL";
            break;
        case 0 :
            hz = "_dzwjff";
            fi = "DAGL";
            break;
        case -22 :
            hz = "_wjzl_wzlk";
            fi = "DAGL";
            break;
        case 12 :
            hz = "_ywzd";
            fi = "DALY";
            break;
    }
    switch (daklx) {
        case "01" :// 一文一件
            return "daonefile"
                + hz;
        case "0201" :// 传统立卷-卷内
            return "daCoils"
                + hz;
        case "0301" :// 工程一文一件
            return "daCoils"
                + hz;
        case "040101" : // 工程传统立卷
            return "daonefile" + hz;
        case "02" :// 传统立卷

            return "basetraditionalfile" + hz;
        case "03" :// 工程一文一件

            return "baseprojectonefile" + hz;
        case "0401" : // 工程传统立卷

            return "basetraditionalfile" + hz;
        case "04" : // 工程传统立卷
            return "baseprojecttraditionalfile"
                + hz;
    }
}

function downloadFj(fileid, grpid, doctbl, grptbl, umid) {
    var dw = Eps.top().getCurrentDwid();
    if (dw == "DEFAULT") {
        dw = "";
    }
    window.location.href = "/eps/wdgl/attachdoc/download?fileid=" + fileid
        + "&grpid=" + grpid + "&doctbl= " + doctbl + "&grptbl=" + grptbl + "&atdw=" + dw + "&umid=" + umid + "&mkbh=" + null
        + "&downlx=01";
}

/**
 *
 * @param fileid
 * @param grpid
 * @param ext
 * @param doctbl
 * @param grptbl
 * @param umid
 * @param print
 * @param down
 * @param tmid
 * @param dakid
 * @param viewType 查看类型
 */
function doViewFj(fileid, grpid, ext, doctbl, grptbl, umid, print, down, tmid, dakid, viewType) {
    var aprint = print ? "1" : "0";
    var adown = down ? "1" : "0";
    var dw = Eps.top().getCurrentDwid();
    debugger
    if (dw == "DEFAULT") {
        dw = "";
    }

    if (viewType == "bs") {
        var pdfurl = encodeURIComponent(
            "/eps/wdgl/attachdoc/downPdf?downlx=02&fileid="
            + fileid + "&ext=" + ext
            + "&grpid=" + grpid + "&doctbl=" + doctbl
            + "&grptbl=" + grptbl + "&printfile=" + aprint
            + "&downfile=" + adown + "&atdw=" + dw +
            "&opt=view&umid=" + umid + "&opt=view" + "&dakid=" + dakid + "&tmzt=4&daktmid=" + tmid);
        window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=" + aprint
            + "&downfile=" + adown);
        return;
    }
    Eps.OpenEpsSoft("fileview", "url="
        + getMkUrl("WDGL") + "/attachdoc/download&downlx=02&fileid="
        + fileid + "&ext=" + ext
        + "&grpid=" + grpid + "&doctbl=" + doctbl
        + "&grptbl=" + grptbl + "&printfile=" + aprint
        + "&downfile=" + adown + "&atdw=" + dw + "&token="
        + getCookie("ssotoken") + "&opt=view&umid=" + umid + "&opt=view" + "&dakid=" + dakid + "&tmzt=4&daktmid=" + tmid);
}

Eps.Constants.DaglLx = {
    1: "DAGL001",
    2: "DAGL002",
    3: "DAGL003",
    4: "DALY001",
    5: "DABY001",
    8: "DAJD001",
    9: "DAGL0014",
    "-1": "DAGL017",
    "0": "DAGL018",
    11: "DMZSGN004",
    12: "DALY040"
}

Eps.getGnsReg = function (gnids, callback) {
    Eps.ajaxPost("/api/eps/control/main/getGnsReg", {gnids: gnids}, callback);
}

Eps.getMkreg = function (mkbh, callback) {
    Eps.ajaxPost("/api/eps/control/main/getMkReg", {mkbh: mkbh}, callback);
}

Eps.getMkregSync = function (mkbh) {
    return Eps.asyncAjax("/api/eps/control/main/getMkReg", {mkbh: mkbh});
}

Eps.getGnsRegSync = function (gnids) {
    return Eps.asyncAjax("/api/eps/control/main/getGnsReg", {gnids: gnids});
}


Eps.getAttachType = function getAttachType(ext) {
    var otherExt = ",bmp,avi,accdb,css,eml,eps,fla,gif,html,ind,ini,jpeg,jsf,midi,mov,mp3,mpeg,pdf,png,proj,psd,pst,pub,readme,zip,wav,url,vsd,wav,wma,wmv,tiff,rar,";
    var extlc = ext.toLowerCase();
    if (extlc == ("doc") || extlc == ("xls") || extlc == ("ppt")) {
        return extlc + "x_win"
    } else if (extlc == ("docx") || extlc == ("xlsx") || extlc == ("pptx")) {
        return extlc + "_win"
    } else if (extlc == "htm") {
        return "html";
    } else if (extlc == "jpg") {
        return "jpeg";
    } else if (extlc == "mp4" || extlc == "flv") {
        return "avi";
    } else if (otherExt.indexOf("," + extlc + ",") > -1) {
        return extlc;
    } else {
        return "readme";
    }
};


Array.prototype._find = function (fn) {
    if (this === null) throw new TypeError('this is null or not defined');

    var that = Object(this), len = that.length >>> 0;

    if (typeof fn !== 'function') throw new TypeError('fn is not function');

    for (var i = 0; i < len; i++) {
        if (fn(that[i])) return that[i];
    }
    return undefined;
};

Eps.getDefaultv = function (code) {
    var defaultv = Eps.asyncAjax("/api/eps/control/main/params/getUserOption", {
        code: code,
        yhid: Eps.top().getUserId()
    });
    return defaultv.message;
};


Eps.getDefaultvAsync = function (code, fn) {
    Eps.ajaxPost("/api/eps/control/main/params/getUserOption", {
        code: code,
        yhid: Eps.top().getUserId()
    }, function (o) {
        fn(o)
    });
};

Eps.iniRoleByGuid = function (comboxdw) {
    if (Eps.top().getUserInfo().golbalrole != "SYSROLE01" || Eps.top().getUserInfo().golbalrole != "SYSROLE02") {
        comboxdw.load("/api/eps/control/main/dw/queryForList");
    } else {
        comboxdw.load("/api/eps/control/main/dw/queryForListByYhid");
    }
};

Eps.getDakColumns = function (key) {
    return Eps.asyncAjax("/api/eps/control/main/daly/getDakColumns", key);
};
/**
 * 获取用户参数
 * @param code
 * @param umid
 * @param callback
 */
Eps.getUserOption = function (code, umid, callback) {
    Eps.ajaxPost("/api/eps/control/main/params/getUserOption", {
        code: code,
        gnid: Umid,
        yhid: Eps.top().getUserId()
    }, callback);
};

/**
 * exrmaple: {zdx:"证件名称"}
 * @param json
 */
Eps.getSjzdmxList = function (json) {
    return Eps.asyncAjax("/api/eps/control/main/daly/querySjzd", json);
}

//获取参数配置值
Eps.getSysParamsValueByCODE = function (code) {
    return Eps.asyncAjax("/api/eps/control/main/params/queryParamsValueById", {pcode: code});
}

function onRenderDateStr(e) {
    return mini.formatDate(new Date(e.value), "yyyy-MM-dd HH:mm:ss")
}

Eps.Dak = Eps.Dak || {}

Eps.Dak.getParamValue = function (key, dakGrid) {
    var json = {table: dakGrid.bmc};
    return Eps.Dak.getParamValues(key, json);
};
Eps.Dak.getParamValues = function (aKey, jn) {
    switch (aKey.replace(/(^\s*)|(\s*$)/g, "").toLowerCase()) {
        case "usrname" :
            return quotedStr(Eps.top().getUserName());
        case "usrbh" :
            return quotedStr(Eps.top().getUserBh());
        case "curdate":
            return mini.formatDate(new Date(), "yyyy-MM-dd");
        case "curdatetime":
            return mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
        case "curdatestr":
            return mini.formatDate(new Date(), "yyyy-MM-dd HH");
        case "curyearmonth":
            return mini.formatDate(new Date(), "yyyy-MM");
        case "curdatetimestr":
            return mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
        case "usrid" :
            return quotedStr(Eps.top().getUserId());
        case "curyear" :
            return quotedStr(Eps.top().getYear());
        case "curmonth" :
            return quotedStr(Eps.top().getMonth());
        case "curday" :
            return quotedStr(Eps.top().getDay());
        case "curdakdwid" :
            return quotedStr(Eps.top().getCurrentDwInfo().id);
        case "curdakdwbh" :
            return quotedStr(Eps.top().getCurrentDwInfo().dwbh);
        case "curdakdwmc" :
            return quotedStr(Eps.top().getCurrentDwInfo().mc);
        case "curdakqzh" :
            return quotedStr(Eps.top().getCurrentDwInfo().qzh);
        case "curdwid" :
            return quotedStr(Eps.top().getCurrentDwInfo().id);
        case "curdwbh" :
            return quotedStr(Eps.top().getCurrentDwInfo().dwbh);
        case "curdwmc" :
            return quotedStr(Eps.top().getCurrentDwInfo().mc);
        case "curdwqzh" :
            return quotedStr(Eps.top().getCurrentDwInfo().qzh);
        case "curuserdwid" :
            return quotedStr(Eps.top().getUserDwid());
        case "curuserdwbh" :
            return quotedStr(Eps.top().getUserDwbh());
        case "curuserdwmc" :
            return quotedStr(Eps.top().getUserDwmc());
        case "curuserdwqzh" :
            return quotedStr(Eps.top().getUserDwqzh());
        case "table":
            return jn["table"];
        default:
            if (jn && (aKey in jn)) {
                return jn[aKey]
            } else {
                return aKey;
            }
    }
};

export default Eps;
