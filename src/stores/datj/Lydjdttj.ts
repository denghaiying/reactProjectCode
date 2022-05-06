import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Lydjdttj {

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
    @observable dw  = SysStore.currentUser.dwid;
    @observable dakid = "";
    @observable xslx = "tjlb";
    @observable djr = "";
    @observable daklx = "";
    @observable rq = [];
    @observable tjxs = "";
    @observable tmzt = "";
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

    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }

    @action setDjr = (djr) => {
        this.djr = djr;
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

    @action setRq = (rq) => {
        this.rq = rq;
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

        ;
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
                                dataIndex: "dw",
                                key: "dw",
                                width: 100,
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dw - b.dw,
                            });
                            columname.push('单位名称');
                            break;
                        case "daksx":
                            columsetslist.push({
                                dataIndex: "dakmc",
                                key: "dakmc",
                                width: 100,
                                title: "档案库名称",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.dakmc - b.dakmc,
                            });
                            columname.push('档案库名称');
                            break
                        case "daklxsx":
                            columsetslist.push({
                                dataIndex: "daklx",
                                key: "daklx",
                                width: 100,
                                title: "档案库类型",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.daklx - b.daklx,
                            });
                            columname.push('档案库类型');
                            break;
                        case "tmztsx":
                            columsetslist.push({
                                dataIndex: "tmzt",
                                key: "tmzt",
                                width: 100,
                                title: "档案库状态",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.tmzt - b.tmzt,
                            });
                            columname.push('档案库状态');
                            break;
                        case "djsjsx":
                            columsetslist.push({
                                dataIndex: "djrq",
                                key: "djrq",
                                width: 120,
                                title: "归档人",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.djrq - b.djrq,
                            });
                            columname.push('归档人');
                            break;

                        case "djrsx":
                            columsetslist.push({
                                dataIndex: "djr",
                                key: "djr",
                                width: 120,
                                title: "登记人",
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => a.djr - b.djr,
                            });
                            columname.push('登记人');
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
        const response = await fetch
            .post(`${this.url}/queryForxLydtdjtjist`, this.params, { params: { ...this.params } });
        if (response && response.status === 200) {
            runInAction(() => {
                this.data = this.afterQueryData(response.data);
                const records=response.data.results;
                this.columnameList = columname;
                        for(var i in records){
                            const record=records[i];
                            const obj={};
                            for(var name in record){
                                if(name === "dw"){
                                    obj['单位名称']=record['dw']
                                }else if(name === 'dakmc'){
                                    obj['档案库名称']=record['dakmc']
                                }else if(name === 'daklx'){
                                    obj['档案库类型']=record['daklx']
                                }else if(name === 'tmzt'){
                                    obj['档案库状态']=record['tmzt']
                                }else if(name === 'djrq'){
                                    obj['归档人']=record['djrq']
                                }else if(name === 'djr'){
                                    obj['登记人']=record['djr']
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

export default new Lydjdttj('/api/eps/control/main/basetj');
