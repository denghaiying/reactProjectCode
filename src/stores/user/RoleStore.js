import { observable, action, runInAction } from "mobx";
import BaseStore from "../BaseStore";
import SysStore from "../system/SysStore";
import fetch from "../../utils/fetch";
import moment from "moment";

class RoleStore extends BaseStore {
  isExpand = true;
  expand = false;
  treeData = [];
  logData = [];
  mkbh = "";
  total = "";
  selectedRowKeys = [];
  yhid = SysStore.getCurrentUser().id;
  dwid = "";
  getDate = moment();

  yhbh = "";
  yhmc = "";
  ip = "";
  op = "";
  rq = [];
  rqb = "";
  rqe = "";

  /**
   * 审核参数
   */
  //start

  yh_mc = SysStore.getCurrentUser().yhmc;
  shjg = "通过";
  note = "";
  //end

  /**
   * 查看窗口
   */
  visible = false;
  /**
   * 审核窗口
   */
  examine_visible = false;

  cancel_examine_visible = false;

  short = true;
  shouldUpdatePosition = true;
  selectedRow = "";
  selectid = "";
  ids = "";
  returnRepones = 0;

  setExpand = (expend) => {
    this.expand = expend;
  };

  setSelectId = async (selectid) => {
    this.selectid = selectid;
  };

  setSelectedRow = async (selectedRow) => {
    this.selectedRow = selectedRow;
  };

  setParams = async (params, nosearch) => {
    this.params = params;
    if (!nosearch) {
      await this.queryTree();
    }
  };
  setRq = async (params) => {
    if (params) {
      this.rqb = moment(params[0]).toDate();
      this.rqe = moment(params[1]).toDate();
      console.log(this.rqb, this.rqe);
    }
  };

  transformName = () => {
    for (var i = 0; i < this.logData.length; i++) {
      if ("DALY" == this.logData[i].mkbh) {
        this.mkbh = "档案利用";
      }
    }
  };

  onPageChange = async (param, param2) => {
    this.pageno = param;
    this.pagesize = param2;
    this.queryForPage();
  };

  getDw = async () => {
    SysStore.setCurrentCmpList();
    var newTreeList = [];
    for (var i = 0; i < SysStore.currentCmpList.length; i++) {
      var newKey = {};
      newKey = SysStore.currentCmpList[i];
      newKey.key = newKey.id;
      newTreeList.push(newKey);
    }
    this.treeData = newTreeList;
  };

  queryForPage = async () => {
    console.log(this.rqb);
    console.log(this.rqe);

    const response = await fetch.post(
      `/api/eps/control/main/syslog/queryForPage`,
      this.params,
      {
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
      }
    );

    if (response && response.status === 200) {
      runInAction( () => {
        this.total = response.data.total;
        let totals = response.data.total;
        var sjData = [];
        if (totals > 0) {
          for (var i = 0; i < response.data.results.length; i++) {
            var newKey = {};
            newKey = response.data.results[i];
            newKey.key = newKey.id;
            sjData.push(newKey);
          }
        }
        this.logData = sjData;
      });
    }
  };

  queryTree = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/dw/queryForListByYhid?yhid=${this.yhid}`
    );
    if (response.status === 200) {
      runInAction( () => {
        // this.treeData = response.data;
        return;
      });
    }
  };

  checkLog = async () => {
    const response = await fetch.get(
      `/api/eps/control/main/syslog/logsh?shyhid=${this.yhid}&shyhmc=${this.yh_mc}&shsj=${this.getDate}&shjg=${this.shjg}&bz=${this.note}&ids=${this.selectid}`
    );
    if (response.status === 200) {
      runInAction( () => {
        this.returnRepones = response.status;
        return;
      });
    }
  };
}

export default new RoleStore("/api/eps/control/main/dak");
