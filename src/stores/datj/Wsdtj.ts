import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from "@/stores/system/SysStore";
import moment from 'moment';

class Wsdtj {


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
  @observable dw = [SysStore.getCurrentUser().dwid];
  @observable dakid = "";
  @observable xslx = "tjlb";
  @observable bgqx = "";
  @observable daklx = "";
  @observable nd = [];
  @observable tjxs = ['dwsx'];
  @observable tmzt = "";
  @observable yf = "";

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
  @observable dataSource = [];

  @observable paramValue = "";
  //用户权限下所有的dwid,不选单位时取这个值
  yhdwData = [];
  //监测点下拉数据源
  jcdDataSource = [];
  excelData = [];
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

  @action setData = (data) => {
    this.data = data;
  }

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

  @action queryForPage = async (values) => {
    const response = await fetch
      .post(`${this.url}/queryNewWsdtjForList`, values);
    return response;
  }

  //获取监测点下拉数据
  queryJcd = async (values) => {
    const response = await fetch.post(`/eps/control/main/wsd/queryJcdFormWsdByKf`, values);
    if (response && response.status === 200) {
      this.jcdDataSource = response.data;
    }
  }

  @action downloadExcel = async (records) => {
    const excel = '.xlsx';
    fetch
      .post('/api/eps/datj/wsdtj/exportExcel',{data:records,tjxs:this.tjxs}, {
        responseType: 'blob',
      })
      .then((response) => {
        if (response.status === 200) {
          runInAction(() => {
            const data = response.data;
            if (!data) {
              message.error('导出EXCEL失败！');
            } else {
              const url = window.URL.createObjectURL(new Blob([data]));
              const link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute(
                'download',
                `温湿度统计${excel}`,
              );
              document.body.appendChild(link);
              link.click();
            }
          });
        }
      });
  };


}

export default new Wsdtj('/api/eps/control/main/basetj');
