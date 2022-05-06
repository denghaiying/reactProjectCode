import BaseService from '@/eps/commons/v3/BaseService';
import {ITableService,} from "@/eps/commons/panel";
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from "@/stores/system/SysStore";
import moment from 'moment';

class OpinionService extends BaseService implements IEpsService, ITableService {
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url+"/findForPage",args,page,size);
  }

  saveByKey(key, data) {
    return super.save(data);
  }

  updateForTable(data) {
    return super.update(data);
  }

  deleteForTable(data) {
    return super.delete(data);
  }

}

export default new OpinionService('/api/streamingapi/opinion');
