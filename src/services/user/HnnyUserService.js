import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';
import diagest from '../../utils/diagest';

class UserService extends BaseService {
  userinfo = {};
  constructor(url) {
    super(url);
    this.IsLogin = false;
  }
  login(loginname, password) {
    return new Promise((resolve, reject) => {
      fetch
        .post(
          `${
            this.url
          }/doEmisLogin?loginCode=${loginname}&pd=${password}&logintime=${util.getCurrentTime()}`,
          {},
        )
        .then((response) => {
          if (response.data.success) {
            resolve(response.data.message);
          } else {
            reject(util.bussinessException(404, response.data.message));
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(err.response.status, err.response.data),
          );
        });
    });
  }

  ssoLogin(hnnyCode) {
    return new Promise((resolve, reject) => {
      fetch
        .get(`/api/sso/hnny/login?code=${hnnyCode}`,
        )
        .then((response) => {
          console.log("response---------",response)
          if (response.data.status===200) {
            resolve(response.data);
          } 
        })

    });
  }

  



  logout(token) {
    return new Promise((resolve, reject) => {
      fetch
        .get(`${this.url}/logout/${encodeURIComponent(token)}`)
        .then((response) => {
          if (response.data.success) {
            fetch
              .get(`/api/eps/control/main/removeEpsSession`)
              .then(resolve(true));
          } else {
            reject(
              util.bussinessException(response.status, response.statusText),
            );
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(
              err.response.status,
              err.response.statusText,
            ),
          );
        });
    });
  }
  checktoken(token) {
    return new Promise((resolve, reject) => {
      if (token) {
        fetch
          .get(`/api/eps/sso/token/${encodeURIComponent(token)}`)
          .then((response) => {
            if (response.data.bh) {
              resolve(response.data);
            } else {
              reject(
                util.bussinessException(response.status, response.data.message),
              );
            }
          })
          .catch((err) => {
            if (err.response) {
              reject(
                util.bussinessException(
                  err.response.status,
                  err.response.statusText,
                ),
              );
            } else {
              reject(util.bussinessException(501, err.message));
            }
          });
      } else {
        reject(util.bussinessException(404, 'token不存在或者已失效'));
      }
    });
  }
  getUserInfo = () => util.getSStorage('user');

  getSsoUserInfo() {
    return new Promise((resolve, reject) => {
      fetch
        .get(`${this.url}/userinfo`)
        .then((response) => {
          if (response.data.bh) {
            resolve(response.data);
          } else {
            reject(
              util.bussinessException(response.status, response.data.message),
            );
          }
        })
        .catch((err) => {
          if (err.response) {
            reject(
              util.bussinessException(
                err.response.status,
                err.response.statusText,
              ),
            );
          } else {
            reject(util.bussinessException(501, err.message));
          }
        });
    });
  }

  changepassword(id, newpassword, oldpassword) {
    return new Promise((resolve, reject) => {
      const jn = { password: newpassword };
      if (oldpassword) {
        jn.oldpassword = diagest.md5(oldpassword);
      }
      fetch
        .patch(`${this.url}/changepassword/${encodeURIComponent(id)}`, jn)
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

  changepw(loginname, password, oldpassword) {
    return new Promise((resolve, reject) => {
      fetch
        .post(
          `${this.url}/changePasswordNoLogin?yhid=${loginname}&password=${password}&oldpassword=${oldpassword}`,
          {},
        )
        .then((response) => {
          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(404, response.data.message));
          }
        })
        .catch((err) => {
          reject(
            util.bussinessException(err.response.status, err.response.data),
          );
        });
    });
  }

  getCode() {
    return new Promise((resolve, reject) => {
      fetch
        .get(`/sso/hnny/code`)
        .then((response) => {
          if (response.data.bh) {
            resolve(response.data);
          } else {
            reject(
              util.bussinessException(response.status, response.data.message),
            );
          }
        })
        .catch((err) => {
          if (err.response) {
            reject(
              util.bussinessException(
                err.response.status,
                err.response.statusText,
              ),
            );
          } else {
            reject(util.bussinessException(501, err.message));
          }
        });
    });
  }






}




// e9store.registerStore('sys_user', new UserService('/userapi/user'));
export default new UserService('/sso/hnny');
