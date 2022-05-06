import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class FrontService extends BaseService {

  constructor(url) {
    super(url);
    this.IsLogin = false;
  }

  runTask() {
    return new Promise((resolve, reject) => {
      fetch
        .get(`${this.url}/run`)
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

  stopTask() {
    return new Promise((resolve, reject) => {
      fetch
      //  .get(`${this.url}/stop/${encodeURIComponent(id)}`)
        .get(`${this.url}/stop`)
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

  rule(record) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/rule", record)
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

  findTableColumns (params) {
    return new Promise((resolve, reject) => {
      fetch
        .get(this.url+"/tableColumn/"+params.tb, {})
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

// e9store.registerStore('sys_user', new UserService('/userapi/user'));
export default new FrontService('/api/front');
