import { observable, action, runInAction } from "mobx";
import SysStore from '../system/SysStore';
import fetch from "../../utils/fetch";
import moment from 'moment';




class RunningLogStore  {

  url="";
  wfenable=false;
  oldver=true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;

  }

  @observable isExpand = true;
  @observable expand = false;
  @observable treeData = [];
  @observable logData = [];
  @observable mkbh = "";
  @observable total = "";
  @observable selectedRowKeys = [];
  @observable yhmc = SysStore.getCurrentUser().yhmc;
  @observable yhbh = SysStore.getCurrentUser().bh;
  @observable yhid = SysStore.getCurrentUser().id;
  @observable dwid = "";
  @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  @observable params = {};
  @observable pageno = 1;
  @observable pagesize = 20;



  @observable ip = "";
  @observable op = "";
  @observable rq = [];
  @observable rqb = "";
  @observable rqe = "";


  /**
   * 审核参数
   */
  //start

  @observable yh_mc = SysStore.currentUser.yhmc
  @observable shjg = "通过";
  @observable note = "";
  //end

  /**
   * 查看窗口
   */
  @observable visible = false;
  /**
   * 审核窗口
   */
   @observable examine_visible = false;

  @observable cancel_examine_visible = false;


  @observable short = true;
  @observable shouldUpdatePosition = true;
  @observable selectedRow = "";
  @observable selectid = "";
  @observable cancel_selectid = "";
  @observable cancel_shjg = "取消审核";
  @observable ids = "";
  @observable returnRepones = 0;





  @action setExpand = (expend) => {
    this.expand = expend;
  };


  @action setSelectId = async (selectid) => {
    this.selectid = selectid;
  }

  @action setSelectedRow = async (selectedRow) => {
    this.selectedRow = selectedRow;
  }

  setParams = async (params, nosearch) => {

    this.params = params;
    if (!nosearch) {
      await this.queryTree();
    }
  };


  @action setRq = async (params) => {
    if (params) {
      this.rqb = moment(params[0]).toDate();
      this.rqe = moment(params[1]).toDate();
      console.log(this.rqb, this.rqe)
    }

  };


  @action transformName = () => {
    for (var i = 0; i < this.logData.length; i++) {
      if ("DALY" == this.logData[i].mkbh) {
        this.mkbh = "档案利用"
      }
    }
  }

  @action onPageChange = async (param, param2) => {
    this.pageno = param;
    this.pagesize = param2;
    this.queryForPage();
  }

  @action getDw = async () => {
    SysStore.setCurrentCmpList();
    var newTreeList = [];
    for (var i = 0; i < SysStore.currentCmpList.length; i++) {
      var newKey = {};
      newKey = SysStore.currentCmpList[i];
      newKey.key = newKey.id;
      newTreeList.push(newKey);
    }
    this.treeData = newTreeList;

  }





   queryForPage = async () => {
    const response = await fetch.post(`/api/eps/control/main/syslog/queryForPage`, this.params, {
      params: {
        page: this.pageno - 1,
        pagesize: this.pagesize,
        limit: this.pagesize,
        isInHistory: "N",
        dwid: this.dwid,
        yhbh: this.yhbh,
        yhmc: this.yhmc,
        ip: this.ip,
        op: this.op,
        rqb: this.rqb,
        rqe: this.rqe,
        ...this.params,
      },
    });

    if (response && response.status === 200) {
        this.total = response.data.total;
        this.logData = response.data.results;

    }
  }


  @action checkLog = async () => {

    return await fetch.get(`/api/eps/control/main/syslog/logsh?shyhid=${this.yhid}&shyhmc=${this.yhmc}&shsj=${this.getDate}&shjg=${this.shjg}&bz=${this.note}&ids=${this.selectid}`);
    // if (response.status === 200) {
    //   runInAction(() => {
    //     this.returnRepones = response.status;
    //     return;
    //   });
    // }
  }

  @action cancel_checkLog = async () => {

    return await fetch.get(`/api/eps/control/main/syslog/logsh?shyhid=${this.yhid}&shyhmc=${this.yhmc}&shsj=${this.getDate}&shjg=${this.cancel_shjg}&bz=${this.note}&ids=${this.cancel_selectid}`);
    // if (response.status === 200) {
    //   runInAction(() => {
    //     this.returnRepones = response.status;
    //     return;
    //   });
    // }
  }



};


export default new RunningLogStore("/api/eps/control/main/dak");

