import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class UserroleService extends BaseService {
  findByRoleId (roleId) {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/role/${encodeURIComponent(roleId)}`).then(
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

  findByUserId (userId) {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/user/${encodeURIComponent(userId)}`).then(
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

  updateByRoleId (roleId, record) {
    return new Promise((resolve, reject) => {
      fetch
        .put(`${this.url}/role/${encodeURIComponent(roleId)}`, record)
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

  updateByUserId (userId, record) {
    return new Promise((resolve, reject) => {
      fetch
        .put(`${this.url}/user/${encodeURIComponent(userId)}`, record)
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

export default new UserroleService('/userapi/userrole');
