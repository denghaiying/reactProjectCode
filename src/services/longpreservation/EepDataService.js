import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class EepDataService extends BaseService {

  constructor(url) {
    super(url);
    this.IsLogin = false;
  }

  findByEepInfo(params) {
    return new Promise((resolve, reject) => {
      fetch
          .get(this.url+"/queryData/"+params.eepInfoId, {})
          .then(response => {
            if (response.status === 200) {
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

  queryEepColumn(params) {
    return new Promise((resolve, reject) => {
      fetch
          .get(this.url+"/queryEepColumn/"+params.eepInfoId, {})
          .then(response => {
            if (response.status === 200) {
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

   findByEepInfoJn(params) {
    return new Promise((resolve, reject) => {
      fetch
          .get(this.url+"/queryDataJn/"+params.eepInfoId, {})
          .then(response => {
            if (response.status === 200) {
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

  queryEepColumnJn(params) {
    return new Promise((resolve, reject) => {
      fetch
          .get(this.url+"/queryEepColumnJn/"+params.eepInfoId, {})
          .then(response => {
            if (response.status === 200) {
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
export default new EepDataService('/api/eepinfo');
