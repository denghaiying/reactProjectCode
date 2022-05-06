import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Dayjgzcltj {

  url = "";
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {

    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this)
  }

  @observable isExpand = true;
  @observable dw  = SysStore.getCurrentUser().dwid;
  @observable dakid = "";
  @observable xslx = "tjlb";
  @observable bgqx = "";
  @observable daklx = "";
  @observable nd = [];
  @observable tjxs = "";
  @observable tmzt = "";
  @observable daklb ="";
  @observable gdrmc = "";

    @observable data = [];
    @observable record = {};
    @observable params = {};
    @observable loading = false;
    @observable pageno = 1;
    @observable pagesize = 20;
    @observable opt = "view";
    @observable editVisible = false;
    @observable editRecord = {};
    @observable selectRowKeys = [];
    @observable selectRowRecords = [];
    @observable columns = [];
    @observable signcomment = "";
    @observable procOpt = {};
    @observable dataSource=[];

    @observable paramValue = "";

    columnameList=[];
    columnResult=[];

    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDdakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }

    @action setBgqx = (bgqx) => {
        this.bgqx = bgqx;
    }

    @action setDaklx = (daklx) => {
        this.daklx = daklx;
    }

    @action setTjxs = (tjxs) => {
        this.tjxs = tjxs;
    }

    @action setTmzt = (tmzt) => {
        this.tmzt = tmzt;
    }

    @action setNd = (nd) => {
        this.nd = nd;
    }

    @action setDaklb = (daklb) => {
        this.daklb = daklb;
    }

    @action setGdrmc = (gdrmc) => {
        this.gdrmc = gdrmc;
    }


    @action setExpand = (expend) => {
        this.expand = expend;
    };




    openNotification = (a, type) => {
        Notification.open({ title: a, type });
      };

      setSigncomment = (comment) => {
        this.signcomment = comment;
      };

      setColumns = (columns) => {
        this.columns = columns;
      };

      setPageNo = async (pageno) => {
        this.pageno = pageno;
        await this.queryForPage();
      };

      setPageSize = async (pageSize) => {
        this.pagesize = pageSize;
        await this.queryForPage();
      };

      setParams = async (params, nosearch) => {
        this.params = { ...params };
        if (!nosearch) {
          await this.queryForPage();
        }
      };

      setDataSource = (dataSource) => {
        this.dataSource = dataSource;
      };

      setSelectRows = async (selectRowKeys, selectRowRecords) => {

        this.selectRowKeys = selectRowKeys;
        this.selectRowRecords = selectRowRecords;
      };

      afterQueryData(data) {
        return data;
      }


    @action queryForPage = async () => {

        this.loading = true;

        const par=this.params;
        const xs=par["tjxs"];
        const lxxs=par["xslx"];
        const columsetslist = [];
        const columname=[];
        if(lxxs == "tjlb" ){
            if( xs && xs.length>0){
                for (var i = 0, l = xs.length; i < l; i++) {
                    var a = xs[i];
                    switch (a) {
                        case "dwsx":
                            columsetslist.push({
                                title: "单位名称",
                                dataIndex: "dwmc",
                                width: 100,
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dwmc - b.dwmc,
                            });
                            columname.push('单位名称');
                            break;
                        case "daksx":
                            columsetslist.push({
                                dataIndex: "dakmc",
                                width: 100,
                                title: "档案库名称",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dakmc - b.dakmc,
                            });
                            columname.push('档案库名称');
                            break
                        case "ndsx":
                            columsetslist.push({
                                dataIndex: "nd",
                                width: 100,
                                title: "年度",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.nd - b.nd,
                            });
                            columname.push('年度');
                            break;
                        case "bgqxsx":
                            columsetslist.push({
                                dataIndex: "bgqx",
                                width: 120,
                                title: "保管期限",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.bgqx - b.bgqx,
                            });
                            columname.push('保管期限');
                            break;
                        case "daklxsx":
                            columsetslist.push({
                                dataIndex: "daklx",
                                width: 100,
                                title: "档案库类型",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.daklx - b.daklx,
                            });
                            columname.push('档案库类型');
                            break;
                        case "daklbsx":
                            columsetslist.push({
                                dataIndex: "daklb",
                                width: 100,
                                title: "档案库类别",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.daklb - b.daklb,
                            });
                            columname.push('档案库类别');
                            break;
                        case "tmztsx":
                            columsetslist.push({
                                dataIndex: "tmzt",
                                width: 100,
                                title: "档案库状态",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.tmzt - b.tmzt,
                            });
                            columname.push('档案库状态');
                            break;
                        case "gdrmcsx":
                            columsetslist.push({
                                dataIndex: "gdrmc",
                                width: 120,
                                title: "人员名称",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.gdrmc - b.gdrmc,
                            });
                            columname.push('人员名称');
                            break;
                    }

                }
            }
            columsetslist.push({dataIndex: "tms", width: 100, title: "条目数量",defaultSortOrder: 'descend', sorter: (a, b) => a.tms - b.tms,fixed: 'right',});
            columsetslist.push({dataIndex: "fjs", width: 100,  title: "原文数量",defaultSortOrder: 'descend', sorter: (a, b) => a.fjs - b.fjs,fixed: 'right',});
            columsetslist.push({dataIndex: "ys", width: 100, title: "页数",defaultSortOrder: 'descend', sorter: (a, b) => a.ys - b.ys,fixed: 'right',});
            columname.push('条目数量');
            columname.push('原文数量');
            columname.push('页数');
            this.setColumns(columsetslist);
        }
        const pars=this.params;
        const dakids=pars["dakid"];
        pars["dakid"]=dakids.toString();
        const daklxs=pars["daklx"];
        pars["daklx"]=daklxs.toString();
        const tmzts=pars["tmzt"];
        pars["tmzt"]=tmzts.toString();
        const bgqxs=pars["bgqx"];
        pars["bgqx"]=bgqxs.toString();
        const daklbs=pars["daklb"];
        pars["daklb"]=daklbs.toString();
        const dws=pars["dw"];
        pars["dw"]=dws.toString();
        const tjxss=pars["tjxs"];
        pars["tjxs"]=tjxss.toString();
        const response = await fetch
            .post(`${this.url}/queryForxCltjList`, pars, { params: { ...pars } });
        if (response && response.status === 200) {
            runInAction(() => {
                this.data = this.afterQueryData(response.data);
                const records=response.data.results;
                this.columnameList = columname;
                        for(var i in records){
                            const record=records[i];
                            const obj={};
                            for(var name in record){
                                if(name === "dwmc"){
                                    obj['单位名称']=record['dwmc']
                                }else if(name === 'dakmc'){
                                    obj['档案库名称']=record['dakmc']
                                }else if(name === 'nd'){
                                    obj['年度']=record['nd']
                                }else if(name === 'bgqx'){
                                    obj['保管期限']=record['bgqx']
                                }else if(name === 'daklx'){
                                    obj['档案库类型']=record['daklx']
                                }else if(name === 'daklb'){
                                    obj['档案库类别']=record['daklb']
                                }else if(name === 'tmzt'){
                                    obj['档案库状态']=record['tmzt']
                                }else if(name === 'gdrmc'){
                                    obj['归档人']=record['gdrmc']
                                }else if(name === 'tms'){
                                    obj['条目数量']=record['tms']
                                }else if(name === 'fjs'){
                                    obj['原文数量']=record['fjs']
                                }else if(name === 'ys'){
                                    obj['页数']=record['ys']
                                }
                            }
                            this.columnResult.push(obj);
                        }
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }

    }




}

export default new Dayjgzcltj('/api/eps/control/main/basetj');
