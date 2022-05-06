import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';

import ITreeService from "@/eps/commons/panel/ITreeService";
import SysStore from "@/stores/system/SysStore";

class WfdefTreeService extends BaseService implements IEpsService, ITreeService {

  constructor(url: string) {
    super(url)
  }

  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }



  //左边单位树
  findTree(key: string = '') {
    let params = { 'name': key }
    let result = [];
    return new Promise((resolve, reject) => {

          return super.get({ url: this.url + `/queryForList`, params}).then(res => {
            if (res.status > 300) {
              return reject(res)
            }

            if (res.data && res.data.length > 0) {
              let newKey1 = {};

              newKey1.key = ''
              newKey1.title = '全部'
              newKey1.value= ''
              result.push(newKey1);
              for (let i = 0; i < res.data.length; i++) {
                let newKey = {};
                newKey = res.data[i];
                newKey.key = newKey.id
            //    newKey.title = newKey.name + '/' + newKey.xmls
                newKey.title = newKey.name + '(' + newKey.xmls +')'
                newKey.value= newKey.id
                result.push(newKey)
              }

            }
            return resolve(result)
          }).catch(err => {
            return reject(err)
          })

      }
    )
  }

  // updateTreeData = (list, key: React.Key, children) => {
  //   return list.map(node => {
  //     if (!node.children) {
  //       return {
  //         ...node,
  //         title: node.mc,
  //         key: node.id
  //       };
  //     }
  //     if (node.children) {
  //       return {
  //         ...node,
  //         title: node.mc,
  //         key: node.id,
  //         children: this.updateTreeData(node.children, key, children),
  //       };
  //     }
  //     return node;
  //   });
  // }
}

export default new WfdefTreeService('/api/eps/workflow/dbsw');
