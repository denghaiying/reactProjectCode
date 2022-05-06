import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class OptrightService extends BaseService {
  save(roleid, sysid, record) {
    return new Promise((resolve, reject) => {
      fetch
        .put(
          `${this.url}/${encodeURIComponent(roleid)}/${encodeURIComponent(
            sysid,
          )}`,
          record,
        )
        .then((response) => {
          if (response.status === 201) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(err.response.status, err.response.data),
          );
        });
    });
  }
  getFunctionInfo(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: '/api/eps/control/main/getFunctionInfo', params })
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

export default new OptrightService('/userapi/optright');
