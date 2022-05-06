import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";

class Kfaqtj {

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
        const lxxs=par["xslx"];

        this.params["qkey"] = "Datj.kfaqtj";

        
        const response = await fetch
            .post(`${this.url}/queryForList`, this.params, { params: { ...this.params } });
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

export default new Kfaqtj('/api/eps/control/main/basetj');
