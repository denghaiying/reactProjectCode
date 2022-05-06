import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Gzltj {

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
  @observable rq = [];
  @observable cjr = "";
  @observable nd = "";
  @observable daklx = "";
  @observable daklb = "";
  @observable tmzt = "";
  @observable bgqx = "";


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

    @action setDw = (dw) => {
        this.dw = dw;
    }

    @action setDakid = (dakid) => {
        this.dakid = dakid;
    }

    @action setXslx = (xslx) => {
        this.xslx = xslx;
    }


    @action setCjr = (cjr) => {
        this.cjr = cjr;
    }

    @action setRq = (rq) => {
        this.rq = rq;
    }

    @action setBgqx = (bgqx) => {
        this.bgqx = bgqx;
    }

    @action setDaklx = (daklx) => {
        this.daklx = daklx;
    }

    @action setDaklb = (daklb) => {
        this.daklb = daklb;
    }


    @action setTmzt = (tmzt) => {
        this.tmzt = tmzt;
    }

    @action setNd = (nd) => {
        this.nd = nd;
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
        debugger
        const par=this.params;
        
        const dakids=par["dakid"];
        par["dakid"]=dakids.toString();
        const daklxs=par["daklx"];
        par["daklx"]=daklxs.toString();
        const tmzts=par["tmzt"];
        par["tmzt"]=tmzts.toString();
        const bgqxs=par["bgqx"];
        par["bgqx"]=bgqxs.toString();
        const daklbs=par["daklb"];
        par["daklb"]=daklbs.toString();
        const dws=par["dw"];
        if(dws && dws !="undefined"){
          par["dw"]=dws.toString();
        }else{
          par["dw"]=SysStore.getCurrentCmp().id;
        }

        const response = await fetch
            .post(`${this.url}/queryForDagzltjQueryList`, par, { params: { ...par } });

       // const formData = new FormData();

        // dakid[]: DAK201905080013030023
        // dakid[]: DAK201907261356280061
        // dakid[]: DAK202110241701340024
        // dakid[]: DAK202111171613360011
        // xslx: tjlb
        // cjr:
        // nd:
        // daklx:
        // daklb:
        // tmzt:
        // bgqx:
        // ksrq:
        // jsrq:
        // formData.append('whrid', SysStore.getCurrentUser().id);
        // formData.append('whr', SysStore.getCurrentUser().yhmc);
        // formData.append('wtms', info.wtms);
        // formData.append('zdnr', info.zdnr);
        // formData.append('ids', ids);
        // formData.append('bmc', props.record.bmc);
        // formData.append('wtlx', info.wtlx);

        // const response=await fetch
        //   .post(`${this.url}/queryForDagzltjQueryList`, formData, { headers: { 'Content-type': 'application/x-www-form-urlencoded',dataType: "json", } });

        if (response && response.status === 200) {
            runInAction(() => {
                this.data = this.afterQueryData(response.data);
                this.loading = false;
            });
        }
        else {
            this.loading = true;
        }

    }



}

export default new Gzltj('/api/eps/control/main/basetj');
