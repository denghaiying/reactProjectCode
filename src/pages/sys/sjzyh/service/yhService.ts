import BaseService from '@/eps/commons/v2/BaseService';
import SysStore from '@/stores/system/SysStore';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';

class YhService extends BaseService implements IEpsService, ITableService {
  constructor(props) {
    super(props);
  }

  page(): Function {
    throw new Error('Method not implemented.');
  }

  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    // args['dwid'] = SysStore.currentCmp.id;
    let did;
    if (key) {
      did = key;
    } else {
      did = SysStore.currentUser.dwid;
    }
    args['dwid'] = did;
    args['bh'] = '';
    args['yhmc'] = '';
    args['bmid'] = '';
    args['lx'] = '';
    args['syry'] = 'N';
    args['ykyhlx'] = 'Y';
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['page'] = page;
    args['limit'] = size;
    args['sortOrder'] = '';
    args['sortField'] = '';

    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForPage', params: args })
        .then((res) => {
          console.log('00000000', res);
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data || res.results);
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
    data['id'] = `${Math.random()}`;
    data['inm'] = 'Y';
    data['mkbh'] = key;
    return super.save(data);
  }

  updateForTable(data) {
    data['inm'] = 'Y';
    return super.update(data);
  }

  deleteForTable(data) {
    return super.del(data);
  }

  findYhlx(params) {
    return new Promise((resolve, reject) => {
      return super
        .get({
          url: '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd',
          params: { bh: 'YHLX001', yhlx: 'Y' },
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let result = res.data;
          //    this.lxDataSource=response.data.map(o=>({'id':o.bh,'label':o.mc,'value':o.bh}));

          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findYhGw(params) {
    return new Promise((resolve, reject) => {
      return super
        .get({
          url: '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd',
          params: { bh: 'YHGW001' },
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let result = res.data;
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findYhMj(params) {
    return new Promise((resolve, reject) => {
      return super
        .get({
          url: '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd',
          params: { bh: '060' },
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let result = res.data;
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findYhZj(params) {
    return new Promise((resolve, reject) => {
      return super
        .get({
          url: '/api/eps/control/main/sjzdmx/querySjzdmxBySjzd',
          params: { bh: 'YHZJ' },
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let result = res.data;
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findOrg(params) {
    return new Promise((resolve, reject) => {
      return super
        .get({
          url: '/api/eps/control/main/org/queryForList',
          params: { dwid: SysStore.currentUser.dwid },
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          let result = res.data;
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

export default new YhService('/api/eps/control/main/yh');
