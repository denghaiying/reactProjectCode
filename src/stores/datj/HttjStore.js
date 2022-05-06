import { observable, action, makeObservable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';
import moment from 'moment';

class HttjStore extends BaseStore {
  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
  }
  @observable zbhttzloading = false;
  @observable htyjwjtzloading = false;
  @observable zbhttzcolumns = [];
  @observable htyjwjtzcolumns = [];
  //总部合同台账列表
  @observable zbhttzdata = [];
  //总部合同台账列表
  @observable htyjwjtzdata = [];

  setZbhttzColumns = (columns) => {
    this.zbhttzcolumns = columns;
  };
  setHtyjwjtzColumns = (columns) => {
    this.htyjwjtzcolumns = columns;
  };
  // 查询总部合同台账列表
  findZbhttz = async (params) => {
    this.zbhttzloading = true;
    const response = await fetch
      .post(`${this.url}/zbhttz`, {}, { params: { ...params } });
    if (response && response.status === 200) {
      runInAction(() => {
        this.zbhttzdata = response.data;
        this.zbhttzloading = false;
      });
    }
  }
  // 查询合同应交未交台账列表
  findHtyjwjtz = async (params) => {
    this.htyjwjtzloading = true;
    const response = await fetch
      .post(`${this.url}/htyjwjtz`, {}, { params: { ...params } });
    if (response && response.status === 200) {
      runInAction(() => {
        this.htyjwjtzdata = response.data;
        this.htyjwjtzloading = false;
      });
    }
  }
  
   //导出Excel
   @action downloadExcel = async (records,params,lx) => {
    const excel = '.xlsx';
    debugger
    fetch.post(`${this.url}` + "/exportExcel?lx="+lx+"&params="+JSON.stringify(params), records, { responseType: 'blob' }).then(response => {
      if (response.status === 200) {
        runInAction(() => {
          const data = response.data;
          if (!data) {
            Message.error('导出EXCEL失败！');
          } else {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            if(lx=="01"){
              link.setAttribute('download', `总部合同台账_ ${moment().format('YYYYMMDDHHmmss')}${excel}`);
            }else{
              link.setAttribute('download', `合同应交未交台账_ ${moment().format('YYYYMMDDHHmmss')}${excel}`);
            }
            document.body.appendChild(link);
            link.click();
          }
        });
      }
    });
  }
}

export default new HttjStore('/eps/swhy/httj');
