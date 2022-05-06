import {Button, message, Modal, Tooltip} from 'antd';
import React from 'react';
import {ExclamationCircleOutlined, UnlockOutlined, WalletOutlined} from '@ant-design/icons';
import YhStore from "@/stores/system/YhStore";
import {EpsTableStore} from "@/eps/components/panel/EpsPanel";
import fetch from "@/utils/fetch";
import {history} from "@@/core/umiExports";

const { confirm } = Modal;

function HandleSW(text, record, index, store: EpsTableStore)  {

  var dakCache = {};

  // function runFunc(umid, json, title,newumid) {
  //   try {
  //     var s = new Date();
  //     if (umid) {
  //       const gninfo={};
  //       // var gninfo = ajaxPostSyn("/api/eps/control/main/getFunctionInfo", {
  //       //   umid: umid
  //       // });
  //       fetch.get(`/api/eps/control/main/getFunctionInfo?umid=`+umid).then(res => {
  //         if (res && res.status === 200) {
  //           if (res.data.length > 0) {
  //             gninfo = res.data;
  //           }
  //         }
  //       });
  //       if (gninfo && gninfo.message === "ERROR_TOKEN") {
  //         Eps.top().location.reload();
  //       }
  //       if (gninfo) {
  //         if (gninfo.result != undefined && gninfo.result != null
  //           && gninfo.result == false) {
  //           Eps.showTip("功能不存在！请联系管理员！");
  //           return;
  //         }
  //         var isYz = Eps.getDefaultv("CONTROLS006");
  //         if (isYz && isYz == "Y") {
  //           var yhInfo = Eps.asyncAjax("/api/eps/control/main/yh/queryForId", {id: getUserId()})
  //           if (yhInfo.xgzt == null || yhInfo.xgzt == "" || yhInfo.xgzt == "0") {
  //             Eps.showTip("第一次登录，请先修改密码！");
  //             return;
  //           }
  //         }
  //         var frmname = "";
  //         if (gninfo.id == "noreg" && gninfo.url != "xt") {
  //           Eps.showTip("系统未注册！请联系管理员！", "warrning");
  //           return;
  //         } else if (!gninfo.opts) {
  //           Eps.showTip("您未拥有该功能的权限！请联系管理员！", "warrning");
  //           return;
  //         }
  //         var cfg = {
  //           umid: umid,
  //           umname: gninfo.mc,
  //           mkurl: gninfo.mkurl,
  //           opts: gninfo.opts,
  //           //oumid: oumid,
  //           lx: gninfo.lx,
  //           nmpage: false,
  //           mkid: gninfo.mkbh
  //         };
  //         var frm = null;
  //         if (gninfo.id != "noreg" && gninfo.opts) {
  //           //  if (gninfo.lx == "K") {
  //           if (gninfo.lx == "O") {
  //             if (gninfo.id == "KFGL100") {
  //               if (getUserOption('CONTROLS018', "CONTROL0003").message == 'Y') {
  //                 window.open(Eps.top().getUserInfo().kfhjurl, gninfo.mc)
  //                 return;
  //               }else{
  //                 window.open(gninfo.url, gninfo.mc)
  //                 return;
  //               }
  //             }else {
  //               window.open(gninfo.url, gninfo.mc)
  //               return;
  //             }
  //           }
  //           if (gninfo.id == "MJGL023") {
  //             window.open("/eps/hjkz/hjIndex")
  //             return;
  //           }
  //           if (gninfo.id == "MJGL024") {
  //             window.open("/eps/hjkz/dgIndex")
  //             return;
  //           }
  //           if (gninfo.id == "MJGL025") {
  //             window.open("/eps/hjkz/bfIndex")
  //             return;
  //           }
  //           if (json && json.dakid && json.lx == 'K') {
  //             //  curumid = oumid;
  //             json.tmzt = parseInt(json.tmzt);
  //             var lxdak = getLxDak(json.tmzt);
  //             dakCache[json.dakid] = Eps.asyncAjax("/api/eps/control/main/dak/queryForId", {id: json.dakid}, true);
  //             var dak = dakCache[json.dakid];
  //             var daklx = dak.lx;
  //             var params = {dakid: dak.dakid, mbid: dak.mbid, bmc: dak.mbc, tmzt: json.tmzt}
  //             params = $.extend(params, json)
  //             if (title && title.indexOf("未整理") >= 0) {
  //               openGn(dak.id + "_" + json.tmzt + "_N", title || (dak.mc + "【" + lxdak.mc + "】"), "eps/" + getDakMk(json.tmzt).toLowerCase() + "/" + lxdak.fi.toLowerCase(), "openDak?path=" + getDakUrl(daklx, -22), params);
  //             } else {
  //               openGn(dak.id + "_" + json.tmzt, title || (dak.mc + "【" + lxdak.mc + "】"), "eps/" + getDakMk(json.tmzt).toLowerCase() + "/" + lxdak.fi.toLowerCase(), "openDak?path=" + getDakUrl(daklx, json.tmzt), params);
  //             }
  //             //    }
  //             console.log("打开功能所花时间:" + (new Date() - s))
  //             return;
  //           } else {
  //             var mkurl = gninfo.mkurl;
  //             var url = gninfo.url;
  //             if (gninfo.lx == "I" || gninfo.lx == "G") {
  //               //  Eps.open("")
  //               //  frm.showModal();
  //               // frm.formActivate(true, json);
  //             } else if (gninfo.lx == "W") {
  //               this.setTabUrl(umid, url, gninfo, title);
  //               // var pl = frm.showTable();
  //               // Ext.getCmp("wtcol" + json["col"]).add(pl);
  //               //  frm.formActivate(true, json);
  //             } else if (gninfo.lx == "K") {
  //               var urlparams = EpsUtils.getRequestParams(gninfo.url);
  //               if (urlparams && urlparams["" +
  //               "rungn"]) {
  //                 runFunc(urlparams["rungn"], urlparams, gninfo.mc);
  //               }
  //             } else {
  //               setTab(umid, mkurl, url, json, gninfo, title)
  //             }
  //           }
  //           cfg["nmpage"] = true;
  //         }
  //         console.log("打开功能所花时间:" + (new Date() - s))
  //       }
  //     }
  //   } catch
  //     (e) {
  //     Eps.showTip("打开功能失败！请联系管理员！\r\n" + e.message);
  //   }
  // }
  //
  //
  //
  //
  // function showPopconfirm() {
  //     const r = record;
  //     let wfdef={};
  //     let daktm={};
  //
  //     fetch.get(`/eps/workflow/wfsrv/queryForId?wfvid=`+r.wfid).then(res => {
  //     if (res && res.status === 200) {
  //       if (res.data.length > 0) {
  //         wfdef = res.data;
  //       }
  //     }
  //   });
  //
  //   fetch.get(`/api/eps/control/main/dmzsdagl/queryTMIDByKey`, {
  //     wfid: r.wfid,
  //     wfinst: r.wfinst,
  //     bmc: r.wfid
  //   }).then(res => {
  //     if (res && res.status === 200) {
  //       if (res.data.length > 0) {
  //         daktm = res.data;
  //       }
  //     }
  //   });
  //
  //   if (wfdef.title == "功能流程审批") {
  //      // history.push("");
  //     //   var html = '<a  style="color: blue" onClick="opengnk(\'' + r.gnurl + '\',\'' + r.umid + '\',\'' + daktm + '\')"><u>处理任务</u></a> ';
  //       let a={};
  //     fetch.get(`/api/eps/control/main/dak/queryForId?id=`+r.gnurl).then(res => {
  //       if (res && res.status === 200) {
  //         if (res.data.length > 0) {
  //           a = res.data;
  //         }
  //       }
  //     });
  //
  //     //
  //     // function opengnk(dakid, umid, tmid) {
  //     //
  //     //   var a = Eps.asyncAjax("/api/eps/control/main/dak/queryForId", {id: dakid}, true);
  //
  //       runFunc(r.umid , {dakid: r.gnurl, lx: "K", tmzt: "11", tmid: daktm}, a.mc);
  //
  //   }else {
  //     //   var html = '<a  style="color: blue" onClick="openGn(\'' + r.wfid + '\',\'' + r.wfinst + '\',\'' + r.umid + '\')"><u>处理任务</u></a> ';
  //
  //  //   function openGn(wfid, wfinst, umid) {
  //       //归档流程有点特殊先不处理后台
  //       if(r.wfid == "WF_GDLC"){
  //         r.umid  = "DAGL021"
  //       }
  //      runFunc(r.umid, {wfid: r.wfid, wfinst: r.wfinst, wfstate: "W"});
  //     }
  //   }
  //
  //     // const wfdef = Eps.asyncAjax("/eps/workflow/wfsrv/queryForId", {wfvid: r.wfid}, true);
  //     // const daktm = Eps.asyncAjax("/api/eps/control/main/dmzsdagl/queryTMIDByKey", {
  //     //   wfid: r.wfid,
  //     //   wfinst: r.wfinst,
  //     //   bmc: r.wfid
  //     // }, true);
  //
  //     // if (wfdef.title == "功能流程审批") {
  //     //   var html = '<a  style="color: blue" onClick="opengnk(\'' + r.gnurl + '\',\'' + r.umid + '\',\'' + daktm + '\')"><u>处理任务</u></a> ';
  //     // } else {
  //     //   var html = '<a  style="color: blue" onClick="openGn(\'' + r.wfid + '\',\'' + r.wfinst + '\',\'' + r.umid + '\')"><u>处理任务</u></a> ';
  //     // }
  //
  //
  //
  // }
  //

  function showPopconfirm() {
    history.push("/eps/control/main/yh");
  }


  return (
    <Tooltip title="处理任务">
      <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<WalletOutlined />} onClick={showPopconfirm}/>
    </Tooltip>
  );
}

export default HandleSW;
