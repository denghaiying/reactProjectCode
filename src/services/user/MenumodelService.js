import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class MenumodelService extends BaseService {
  queryNMenuFunc (sysid) {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/nfunc/${encodeURIComponent(sysid)}`).then(
        response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        }
      ).catch(err => {
        reject(util.bussinessException(err.response.status, err.response.data));
      });
    });
  }

  save (roleid, sysid, record) {
    return new Promise((resolve, reject) => {
      fetch
        .put(`${this.url}/${encodeURIComponent(roleid)}/${encodeURIComponent(sysid)}`, record)
        .then(response => {
          if (response.status === 201) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch(err => {
          reject(util.bussinessException(err.response.status, err.response.data));
        });
    });
  }
}

export default new MenumodelService('/userapi/menu');
