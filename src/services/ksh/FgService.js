import BaseService from "../BaseService";
import fetch from "../../utils/fetch";
import util from "../../utils/util";

class FgService extends BaseService {
  constructor(url) {
    super(url);
    this.IsLogin = false;
  }


   findForPage(params, pageno = 1, pagesize = 10) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/findForPage", params, { params: { pageno, pagesize } })
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


   findList(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/findList", params)
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


   findForKey(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/findForKey",params)
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

  add(record) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url, record)
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


  delete(id) {
    return new Promise((resolve, reject) => {
      fetch
        .delete(`${this.url}/${encodeURIComponent(id)}`)
        .then(response => {
          if (response.status === 204) {
            resolve(true);
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

  uploadfile(record) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/uploadfile", record)
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

export default new FgService("/eps/ksh/fg");
