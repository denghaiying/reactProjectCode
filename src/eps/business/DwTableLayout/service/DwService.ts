import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import SysStore from '@/stores/system/SysStore';
import ITreeService from '@/eps/commons/panel/ITreeService'


class DwService extends BaseService implements IEpsService, ITreeService {

  constructor(url: string) {
    super(url)
  }

  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>(resolve => {
      return resolve([])
    });
  }

  // 左边单位树
  findTree(key: string = '') {
    let params = { 'dwmc': key }
    let address = "/api/eps/control/main/dw"
    let result = [{ 'id': '', title: '全部单位', key: '' }]
    return new Promise((resolve, reject) => {
      if (SysStore.getCurrentUser().golbalrole === 'SYSROLE01' || SysStore.getCurrentUser().golbalrole === 'SYSROLE02') {
        return super.get({ url: address + `/queryForList_e9_superUser`, params }).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          if (res.data && res.data.length > 0) {
            let r = this.updateTreeData(res?.data, '', [])
            result.push(...r)
          }
          return resolve(result)
        }).catch(err => {
          return reject(err)
        })

      } else {
        return super.get({ url: address + `/queryForListByYhid_ReactTree?yhid=${SysStore.getCurrentUser().id}`, params }).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          if (res.data && res.data.length > 0) {
            let r = this.updateTreeData(res?.data, '', [])
            result.push(...r)
          }
          return resolve(result)
        }).catch(err => {
          return reject(err)
        })

      }
    }
    )
  }

  updateTreeData = (list, key: React.Key, children) => {
    return list.map(node => {
      if (!node.children) {
        return {
          ...node,
          title: node.mc,
          key: node.id
        };
      }
      if (node.children) {
        return {
          ...node,
          title: node.mc,
          key: node.id,
          children: this.updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  }
}

export default new DwService('/api/eps/control/main/dw');
