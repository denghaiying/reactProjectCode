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
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=tzgg&channeltypelx=rightcontent';
const flfgurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=flfg&channeltypelx=rightcontent';
const dazxurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=5&bh=dazx&channeltypelx=rightcontent';
const daglzdurl =
  '/api/eps/portalui/portalui/queryForChanelName?page=1&start=0&limit=6&bh=daglzd&channeltypelx=rightcontent';

const tzgglisturl =
  '/api/eps/portalui/portalui/queryForChanelNameList?bh=tzgg&channeltypelx=rightcontent';
const flfglisturl =
  '/api/eps/portalui/portalui/queryForChanelNameList?bh=flfg&channeltypelx=rightcontent';

const dazxlisturl =
  '/api/eps/portalui/portalui/queryForChanelNameList?bh=dazx&channeltypelx=rightcontent';
const daglzdlisturl =
  '/api/eps/portalui/portalui/queryForChanelNameList?bh=daglzd&channeltypelx=rightcontent';

const channelsurl = '/api/eps/portalui/portalui/queryChannelList';

const datjsurl = '/api/eps/control/main/basetj/querysyzjForList';
const sytjsurl = '/api/eps/control/main/basetj/queryXsytjForList';
const gpcurl = '/api/eps/control/main/gcpwh/queryForList';
const rcjlurl = '/api/eps/control/main/qwjsqxvalue/queryRcjl';

class SwhyhomeStore extends BaseStore {
  @observable radioValue = '1';
  @observable dwData = [];
  @observable dakDataSource = [];
  @observable dbList = [];
  @observable tzggList = [];
  @observable flfgList = [];
  @observable dazxList = [];
  @observable xzzList = [];
  @observable daglzdList = [];
  @observable channellist = [];

  @observable dbsize = 0;
  @observable tzggbsize = 0;
  @observable flfgsize = 0;
  @observable dazxsize = 0;
  @observable daglzdsize = 0;
  @observable zsl = 0;
  @observable jrsl = 0;
  @observable zrsl = 0;
  @observable pjsl = 0;
  @observable ajsl = 0;
  @observable jsl = 0;
  @observable wjsize = 0;
  @observable bsw = 0;
  @observable ajsw = 0;

  @observable dwid = '';
  @observable dakids = '';
  @observable keyparams = [];
  @observable dwitem = {};
  @observable gpcData = [];
  @observable rcglData = [];
  @observable rcglData1 = [];
  @observable rcglData2 = [];

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
      umid: 'DALY001',
      umname: '档案利用',
      path: '/runRfunc/daly',
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
      umid: 'DALY045',
      umname: '全文检索',
      path: '/runRfunc/epsSearch',
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
      umid: 'WORKFLOW0002',
      umname: '待办事务',
      path: '/runRfunc/dbsw',
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
    // if (wfname == '功能流程') {
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
      umid: umid,
      umname: wfname,
      wfid: wfid,
      wfinst: wfinst,
      path: `/runRfunc/${gnurl}`,
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

  @action flfgpage = async () => {
    const url = flfgurl;
    const response = await fetch.post(url);
    this.flfgList = [];
    if (response && response.status === 200) {
      this.flfgList = response.data?.results;
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

  @action flfglist = async () => {
    const url = flfglisturl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      if (response.data.success) {
        this.flfgsize = response.data?.results.length;
      }
    }
  };

  @action dazxpage = async () => {
    const url = dazxurl;
    const response = await fetch.post(url);
    this.dazxList = [];
    if (response && response.status === 200) {
      this.dazxList = response.data?.results;
    }
  };

  @action dazxlist = async () => {
    const url = dazxlisturl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      if (response.data.success) {
        this.dazxsize = response.data?.results.length;
      }
    }
  };

  @action daglzdPage = async () => {
    const url = daglzdurl;
    const response = await fetch.post(url);
    this.daglzdList = [];
    if (response && response.status === 200) {
      this.daglzdList = response.data?.results;
    }
  };

  @action daglzdlist = async () => {
    const url = daglzdlisturl;
    const response = await fetch.post(url);
    if (response && response.status === 200) {
      if (response.data.success) {
        this.daglzdsize = response.data?.results.length;
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
      this.bsw = response.data.results?.jsw;
      this.ajsw = response.data.results?.ajsw;
    }
  };

  @action findgpc = async () => {
    const response = await fetch.post(gpcurl);
    if (response && response.status === 200) {
      this.gpcData = response.data.results.map((item) => ({
        value: item.id,
        label: item.ms,
      }));
    }
  };

  @action findrcjl = async () => {
    const response = await fetch.post(rcjlurl);
    if (response && response.status === 200) {
      this.rcglData = response.data;
      this.rcglData1 = this.rcglData.splice(0, 5);
      this.rcglData2 = this.rcglData;
    }
  };
}

export default new SwhyhomeStore('/api/eps/control/main/dagl');
