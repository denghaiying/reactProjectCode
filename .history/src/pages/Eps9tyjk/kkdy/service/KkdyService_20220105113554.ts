import BaseService from '@/eps/commons/v3/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import {ITableService, ITreeService} from "@/eps/commons/panel";


class KkdyService extends BaseService implements IEpsService, ITableService {

  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    return super.findForPage(this.url+"/findForPage",args,page,size);
 }

  saveByKey(key, data) {
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    return super.save(data)
  }

  updateForTable(data) {

    return super.update(data)
  }

  deleteForTable(data) {
    return super.del(data);
  }
}

export default new KkdyService('/api/eps9/tyjk/kkdy');
