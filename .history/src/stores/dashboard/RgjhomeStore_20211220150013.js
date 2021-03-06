import { observable, action, runInAction, makeObservable } from 'mobx';
import BaseStore from '../BaseStore';
import LoginStore from '../system/LoginStore';
import SysStore from '../system/SysStore';
import fetch from '../../utils/fetch';
import util from '../../utils/util';
import { history } from 'umi';
import { runFunc } from '@/utils/menuUtils';

const dakurl = '/api/eps/control/main/dak/queryTreeReact';
const dburl = '/api/eps/workflow/dbsw/queryForPage?page=1&start=0&limit=5';
const tzggurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=tzgg';
const dabyurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=5&bh=byfb';
const xzzxurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=flgf';
const zpkurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=tpda';

const tzgglisturl = '/api/eps/portalui/portalui/queryForChanelNameList?bh=tzgg';
const dabylisturl = '/api/eps/portalui/portalui/queryForChanelNameList?bh=byfb';
const xzzxlisturl = '/api/eps/portalui/portalui/queryForChanelNameList?bh=flgf';

const channelsurl = '/api/eps/portalui/portalui/queryChannelList';

const datjsurl = '/api/eps/control/main/basetj/querysyzjForList';
const sytjsurl = '/api/eps/control/main/basetj/queryXsytjForList';


class RgjhomeStore extends BaseStore {
  @observable radioValue = '1';
  @observable dwData = [];
  @observable dakDataSource = [];
  @observable dbList = [];
  @observable tzggList = [];
  @observable dabyList = [];
  @observable xzzList = [];
  @observable zpkList = [];
  @observable channellist = [];

  @observable dbsize = 0;
  @observable tzggbsize = 0;
  @observable dabysize = 0;
  @observable xzzxsize = 0;
  @observable zsl = 0;
  @observable jrsl = 0;
  @observable zrsl = 0;
  @observable pjsl = 0;
  @observable ajsl = 0;
  @observable jsl = 0;
  @observable wjsize = 0;
  @observable bsw =0;
  @observable ajsw=0;

  @observable dwid = '';
  @observable dakids = '';
  @observable keyparams = '';
  @observable dwitem = {};

  @observable yh_role = SysStore.getCurrentUser().golbalrole;

  @observable qhdwid = SysStore.getCurrentCmp().id;
  @action setradioValue = (val) => {
    this.radioValue = val;
  };

  @action setdakids = (val) => {
    this.dakids = val;
  };

  @action setkeyvalue = (val) => {
    this.keyparams = val;
  };

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
  }

  @action findAllsz = async () => {
    var sjdata = [];
    const response = await fetch.get(`/api/eps/control/main/dw/queryForList`);
    if (response.status === 200) {
      runInAction(() => {
        var dlist = response.data;
        dlist.forEach((item) => {
          var a = {};
          a.value = item.id;
          a.label = item.mc;
          sjdata.push(a);
        });
        this.dwData = sjdata;
      });
    }
  };

  @action opencgll = async () => {
    const params = {
      umid:  'DALY001',
      umname: '????????????',
      path:'/runRfunc/daly'
    };
    runFunc(params);
  };

  @action doSearch = async () => {
    util.setSStorage('sxly', this.radioValue);
    util.setSStorage('dwids', this.dwid);

    if (this.dwid != '') {
      if (JSON.stringify(this.dwitem) != '{}') {
        util.setSStorage('dwname', this.dwitem.children);
      }
    }
    util.setSStorage('dakids', this.dakids);
    util.setSStorage('keyword', this.keyparams);
    console.log('keyword:' + this.keyparams);
    console.log('keywordRjhomes:' + util.getSStorage('keyword'));
    var searchType = '*';
    if (this.radioValue == 2) {
      searchType = 'tm';
    }
    // window.top.Eps.top().runFunc("DALY045", {
    //             dw: this.dwid,
    //             dakids: this.dakids,
    //             searchValue: this.keyparams,
    //             searchType:searchType
    //         });
    const params = {
      dw: this.dwid,
      dakids: this.dakids,
      searchValue: this.keyparams,
      searchType: searchType,
      umid:  'DALY045',
      umname: '????????????',
      path:'/runRfunc/epsSearch'
    };
    runFunc(params);
  };

  @action dwChange = async (dw, item) => {
    if (dw != undefined) {
      this.dwid = dw;
      this.dwitem = item;
      const url = dakurl + '?dw=' + dw + '&isby=N&noshowdw=Y&node=root';
      const response = await fetch.post(url);
      this.dakDataSource = [];
      if (response && response.status === 200) {
        this.dakDataSource = response.data;
        console.log(this.dakDataSource);
      }
    }
  };

  @action channelsList = async () => {
    const url = channelsurl;
    const response = await fetch.post(url);
    this.channellist = [];
    if (response && response.status === 200) {
      this.channellist = response.data;
    }
  };

  @action morecilke = (name) => {
    var channeid = '';
    for (var i = 0; i < this.channellist.length; i++) {
      if (this.channellist[i].sylm == name) {
        channeid = this.channellist[i].id;
      }
    }
    window.open(
      '/api/eps/portalui/contentui/queryForPage?channelid=' +
        channeid +
        '&start=1&limit=20',
    );
  };

  @action opencilke = (name, id) => {
    var channeid = '';
    for (var i = 0; i < this.channellist.length; i++) {
      if (this.channellist[i].sylm == name) {
        channeid = this.channellist[i].id;
      }
    }
    window.open(
      '/api/eps/portalui/contentui/queryForId?channelid=' +
        channeid +
        '&id=' +
        id,
    );
  };

  @action opendb = async () => {

    const params = {
      umid:  'WORKFLOW0002',
      umname: '????????????',
      path:'/runRfunc/dbsw'
    };
    runFunc(params);

    // if (window.top.Eps) {
    //   window.top.Eps.top().runFunc('WORKFLOW0002');
    // } else {
    //   const params = {
    //     dw: this.dwid,
    //     dakids: this.dakids,
    //     searchValue: this.keyparams,
    //     searchType: searchType,
    //   };
    //   history.push({ pathname: `/eps/daly/epsSearch`, query: params });
    // }
  };

  @action dodetailDbs = async (umid, wfid, wfinst, wfname, gnurl) => {
    debugger;
    // if (wfname == '????????????') {
    //   var url = '/api/eps/control/main/dak/queryForId?id=' + gnurl;
    //   var dak = await fetch.post(url);
    //   if (top.Eps) {
    //   }
    //   window.top.Eps.top().runFunc(
    //     umid,
    //     { dakid: gnurl, lx: 'K', tmzt: '11' },
    //     dak.mc,
    //   );
    // } else {
    //   window.top.parent.runFunc(umid, {
    //     wfid: wfid,
    //     wfinst: wfinst,
    //   });
    // }
    const params = {
      umid:  umid,
      umname: wfname,
      wfid: wfid,
      wfinst:wfinst,
      path:`/runRfunc/${gnurl}`
    };
    runFunc(params);
   // window.top.Eps.top().runFunc('WORKFLOW0002');
  };

  @action dbpage = async () => {
    const url = dburl;
    const response = await fetch.post(url);
    this.dbList = [];
    if (response && response.status === 200) {
      this.dbList = response.data?.results;
      this.dbsize = response.data?.total;
    }
  };

  @action tzggpage = async () => {
    const url = tzggurl;
    const response = await fetch.post(url);
    this.tzggList = [];
    if (response && response.status === 200) {
      this.tzggList = response.data?.results;
    }
  };

  @action tzgglist = async () => {
    const url = tzgglisturl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      if (response.data.success) {
        this.tzggbsize = response.data?.results.length;
      }
    }
  };

  @action dabypage = async () => {
    const url = dabyurl;
    const response = await fetch.post(url);
    this.dabyList = [];
    if (response && response.status === 200) {
      this.dabyList = response.data?.results;
    }
  };

  @action dabylist = async () => {
    const url = dabylisturl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      if (response.data.success) {
        this.dabysize = response.data?.results.length;
      }
    }
  };

  @action zpkPage = async () => {
    const url = zpkurl;
    const response = await fetch.post(url);
    this.zpkList = [];
    if (response && response.status === 200) {
      this.zpkList = response.data?.results;
    }
  };

  @action xzzxPage = async () => {
    const url = xzzxurl;
    const response = await fetch.post(url);
    this.xzzList = [];
    if (response && response.status === 200) {
      this.xzzList = response.data?.results;
    }
  };

  @action xzzxlist = async () => {
    const url = xzzxlisturl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      if (response.data.success) {
        this.xzzxsize = response.data?.results.length;
      }
    }
  };

  @action fwtjcount = async () => {
    const url = sytjsurl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      this.zsl = response.data.results?.ZS;
      this.jrsl = response.data.results?.TJSL;
      this.zrsl = response.data.results?.ZTSL;
      this.pjsl = response.data.results?.PJSL;
    }
  };

  @action datjcount = async () => {
    const url = datjsurl;
    const response = await fetch.post(url + '?dwid=' + this.qhdwid);
    if (response && response.status === 200) {
      this.ajsl = response.data.results?.ajs;
      this.jsl = response.data.results?.js;
      this.wjsize = response.data.results?.wjsize;
      this.bsw =response.data.results?.jsw;
      this.ajsw =response.data.results?.ajsw;
    }
  };
}

export default new RgjhomeStore('/api/eps/control/main/dagl');
