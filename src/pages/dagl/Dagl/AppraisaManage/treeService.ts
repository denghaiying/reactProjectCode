import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import util from '@/utils/util';

class MkService extends BaseService implements IEpsService, ITreeService {

  findTree(key: string = '') {

    // 未鉴定
    // 已鉴定不销毁
    // 已鉴定可销毁
    return new Promise((resolve, reject) => {
      const filter = util.getSStorage("arch_param")
      const dakid = "DAK201905080013030023"
      const bmc = "DAK0010002";
      const tmzt = 3;
      const treeData = [
        {
          key: `root`, title: "全部",  isLeaf: true
        }
      ]
      return resolve(treeData)
    }
    )
  }

  // findTree(key: string = '') {



  //   return new Promise((resolve, reject) => {
  //     return resolve([
  //       {
  //         key: "KFJD:N", title: "未鉴定", children: []

  //       },
  //       { key: "KFJD:Y", title: "已鉴定", isLeaf: true },
  //       { key: "DAKF:Y", title: "已鉴定", isLeaf: true }
  //     ])
  //   }
  //   )
  // }


  loadAsyncDataByKey(key: any, params1: Record<string, unknown>): Promise<any> {
    const dakid = "DAK201905080013030023"
    const bmc = "DAK0010002";
    const tmzt = 3;

    const treeData = []

    let params = params1 || {
      pageIndex: 0,
      pageSize: 10,
      psql: '((1=1))',
      dakid: dakid,
      tmzt: tmzt,
      lx: 3,
      bmc: bmc,
      mbid: "MB201904132039270004",
      fzlx: 'D',
      node: 'root',
      yhid: SysStore.getCurrentUser().id
    };
    if (key != '`${bmc}_KFJD#value#`') {
      // params.id = key;
      params.node = key;
    }

    // const children = treeData.find(o => {
    //   return o.key == key;
    // })?.children;
    // if (children && children.length>0) {
    //   return new Promise((resolve, reject) => {
    //     return resolve(children)
    //   }
    //   )
    // }
      return new Promise((resolve, reject) => {
        return super.get({ url: `${this.url  }/queryFztree`, params }).then(res => {
          if (res.status > 300) {
            return reject(res)
          }
          const data = Array.isArray(res.data) ? res.data.map(item => { return { id: item.id, title: item.text, key: item.id , isLeaf: item.isLeaf} }) : []
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

  findAll(params: any) {
    return new Promise((resolve, reject) => {
      return super.get({ url: this.url + '/queryForList', params }).then(res => {
        if (res.status > 300) {
          return reject(res)
        }
        let data = res.data.map(item => { return { id: item.mkbh, title: item.mc, key: item.mkbh } })
        return resolve(data)
      }).catch(err => {
        return reject(err)
      })
    }
    )
  }


}

export default new MkService('/api/eps/control/main/dagl/');
