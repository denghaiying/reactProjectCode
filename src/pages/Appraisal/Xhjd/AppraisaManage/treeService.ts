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
      const dakid = filter.id
      const bmc = filter.mbc;
      const tmzt = 3;
      const treeData = [
        {
          key: `${bmc}_XHJD#value#`, title: "未鉴定",  isLeaf: true,
        },
        {
          key: `${bmc}_XHJD#value#D`, title: "鉴定中",  isLeaf: true,
        },
        {
          key: `${bmc}_XHJD#value#Y`, title: "已鉴定", isLeaf: false, children: [
            { key: `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#N`, title: "不销毁", isLeaf: true },
            { key: `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#X`, title: "待销毁", isLeaf: true },
            { key: `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#Y`, title: "已销毁", isLeaf: true }
          ]
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


  loadAsyncDataByKey(key: any): Promise<any> {
    const filter = util.getSStorage("arch_param")
    const dakid = filter.id
    const bmc = filter.mbc;
    const tmzt = 3;

    const treeData = [
      {
        key: `${bmc}_XHJD#value#`, title: "未鉴定", children: []

      },
      {
        key: `${bmc}_XHJD#value#Y`, title: "已鉴定", isLeaf: false, children: [
          { key: `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#N`, title: "不销毁", isLeaf: true },
          { key: `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#X`, title: "待销毁", isLeaf: true },
          { key: `${bmc}_XHJD#value#Y;${bmc}_DAXH#value#Y`, title: "已销毁", isLeaf: true }
        ]
      }
    ]


    let params = {
      pageIndex: 0,
      pageSize: 10,
      psql: '((1=1))',
      dakid: dakid,
      tmzt: tmzt,
      lx: 3,
      bmc: bmc,
      mbid: filter.mbid,
      fzlx: 'Z',
      node: 'root',
      yhid: SysStore.getCurrentUser().id
    };
    if (key != '`${bmc}_KFJD#value#`') {
      params.id = key;
    }

    const children = treeData.find(o => {
      return o.key == key;
    })?.children;
    if (children && children.length>0) {
      return new Promise((resolve, reject) => {
        return resolve(children)
      }
      )
    }else{
        return new Promise((resolve, reject) => {
          return super.get({ url: this.url + '/queryFztree', params }).then(res => {

            if (res.status > 300) {
              return reject(res)
            }
            let data = res.data.map(item => { return { id: item.id, title: item.text, key: item.id } })
            return resolve(data)
          }).catch(err => {
            return reject(err)
          })
        }
      )
    }





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
