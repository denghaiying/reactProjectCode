import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITreeService, ITableService } from '@/eps/commons/panel';
import SysStore from '../../../stores/system/SysStore';

import tree3 from '@/styles/assets/img/oa-manage/icon_tree3.png';
import tree1 from '@/styles/assets/img/oa-manage/icon_tree1.png';
import tree2 from '@/styles/assets/img/oa-manage/icon_tree2.png';

class DakService
  extends BaseService
  implements IEpsService, ITreeService, ITableService
{
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>((resolve) => {
      return resolve([]);
    });
  }

   getIconByType (type){
    if (type == 'F') {
      return "<img src={tree1} />";
    }
    if (type == '01') {
      return "<img src={tree3} />";
    }
    if (type == '02') {
      return "<img src={tree2} />";
    } else {
      return "<img src={tree3} />";
    }
  };

   getTreeNodeData (treeNodes) {
     debugger
    let nodes = treeNodes.map((node) => {
      debugger
      node.icon = getIconByType(node.lx);
      if (node.children && node.children.length > 0) {
        node.children = getTreeNodeData(node.children);
      }
      return node;
    });
    return nodes;
  };

  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    args['dw'] = key || SysStore.getCurrentCmp().id;
    args['isby'] = 'N';
    args['node'] = 'root';
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = '';
    args['sortOrder'] = '';
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryAllTree_e9', params: args })
        .then((res) => {
          debugger
          if (res.status > 300) {
            return reject(res);
          }
           let data = getTreeNodeData(res.data)
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findAll(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryForPage', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  saveByKey(key, data) {
    return super.save(data);
  }

  updateForTable(data) {
    return super.update(data);
  }

  deleteForTable(data) {
    return super.del(data);
  }

  //???????????????
  findTree(key: string = '') {
    let params = { dwmc: key };
    let address = '/api/eps/control/main/dw';
    return new Promise((resolve, reject) => {
      return super
        .get({
          url:
            address +
            `/queryForListByYhid?yhid=${SysStore.getCurrentUser().id}`,
          params,
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let data = res.data.map((item) => {
            return { id: item.id, title: item.mc, key: item.id };
          });
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  addDakFz(data) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/addDakfz', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  addDak(data) {
    console.log('data???????????????', data);
    //??????????????????Switch????????????????????????????????????
    data['qwjs'] = data.qwjs ? 'Y' : 'N';
    data['instdh'] = data.instdh ? 'Y' : 'N';
    data['sjlc'] = data.sjlc ? 'Y' : 'N';
    data['gdlc'] = data.gdlc ? 'Y' : 'N';
    data['wjzh'] = data.wjzh ? 'Y' : 'N';
    data['sxjc'] = data.sxjc ? 'Y' : 'N';
    data['syxs'] = data.syxs ? 'Y' : 'N';
    data['zlsyxs'] = data.zlsyxs ? 'Y' : 'N';
    data['glsyxs'] = data.glsyxs ? 'Y' : 'N';
    data['wlb'] = data.wlb === undefined ? null : data.wlb;
    data['xh'] = data.xh === undefined ? null : data.xh;
    data['cqbc'] = data.cqbc ? 'Y' : 'N';
    //??????

    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/add', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  updateDak(data) {
    console.log('updateData???????????????', data);
    //??????????????????Switch????????????????????????????????????

    debugger;
    data['qwjs'] = data.qwjs ? 'Y' : 'N';
    data['instdh'] = data.instdh ? 'Y' : 'N';
    data['sjlc'] = data.sjlc ? 'Y' : 'N';
    data['gdlc'] = data.gdlc ? 'Y' : 'N';
    data['wjzh'] = data.wjzh ? 'Y' : 'N';
    data['sxjc'] = data.sxjc ? 'Y' : 'N';
    data['syxs'] = data.syxs ? 'Y' : 'N';
    data['zlsyxs'] = data.zlsyxs ? 'Y' : 'N';
    data['glsyxs'] = data.glsyxs ? 'Y' : 'N';
    data['cqbc'] = data.cqbc ? 'Y' : 'N';

    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/update', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  updateDakfz(data) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/updateDakfz', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  queryMbList(data) {
    let address = '/api/eps/control/main/mb';
    return new Promise((resolve, reject) => {
      return super
        .post({ url: address + '/queryForPage', params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          } else {
            var sjData = [];
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                let newKey = {};
                newKey = res.data[i];
                newKey.key = newKey.id;
                newKey.title = newKey.lable;
                sjData.push(newKey);
              }
              return resolve(sjData);
            }
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  deleteDakfz(data) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/deleteDakfz', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  deleteDak(data) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/delete', params: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  moveFunction(data) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/updateDakXh', data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  page(): Function {
    throw new Error('Method not implemented.');
  }
}

export default new DakService('/api/eps/control/main/dak');
