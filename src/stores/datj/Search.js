import { observable, action } from 'mobx';
import BaseStore from '../BaseStore';
import SearchService from '../../services/datj/SearchService.js';
import fetch from '../../utils/fetch';
import diagest from '../../utils/diagest';
import SysStore from '../system/SysStore';


const dwurl="/api/eps/control/main/dw/queryForListByYhid";
const dakurl="/api/eps/control/main/dak/queryTreeReact";
const bgqxurl="/api/eps/control/main/daly/querySjzd";
const daklburl="/api/eps/control/main/dak/queryDakfzForPage";
const dajdlxurl="/api/eps/control/main/dajdlx/queryForList";
const yhurl="/api/eps/control/main/yh/queryForList";

class SearchStore {

     
  url = "";
  wfenable = false;
  oldver = true;
  constructor(url, wfenable, oldver = true) {
    this.url = url;
    this.wfenable = wfenable;
    this.oldver = oldver;

  }


  @observable passwordValues = {};
  @observable pswModalVisible = false;
  @observable rsModalVisible = false;
  @observable dakDataSource = [];
  @observable dwDataSource = [];
  @observable bgqxDataSource = [];
  @observable dakValue = '';
  @observable daklbDataSource = [];
  @observable dajdlxDataSource = [];
  @observable yhDataSource = [];




  beforeSetEditRecord (value) {
    value.uenable = value.TaskEnable === 1;
    return value;
  }

  beforeSaveData (values) {
    const d = values;
    d.TaskEnable = d.uenable ? 1 : 0;
    return values;
  }

  @action queryYh = async () => {

    this.loading = true;
    const dw= SysStore.currentUser;
    const dwid= SysStore.currentUser.dwid;
    const url=yhurl+"?dwid="+dwid;
    const response = await fetch
        .post(url);
    if (response && response.status === 200) {
      this.yhDataSource=response.data.map(o=>({'label':o.yhmc,'value':o.id}));
    } else {
      this.loading = true;
    }
  }

  @action queryDak = async () => {
    this.loading = true;
    const dwid= SysStore.currentUser.dwid;
    let urlstr="?dw="+dwid+"&isby=N&noshowdw=Y&node=root"

    const url=dakurl+urlstr;
    const response=await fetch.post(url);
    if (response && response.status === 200) {
      this.dakDataSource=response.data;
    }else {
      this.loading=true;
    }

  }


  @action queryDw = async () => {
    this.loading = true;
    const response = await fetch
      .post(dwurl);
      debugger
      
    if (response && response.status === 200) {
      
      this.dwDataSource=response.data.map(o=>({'label':o.dwname,'value':o.id}));
      console.log("dwDataSource",this.dwDataSource);
    } else {
      this.loading = true;
    }
  }

  @action queryBgqx = async () => {

    this.loading = true;
    const url1=bgqxurl+"?zdx=保管期限";
    const response = await fetch
      .post(url1);
    if (response && response.status === 200) {
      this.bgqxDataSource=response.data.results.map(o=>({'label':o.mc,'value':o.mc}));
    } else {
      this.loading = true;
    }
  }


  @action queryDajdlx = async () => {

    this.loading = true;

    const response = await fetch
        .post(dajdlxurl);

    if (response && response.status === 200) {
      this.dajdlxDataSource=response.data.map(o=>({'label':o.mc,'value':o.mc}));
    } else {
      this.loading = true;
    }
  }

  @action queryDaklb = async () => {

    this.loading = true;

    const lburl=daklburl+"?dw="+SysStore.currentUser.dwid;
    const responselb=await fetch.post(lburl);

    if (responselb && responselb.status === 200) {
      this.daklbDataSource=responselb.data.map(o=>({'label':o.mc,'value':o.id}));
    }else {
      this.loading=true;
    }

  }

  @action dwChange = async (dwid) => {

    if(dwid == "") {
      dwid = SysStore.currentUser.dwid;
    }

    const url=dakurl+"?dw="+dwid;
    const response=await fetch.post(url);
    if (response && response.status === 200) {
      this.dakDataSource=response.data;
    }else {
      this.loading=true;
    }



    let urlstr="?dw="+dwid+"&isby=N&noshowdw=Y&node=root";
    const lburl=daklburl+urlstr;
    const responselb=await fetch.post(lburl);
    if (responselb && responselb.status === 200) {
      this.daklbDataSource=responselb.data.map(o=>({'label':o.mc,'value':o.id}));
    }else {
      this.loading=true;
    }

    const urlyh=yhurl+"?dwid="+dwid;
    const responseyh = await fetch
        .post(urlyh);
    if (responseyh && responseyh.status === 200) {
      this.yhDataSource=response.data.map(o=>({'label':o.yhmc,'value':o.id}));
    } else {
      this.loading = true;
    }

  }

  @action dakChange = async (value) => {
      this.editRecord.taskDakid=value;
  }

  @action start = async (value) => {
    this.loading=true;
    SearchService.runTask()
    this.loading=false;
  }

  @action stop = async () => {
    this.editRecord.taskDakid=value;
  }
  @action rule = async () => {
     return await SearchService.rule(this.selectRowRecords[0]);
  }
  @action reset = async (value) => {
    return await  SearchService.reset(value);
    this.loading=false;
  }
}

export default new SearchStore();
