import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService } from '@/eps/commons/panel';

class MkService extends BaseService implements IEpsService, ITreeService {


    loadData(list,key, children): Promise<any> {
      console.log(key, children)
      return new Promise<any>(resolve => {
        return resolve(list);
      })
    }


    page(params: {}): Function {
      throw new Error('Method not implemented.');
    }

    findTree(key: string = '') {
      let params = {key}
      return new Promise((resolve, reject) => {
        return super.get({url: this.url + '/queryForList' ,params}).then(res => {
            if(res.status > 300){
              return reject(res)
            }
            // let data = []
            // for (let i = 0; i< 10; i++){
            //   let dd = res.data.map(item => {return {id: item.mkbh, title: item.mc, key: `${item.mkbh}-${i}`}})
            //   data.push(...dd)
            // }
            let data = res.data.map(item => {return {id: item.mkbh, title: item.mc, key: item.mkbh}})
            return resolve(data)
          }).catch(err => {
            return reject(err)
          })
        }
      )
    }
}

export default new MkService('/api/eps/control/main/mk/');
