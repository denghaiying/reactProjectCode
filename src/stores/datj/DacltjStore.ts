import { observable, action, makeAutoObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import SysStore from '@/stores/system/SysStore';

class DacltjStore {
  url = '';
  wfenable = false;
  oldver = true;

  @observable isExpand = true;
  @observable dw = [SysStore.getCurrentUser().dwid];
  @observable dakid = '';
  @observable xslx = 'tjlb';
  @observable bgqx = '';
  @observable daklx = '';
  @observable nd = [];
  @observable tjxs = ['dwsx'];
  @observable tmzt = ['3'];
  @observable qzmc = [];
  @observable data = [];
  @observable record = {};
  @observable params = {};
  @observable loading = false;
  @observable pageno = 1;
  @observable pagesize = 20;
  @observable opt = 'view';
  @observable editVisible = false;
  @observable editRecord = {};
  @observable selectRowKeys = [];
  @observable selectRowRecords = [];
  columns = [];
  @observable signcomment = '';
  @observable procOpt = {};
  @observable dataSource = [];

  @observable paramValue = '';

  columnameList = [];
  columnResult = [];
  //全宗下拉数据源
  qzmcDataSource=[];
  //用户权限下所有的dwid,不选单位时取这个值
  yhdwData=[];
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;
    makeAutoObservable(this);
  }

  @action setDw = (dw) => {
    this.dw = dw;
  };

  @action setDakid = (dakid) => {
    this.dakid = dakid;
  };

  @action setXslx = (xslx) => {
    this.xslx = xslx;
  };

  @action setBgqx = (bgqx) => {
    this.bgqx = bgqx;
  };

  @action setDaklx = (daklx) => {
    this.daklx = daklx;
  };

  @action setTjxs = (tjxs) => {
    this.tjxs = tjxs;
  };

  @action setTmzt = (tmzt) => {
    this.tmzt = tmzt;
  };

  
  @action setQzmc = (qzmc) => {
    this.qzmc = qzmc;
  };

  @action setNd = (nd) => {
    this.nd = nd;
  };

  @action setExpand = (expend) => {
    this.expand = expend;
  };
  @action setData=(data)=>{
    this.data=data;
  }

  openNotification = (a, type) => {
    Notification.open({ title: a, type });
  };

  setSigncomment = (comment) => {
    this.signcomment = comment;
  };

  setColumns = (columns) => {
    runInAction(() => {
      this.columns = columns;
    });
  };

  setPageNo = async (pageno) => {
    this.pageno = pageno;
    await this.queryForPage();
  };

  setPageSize = async (pageSize) => {
    this.pagesize = pageSize;
    await this.queryForPage();
  };

  setExcleContent = (records)=>{
    this.columnResult = [];
    for (var i in records) {
      const record = records[i];
      const obj = {};
      for (var name in record) {
        if (name === 'dwmc') {
          obj['单位'] = record['dwmc'];
        } else if (name === 'dakmc') {
          obj['档案库'] = record['dakmc'];
        } else if (name === 'nd') {
          obj['年度'] = record['nd'];
        } else if (name === 'bgqx') {
          obj['保管期限'] = record['bgqx'];
        } else if (name === 'daklx') {
          obj['档案类型'] = record['daklx'];
        } else if (name === 'daklb') {
          obj['档案类别'] = record['daklb'];
        } else if (name === 'tmzt') {
          obj['档案状态'] = record['tmzt'];
        }
        // else if (name === 'gdbmsx') {
        //   obj['归档部门'] = record['gdbm'];
        // } 
        else if (name === 'gdrmc') {
          obj['归档人'] = record['gdrmc'];
        } else if (name === 'tms') {
          obj['条目数量'] = record['tms'];
        } else if (name === 'fjs') {
          obj['原文数量'] = record['fjs'];
        } else if (name === 'ys') {
          obj['页数'] = record['ys'];
        }else if (name === 'ywdx') {
          obj['原文大小（G）'] = record['ywdx'];
        }
      }
      this.columnResult.push(obj);

    }
    console.log('columsetslist=====', this.columnResult);
  } 
  setExcleHeader = ()=>{
      this.columnameList=[];
    if (this.tjxs.length > 0) {
      for (var i in this.tjxs) {
        s:switch (this.tjxs[i]) {
          case 'dwsx':
            this.columnameList.push('单位');
            break s;
          case 'daklbsx':
            this.columnameList.push('档案类别');
            break s;
          case 'daksx':
            this.columnameList.push('档案库');
            break s;
          case 'daklxsx':
            this.columnameList.push('档案类型');
            break s;
          case 'tmztsx':
            this.columnameList.push('档案状态');
            break s;
          case 'ndsx':
            this.columnameList.push('年度');
            break s;
          case 'bgqxsx':
            this.columnameList.push('保管期限');
            break s;
          case 'gdbmsx':
            this.columnameList.push('归档部门');
            break s;
          case 'gdrmcsx':
            this.columnameList.push('归档人');
            break s;
        }
      }

    }
    this.columnameList.push('条目数量');
    this.columnameList.push('原文数量');
    this.columnameList.push('页数');
    this.columnameList.push('原文大小（G）');
  }

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

 searchCltjResult = async (values)=>{
  this.params = { ...values };
  const response = await fetch.post(`${this.url}/queryForNewDacltjQueryList`,this.params);
  return response;
  }
  //获取全宗下拉数据源
  queryQzmcDataSource = async (values)=>{
    const response = await fetch.post(`/eps/datj/tmmx/queryQzmcFormTmmxbBydw`,values);
    if(response&&response.status===200){
      this.qzmcDataSource = response.data;
    }
    }
}

export default new DacltjStore('/api/eps/control/main/basetj');
