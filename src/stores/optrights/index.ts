import { makeAutoObservable, runInAction } from 'mobx';
import util from '@/utils/util';
import OptrightService from '@/services/user/OptrightService';
import SysStore from '../system/SysStore';
import qs from 'qs';

// 接口:可选属性
type optsType = {
  umid?: string,
}
class BaseLayouttStore {
  opts: optsType = {};



  constructor() {
    makeAutoObservable(this);
  }
  initOpts = (umid: string) => {
  
   // let opt = ;
    if (!this.opts[umid]) {
      const optright = await OptrightService.getFunctionInfo({ umid });
      debugger
      runInAction(() => {
        this.opts[umid]=optright;
      })
    }
  }
  hasRight=(umid:string)=>{
    this.initOpts(umid)
    if(!this.opts){
      return false;
    }
    return this.opts[umid].indexOf(umid)>0;
  }

};
 
}
export default new BaseLayouttStore();
