import { observable, action, runInAction, makeAutoObservable } from 'mobx';
import util from '../../utils/util';
import { message } from 'antd';
import moment from 'moment';
import BaseStore from '../BaseStore';
import SysStore from '../system/SysStore';
import LoginStore from '../system/LoginStore';
import fetch from '../../utils/fetch';
import { List } from '@alifd/next';
import RightStore from '@/components/RightContent/RightStore';
import cookie from 'react-cookies';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
import dakoptService from '@/pages/dagl/Dagl/AppraisaManage/dakoptService';

class EpsSearchStore {
  url = '';
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this);
  }
  @observable pageno = 1;
  @observable pagesize = 20;
  @observable data = [];
  @observable columns = [];

  @observable years = [];
  @observable dakType = [];
  //获取全文检索分组查询
  @observable filterList = [];
  @observable tagList = [];
  @observable rightExpand = true;
  @observable showMenu = true;
  @observable currentTab = '1';
  @observable type = 'all';
  @observable dataList = [];
  @observable keywords = '';
  @observable tmOryw = '*';
  //默认按照attr_sylx类型（tm，yw）排序
  @observable sortField = 'random';
  @observable companyId = '';
  @observable yearId = '';
  @observable dakTypeId = '';
  @observable flhId = '';
  @observable tmid = '';
  @observable dakid = '';
  @observable fileid = '';
  @observable yhid = SysStore.getCurrentUser().id;
  @observable dajdid = '';
  @observable bmc = '';
  @observable visible = false;
  @observable short = true;
  @observable shouldUpdatePosition = true;
  @observable seeonsdwid = '';
  @observable isReact = 'isReact';
  @observable returnRepones = 0;
  @observable returnMessage = '';
  @observable dwData = [];
  @observable ndList = '';
  @observable mbmcList = '';
  @observable flhList = '';
  @observable seeonsdaktype = '';

  @observable codeValue = {};
  @observable pDALYF002 = 0;

  //默认当前用户所在单位
  @observable dwmc = SysStore.getCurrentCmp().mc;
  //默认当前部门
  @observable bm = SysStore.getCurrentUser().orgmc;
  //获取当前用户名称
  @observable yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  setColumns = (columns) => {
    this.columns = columns;
  };
  afterQueryData(data) {
    return data;
  }

  @action onChange = async (keywords) => {
    console.log(keywords);
    this.keywords = keywords;
  };

  @action settype = async (type) => {
    this.type = type;
  };

  @action settmOryw = async (tmOryw) => {
    this.tmOryw = tmOryw;
  };

  @action setcompanyId = async (companyId) => {
    this.companyId = companyId;
  };

  @action ontagList = async (tagList) => {
    this.tagList = tagList;
  };
  @action ondakids = async (dakids) => {
    this.dakids = dakids;
  };

  @action onPageChange = async (param, param2) => {
    this.pageno = param;
    this.pagesize = param2;
    this.queryForPage();
  };

  @action onSortClick = async (param) => {
    this.sortField = param;
    this.queryForPage();
  };

  @action handleClickTab = async (val) => {};
  //加入借阅车
  @action addBorrow = async (tmid, dakid, fileid) => {
    this.tmid = tmid;
    this.dakid = dakid;
    this.fileid = fileid;
    this.setBorrow();
  };

  //加入查档登记
  @action addLobby = async (tmid, dakid) => {
    this.tmid = tmid;
    this.dakid = dakid;
    this.yhid = SysStore.getCurrentUser().id;
    this.addLydts();
  };

  @action getDwTaglist = async (val) => {
    var a = {};
    a.id = val.id;
    a.zd = 'dw';
    a.name = val.dwname;
    var ext = false;
    for (var i = 0; i < this.tagList.length; i++) {
      if (a.id == this.tagList[i].id) {
        ext = true;
        return;
      }
    }
    if (!ext) {
      this.tagList.push(a);
    }
    this.queryForPage();
  };

  //因为年度需要排序在后端,所以取值方法做了处理
  @action getYearTaglist = async (val) => {
    var a = {};
    //a.id = val.id;
    a.zd = 'year';
    // a.name = val.name;
    a.name = val;
    var ext = false;
    for (var i = 0; i < this.tagList.length; i++) {
      if (val == this.tagList[i].name) {
        ext = true;
        return;
      }
    }
    if (!ext) {
      this.tagList.push(a);
    }
    this.queryForPage();
  };

  @action getFlhTaglist = async (val) => {
    var a = {};
    a.id = val.id;
    a.zd = 'flh';
    a.name = val.name;
    var ext = false;
    for (var i = 0; i < this.tagList.length; i++) {
      if (a.id == this.tagList[i].id) {
        ext = true;
        return;
      }
    }
    if (!ext) {
      this.tagList.push(a);
    }
    this.queryForPage();
  };

  @action getDakTypeTaglist = async (val) => {
    var a = {};
    a.id = val.id;
    a.zd = 'dakType';
    a.name = val.name;
    var ext = false;
    for (var i = 0; i < this.tagList.length; i++) {
      if (a.id == this.tagList[i].id) {
        ext = true;
        return;
      }
    }
    if (!ext) {
      this.tagList.push(a);
    }
    this.queryForPage();
    var dakTypes = '';
    for (var i = 0; i < this.tagList.length; i++) {
      if ('dakType' == this.tagList[i].zd) {
        dakTypes = this.tagList[i].name + ',' + dakTypes;
      }
    }

    //根据选择的档案库类型查询分类号
    this.findDistinctFlhByDakType(dakTypes);
  };

  @action removeTaglist = async (val) => {
    this.tagList.splice(this.tagList.indexOf(val), 1);
    debugger;
    this.queryForPage();
    var dakTypes = '';
    for (var i = 0; i < this.tagList.length; i++) {
      if ('dakType' == this.tagList[i].zd) {
        dakTypes = this.tagList[i].name + ',' + dakTypes;
      }
    }
    this.findDistinctFlhByDakType(dakTypes);
  };

  @action setTypes = async (params) => {
    this.currentTab = params;
    if (params == 1) {
      this.type = 'all';
      this.tmOryw = '*';
    }
    if (params == 2) {
      this.type = 'catalog';
      this.tmOryw = 'tm';
    }
    if (params == 3) {
      this.type = 'file';
      this.tmOryw = 'yw';
    }
    this.queryForPage();
  };

  @action openywClick = async (
    tmid,
    dakid,
    fileid,
    filename,
    adwid,
    wjlx,
    bmc,
    sylx,
  ) => {
    //检查当前用户是否有打开原文的权限
    const checkIsShow = await fetch.get(
      `/api/eps/control/main/elas/checkYwIsShow?bmc=${bmc}&dwid=${adwid}&tmid=${tmid}&dakid=${dakid}&fid=${fileid}&sylx=${sylx}&yhid=${this.yhid}`,
    );
    if (checkIsShow.data.data === 0) {
      message.warning('抱歉,您无权查看该文件,请进行档案借阅');
      return;
    }
    const responsedata = await fetch.get(
      `/api/eps/control/main/daly/queryKTable?dakid=${dakid}`,
    );

    if (responsedata.status === 200) {
      const tmresponse = await fetch.get(
        `/api/eps/control/main/daly/queryForId?id=${tmid}&bmc=${responsedata.data.bmc}`,
      );
      console.log(tmresponse);
      const dakqxresponse = await fetch.get(
        `/api/eps/control/main/dakqx/getDakopts?yhid=${this.yhid}&dakid=${dakid}&tmzt=4`,
      );
      //打印权限
      let disableDown = 0;
      //下载权限
      let disablePrint = 0;
      if (dakqxresponse && dakqxresponse.status === 200) {
        const qxValues = dakqxresponse.data;
        if (qxValues.indexOf('SYS303') !== -1) {
          disableDown = 1;
        }
        if (qxValues.indexOf('SYS304') !== -1) {
          disablePrint = 1;
        }
      }
      var fm = this;
      var keyvalues = {};
      keyvalues['fileid'] = fileid;
      keyvalues['owner'] = fm;
      keyvalues['grpid'] = tmresponse.data.filegrpid;
      keyvalues['docTbl'] = responsedata.data.bmc + '_FJ';
      keyvalues['docGrpTbl'] = responsedata.data.bmc + '_FJFZ';
      keyvalues['atdw'] = this.companyId;
      keyvalues['umid'] = 'DAGL003';
      keyvalues['ext'] = wjlx;
      keyvalues['filename'] = filename;

      var viewType = 'cs';

      let url =
        '/api/eps/control/main/params/getUserOption?code=WDS003&gnid=DAGL003&yhid=' +
        SysStore.getCurrentUser().id;
      const response = await fetch.get(url);
      //是否启用BS查阅文档工具 是
      if (response.data.message === 'Y') {
        viewType = 'bs';
        var pdfurl = encodeURIComponent(
          'http://' +
            location.hostname +
            ':' +
            location.port +
            '/api/eps/wdgl/attachdoc/downPdf?fileid=' +
            fileid +
            '&grpid=' +
            tmresponse.data.filegrpid +
            '&doctbl=' +
            responsedata.data.bmc +
            '_FJ' +
            '&daktmid=' +
            tmid +
            '&ext=' +
            wjlx +
            '&grptbl= ' +
            responsedata.data.bmc +
            '_FJFZ' +
            '&atdw= ' +
            this.companyId +
            '&umid=DAGL003&mkbh=null&downlx=01' +
            '&dakid=' +
            dakid +
            '&tmzt=4',
        );
        console.log('qwjsbs', pdfurl);
        window.open(
          '/api/eps/control/main/app/lib/pdf/web/viewer.html?downfile=' +
            disableDown +
            '&printfile=' +
            disablePrint +
            '&file=' +
            pdfurl +
            '&filename=' +
            filename,
        );
        //是否启用BS查阅文档工具 否
      } else {
        viewType = 'cs';
        var epsurl = 'epssoft:@fileview@?';
        var params =
          'url=http://' +
          location.hostname +
          ':' +
          location.port +
          '/api/eps/wdgl/attachdoc/download&fileid=' +
          fileid +
          '&ext=' +
          wjlx +
          '&grpid=' +
          tmresponse.data.filegrpid +
          '&doctbl=' +
          responsedata.data.bmc +
          '_FJ' +
          '&daktmid=' +
          tmid +
          '&grptbl=' +
          responsedata.data.bmc +
          '_FJFZ' +
          '&printfile=' +
          disablePrint +
          '&viewpage=' +
          '' +
          '&token=' +
          cookie.load('ssotoken') +
          '&downfile=' +
          disableDown +
          '&atdw=' +
          this.companyId +
          '&opt=view&umid=DAGL003&mkbh=' +
          null +
          '&dakid=' +
          dakid +
          '&lylx=1&lymd=888&ck=Y&iscsuse=1';
        epsurl += params;
        console.log('qwjscs', epsurl);
        window.location.href = epsurl;
      }
    }
  };

  @action queryDwList = async () => {
    if (!this.dwData || this.dwData.length === 0) {
      const response = await fetch.get(
        `/api/eps/control/main/dw/queryForListByYhid?yhid=${this.yhid}`,
      );
      if (response.status === 200) {
        //runInAction(() => {
        this.dwData = response.data;

        // });
      }
    }
  };

  @action getFullTextMenu = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/fulltextmenu/queryForPage?limit=99`,
    );
    if (response.status === 200) {
      //runInAction(() => {
      this.filterList = response.data.results;
      this.years = this.filterList;

      // });
    }
  };

  @action getDakTypeList = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/mbsz/queryAllForDistinct`,
    );
    if (response.status === 200) {
      // runInAction(() => {
      this.dakType = response.data;

      //});
    }
  };

  @action setBorrow = async () => {
    const res = await fetch.get(
      `/api/eps/control/main/daly/addIndexCart?yhid=${this.yhid}&id=${this.tmid}&dakid=${this.dakid}&fileid=${this.fileid}`,
    );
    // runInAction(() => {
    if (res.data.success) {
      //添加成功后，刷新头部数字显示
      RightStore.queryAllCartCount();
      message.success('加入借阅车成功');
      window.top.RightStore.queryAllCartCount();
      window.top.RightStore.queryAllDbswCount();
    } else {
      message.error('加入借阅车失败,' + res.data.message, 3);
    }
    // });
  };

  @action addLydts = async () => {
    const dakGrid = {
      dakid: this.dakid,
      tmid: this.tmid,
      yhid: this.yhid,
    };
    const res = await dakoptService.epssearchAddLydt(dakGrid);
    if (res.success) {
      //这里添加消息通知
      // this.addMsg();
      message.success({ type: 'success', content: '加入查档登记成功!' });
    } else {
      message.error('操作失败！原因：\r\n' + res.message);
    }
  };

  @action addMsg = async (text) => {
    var formData = new FormData();
    formData.append('yhid', this.yhid);
    formData.append('msg', text);
    formData.append('msgType', '查档登记');
    formData.append('state', 0);
    formData.append('whsj', this.getDate);
    const response = await fetch.post(`/api/eps/dsrw/pagemsg/add`, formData);
    if (response.status === 200) {
      this.queryMsgCount();
    }
  };
  @action queryMsgCount = async () => {
    const response = await fetch.post(
      `/api/eps/dsrw/pagemsg/queryCount?state=0`,
    );
    if (response.status === 200) {
      this.count = response.data.results;
    }
  };

  @observable page_No = 1;
  @observable page_Size = 50;
  @observable XcdPageList = [];
  @observable XcdTotal = 0;
  @observable startRq = '';
  @observable endRq = '';
  @observable setSqr = '';

  @action getXcdPageList = async () => {
    // const response = await fetch.get(
    //   `/api/eps/control/main/daxc/queryForPage?yhid=${this.yhid
    //   }&wfstate=W&start=${this.page_No - 1}&limit=${this.page_Size}&cx_kssqrq=${this.startRq
    //   }&cx_jssqrq=${this.endRq}&wfawaiter=${this.setSqr}`,
    // );

    const response = await fetch.get(
      `/api/eps/control/main/daxc9/queryForPage?newdjlx=2&sw=W&page=${
        this.page_No - 1
      }&limit=${this.page_Size}&cx_kssqrq=${this.startRq}&cx_jssqrq=${
        this.endRq
      }&cx_jyr=${this.setSqr}`,
    );
    if (response.status === 200) {
      var sjData = [];
      console.log('results,', response.data);
      if (response.data.results.length > 0) {
        if (
          response.data &&
          response.data.results &&
          response.data.results.length > 0
        ) {
          for (var i = 0; i < response.data.results.length; i++) {
            let newKey = {};
            newKey = response.data.results[i];
            newKey.key = newKey.id;
            sjData.push(newKey);
          }
          //let res1 = response.data.results.map(item => item.id)
          this.XcdPageList = sjData;
          this.XcdTotal = response.data.total;
        }
      }
    }
  };

  @observable KTable = [];

  @action queryKTable = async (val) => {
    const response = await fetch.get(
      `/api/eps/control/main/daly/queryKTable?dakid=${val}`,
    );
    if (response.status === 200) {
      this.KTable = response.data;
    }
  };

  @observable kdakid = '';
  @observable add_bmc = '';
  @observable add_tmid = '';
  @observable add_xcdid = '';

  @action addXcd = async () => {
    if (!this.add_xcdid) {
      message.error('请至少选择一行数据!');
    } else {
      // const response = await fetch.post(
      //   `/api/eps/control/main/daxc/addXcd?bmc=${this.add_bmc}&yhid=${this.yhid
      //   }&dakid=${this.kdakid}&ids=${this.add_tmid}&tmzt=4&dwid=${SysStore.getCurrentUser().dwid
      //   }&xcdid=${this.add_xcdid}`,
      // );

      const response = await fetch.post(
        `/api/eps/control/main/daxc9/addXcd?bmc=${this.add_bmc}&yhid=${
          this.yhid
        }&dakid=${this.kdakid}&ids=${this.add_tmid}&tmzt=4&dwid=${
          SysStore.getCurrentUser().dwid
        }&xcdid=${this.add_xcdid}`,
      );

      if (response.status === 200) {
        if (response.data.success) {
          message.success('恭喜,加入协查单成功!');
          this.add_xcdid = '';
          window.top.RightStore.queryAllDbswCount();
        } else {
          message.error(response.data.message);
        }
      }
    }
  };

  @action findDistinctbyField_Nd = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/elas/findGroupByNd`,
    );
    //runInAction(() => {
    this.ndList = response.data.data;
    //});
  };

  @action findDistinctbyField_Mbmc = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/elas/findGroupByAttrMbmc`,
    );
    //runInAction(() => {

    this.dakType = response.data.data;
    //});
  };

  @action findDistinctbyField_Flh = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/elas/findGroupByFlh`,
    );
    this.flhList = response.data.data;
    if (this.flhList) {
      var a = {};
      a.name = '无分类';
      this.flhList.push(a);
    }
  };
  //根据所选的档案库类型查询分类号
  @action findDistinctFlhByDakType = async (daktype) => {
    debugger;
    const response = await fetch.get(
      `/api/eps/control/main/elas/findFlhGroupByDakType?dakType=${daktype}`,
    );
    this.flhList = response.data.data;
    if (this.flhList) {
      var a = {};
      a.name = '无分类';
      this.flhList.push(a);
    }
  };

  @action quePage = async () => {
    var sxly = util.getSStorage('sxly');
    if (sxly == 1) {
      this.type = 'all';
      this.tmOryw = '*';
    }
    if (sxly == 2) {
      this.type = 'catalog';
      this.tmOryw = 'tm';
    }
    this.seeonsdwid = '';
    this.seeonsdwid = util.getSStorage('dwids');
    this.companyId = SysStore.getCurrentCmp().id;
    var dwname = util.getSStorage('dwname');
    if (this.seeonsdwid != '' && this.seeonsdwid != null && dwname) {
      this.tagList = [];
      var a = {};
      a.id = this.seeonsdwid;
      a.zd = 'dw';
      a.name = dwname;
      this.tagList.push(a);
    }
    this.dakids = util.getSStorage('dakids');
    this.seeonsdaktype = '';
    this.seeonsdaktype = util.getSStorage('dakType');
    if (
      this.seeonsdaktype != '' &&
      this.seeonsdaktype != null &&
      this.seeonsdaktype
    ) {
      this.tagList = [];
      var a = {};
      a.zd = 'dakType';
      a.name = this.seeonsdaktype;
      this.tagList.push(a);
    }
    this.keywords = util.getSStorage('keyword');
    console.log('eskeyows:' + util.getSStorage('keyword'));
  };

  @action findParamsValueById = async () => {
    const res = await fetch.get(
      `/api/eps/control/main/params/queryParamsValueById?pcode=DALYS020`,
    );
    this.codeValue = res.data || {};
  };

  //新增协查单申请
  @action addXcdApply = async (data) => {
    debugger;
    data['ck'] =
      data.opetionGroup && data.opetionGroup.indexOf('查看') < 0 ? 'N' : 'Y';
    data['dy'] =
      data.opetionGroup && data.opetionGroup.indexOf('打印') < 0 ? 'N' : 'Y';
    data['xz'] =
      data.opetionGroup && data.opetionGroup.indexOf('下载') < 0 ? 'N' : 'Y';
    data['sjh'] = data.sjh === undefined ? null : data.sjh;
    data['yx'] = data.yx === undefined ? null : data.yx;
    console.log('新增协查单申请data', data);
    delete data.opetionGroup;
    data.removeTaglist;
    const response = await new HttpRequest('').post({
      url: `/api/eps/control/main/daxc9/add`,
      params: data,
    });
    console.log('新增后返回', response);
    this.visible = false;
    message.success('创建协查申请成功');
    window.top.RightStore.queryAllDbswCount();
  };

  @action getUserOptionByDALYF002 = async () => {
    const url =
      '/api/eps/control/main/params/getParamsDevOption?code=DALYF002&yhid=' +
      SysStore.getCurrentUser().id;
    const response = await fetch.get(url);
    if (response.status === 200) {
      if (response.data === '' || response.data == null) {
        this.pDALYF002 = 1;
      } else {
        this.pDALYF002 = response.data;
      }
    } else {
    }
  };

  queryForPage = async () => {
    var dwids = this.seeonsdwid;
    var ndnames = '';
    var dakTypes = '';
    var flhs = '';
    for (var i = 0; i < this.tagList.length; i++) {
      if ('dw' == this.tagList[i].zd) {
        dwids = this.tagList[i].id + ',' + dwids;
      }
      if ('year' == this.tagList[i].zd) {
        ndnames = this.tagList[i].name + ',' + ndnames;
      }
      if ('dakType' == this.tagList[i].zd) {
        dakTypes = this.tagList[i].name + ',' + dakTypes;
      }
      if ('flh' == this.tagList[i].zd) {
        flhs = this.tagList[i].name + ',' + flhs;
      }
    }
    var dais = this.dakids;
    this.loading = true;
    const response = await fetch.post(
      `${this.url}/eps_search?pageNo=${this.pageno}&pageSize=${this.pagesize}&fields=attr_wjtm,text,attr_wjbt,attr_glzdz&yhid=${this.yhid}&isReact=${this.isReact}&dwids=${dwids}&ndnames=${ndnames}&dakids=${this.dakids}&sortField=${this.sortField}&sylx=${this.tmOryw}&keyword=${this.keywords}&outQuery=&inQuery=&dwid=&dakType=${dakTypes}&flh=${flhs}`,
    );
    if (response && response.status === 200) {
      //  runInAction(() => {
      this.data = [];
      this.data = this.afterQueryData(response.data);
      this.loading = false;
      // });
    } else {
      this.loading = true;
    }
  };
}
export default new EpsSearchStore('/api/eps/control/main/elas');
