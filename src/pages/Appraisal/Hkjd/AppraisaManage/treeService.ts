import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService } from '@/eps/commons/panel';
import SysStore from '@/stores/system/SysStore';
import util from '@/utils/util';

class MkService extends BaseService implements IEpsService, ITreeService {

  findTree(key: string = '') {

    // 未鉴定
    // 已鉴定不开放
    // 已鉴定可开放

    return new Promise((resolve, reject) => {
      const filter = util.getSStorage("arch_param")
      const dakid = filter.id
      const bmc = filter.mbc;
      const tmzt = 3;
      const treeData = [
        {
          key: `${bmc}_HKJD#value#`, title: "未划控",  isLeaf: true,
        },
        {
          key: `${bmc}_HKJD#value#D`, title: "划控中",  isLeaf: true,
        },
        {
          key: `${bmc}_HKJD#value#Y`, title: "已划控", isLeaf: false,children:[
          { key: `${bmc}_HKJD#value#Y;${bmc}_HKJD#value#N`, title: "不受控", isLeaf: true },
          { key: `${bmc}_HKJD#value#Y;${bmc}_HKJD#value#Y`, title: "受控", isLeaf: true }
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
  //         key: "HKJD:N", title: "未鉴定", children: []

  //       },
  //       { key: "HKJD:Y", title: "已鉴定", isLeaf: true },
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
        key: `${bmc}_HKJD#value#`, title: "未划控",  isLeaf: true,
      },
      {
        key: `${bmc}_HKJD#value#D`, title: "划控中",  isLeaf: true,
      },
      {
        key: `${bmc}_HKJD#value#Y`, title: "已划控", isLeaf: false,children:[
        { key: `${bmc}_HKJD#value#Y;${bmc}_DAHK#value#N`, title: "不受控", isLeaf: true },
        { key: `${bmc}_HKJD#value#Y;${bmc}_DAHK#value#Y`, title: "受控", isLeaf: true }
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
    if (key != '`${bmc}_KFJD#value#N`') {
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
