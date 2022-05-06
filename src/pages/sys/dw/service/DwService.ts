import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';

class DwService extends BaseService implements IEpsService, ITreeService {

  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  // 左边单位树
  findTree(key: string = '') {
    const params = { 'dwmc': key }
    const address = "/api/eps/control/main/dw"
    return new Promise((resolve, reject) => {
      return super.get({ url: address + `/queryForListByYhid?yhid=YH201904132026100005`, params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        const data = res.data.map(item => { return { id: item.id, title: item.mc, key: item.id } })
        return resolve(data)
      // const data = [{
      //   key: '001',
      //   title: '全部',
      //   children: []
      // }]
      return resolve(data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }

  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new DwService('/api/eps/control/main/dw');
