import { observable, action, makeObservable, runInAction } from 'mobx';
import { Message } from '@alifd/next';
import fetch from '../../utils/fetch';
import moment from 'moment';
import { message } from 'antd';
import SysStore from "@/stores/system/SysStore";

class AjfltjStore {
  url = '';
  data = [];
  loading = false;
  dakData = [];
  mbzlxData = [];
  daklxData = false;
  lxData = [];
  zsdakData = [];
  columnData = [];
  fieldData = [];
  mbzlxMC = [];

  constructor(url) {
    this.url = url;
    makeObservable(this, {
      loading: observable,
      data: observable,
      dakData: observable,
      mbzlxData: observable,
      daklxData: observable,
      lxData: observable,
      zsdakData: observable,
      columnData: observable,
      fieldData: observable,
      mbzlxMC: observable,

      findAjfltj: action,
      findDak: action,
      findMbzlx: action,
    });
  }

  //查找档案库只取类型为01和02的
  findDak = async () => {
    const response = await fetch.get('/api/eps/control/main/dak/queryTreeNew?dw='+SysStore.getCurrentUser().dwid+'&isby=N&noshowdw=Y&node=root&lx1=01&lx2=02');
    debugger
    if (response.status === 200) {
      runInAction(() => {
        let data =response.data; 
        this.updateData(data)
        this.zsdakData = data;
      });
    }
  };
  updateData = (data) => {
    data.forEach((item) => {
      item.value = item.id;
      if (item.children.length > 0) {
        this.updateData(item.children);
      }
    });
  };
    //查询所有档案库
    findAllDak = async () => {
      const response = await fetch.get('/api/eps/control/main/dak/queryForList');
      debugger
      if (response.status === 200) {
        runInAction(() => {
          this.dakData = response.data;
        });
      }
    };
  //根据选择的档案库，显示模版著录项中的著录项
  findMbzlx = async (params) => {
    const response = await fetch.post(`${this.url}/mbzlx`, {}, { params });
    if (response && response.data.success === true) {
      runInAction(() => {
        this.mbzlxData = response.data.results;
        response.data.results.forEach((o) => {
          this.mbzlxMC.push(o.MBZLX_MC);
        });
      });
    } else if (response.data.success === false) {
      message.error(response.data.message);
      this.loading = false;
    }
  };

  // 查询在线接收统计列表
  findAjfltj = async (params) => {
    this.loading = true;
    const response = await fetch.post(
      `${this.url}/findajfltj`,
      {},
      { params: { ...params } },
    );
    if (response && response.data.success === true) {
      runInAction(() => {
        this.data = response.data.results;
        this.loading = false;
      });
    } else if (response.data.success === false) {
      message.error(response.data.message);
      this.data = [];
      this.loading = false;
    }
  };
  
}

export default new AjfltjStore('/eps/datj/ajfltj');
