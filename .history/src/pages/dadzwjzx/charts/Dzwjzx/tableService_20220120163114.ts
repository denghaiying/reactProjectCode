import BaseService from '@/eps/commons/v2/BaseService';

class TableService extends BaseService {
  queryDzwjzxCharts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryDzwjzxtjForList', params })
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
  queryNdkfCharts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryNdkfCharts', params })
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
  queryKzkzCharts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryKzkzCharts', params })
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
  queryKfjlCharts(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryKfjlCharts', params })
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

export default new TableService('/api/eps/control/main/dagl');
