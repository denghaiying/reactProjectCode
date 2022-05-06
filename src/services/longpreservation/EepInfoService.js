import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class EepInfoService extends BaseService {

  constructor(url) {
    super(url);
    this.IsLogin = false;
  }


  importEepinfos(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/importEepinfos", params)
        .then(response => {
          if (response.status === 201) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch(err => {
          reject(
            util.bussinessException(
              err.response ? err.response.status : "404",
              err.response ? err.response.data : err
            )
          );
        });
    });
  }

  onDetection(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/detectionEepinfos", params)
        .then(response => {
          if (response.status === 201) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        })
        .catch(err => {
          reject(
            util.bussinessException(
              err.response ? err.response.status : "404",
              err.response ? err.response.data : err
            )
          );
        });
    });
  }


}

// e9store.registerStore('sys_user', new UserService('/userapi/user'));
export default new EepInfoService('/api/eepinfo');
