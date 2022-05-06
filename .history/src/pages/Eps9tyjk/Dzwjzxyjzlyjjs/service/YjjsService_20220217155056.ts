import BaseService from '@/eps/commons/v2/BaseService';

import SysStore from '../../../../stores/system/SysStore';

class YjjsService extends BaseService {
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    args['page'] = page;
    args['limit'] = size;
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['sortField'] = '';
    args['sortOrder'] = '';
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForPage', params: args })
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

  qureydajssj(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/qureydajssj', params })
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

  qureydajssytj(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/qureydajssytj', params })
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
  qureydajstjPie(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/qureydajstjPie', params })
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

  qureydajstjColumn(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/qureydajstjColumn', params })
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

  sjdatajs(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dzwjzxsqd/sjdatajs', params })
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

  sjdatajj(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/dzwjzxsqd/sjdatajj', params })
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
}

export default new YjjsService('/api/eps/control/main/dzwjzxyjjssqd');
