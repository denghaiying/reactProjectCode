import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class OrgService extends BaseService {
  findByFid (fid) {
    return new Promise((resolve, reject) => {
      fetch
        .get(this.url, { params: { fid } })
        .then(response => {
          if (response.status === 200) {
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

export default new OrgService('/userapi/org');
