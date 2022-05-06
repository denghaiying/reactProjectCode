import BaseService from "../BaseService";
import fetch from "../../utils/fetch";
import util from "../../utils/util";

class SxjcjcgzMxService extends BaseService {
  constructor(url) {
    super(url);
    this.IsLogin = false;
    this.methodNameQueryForKey = "queryForKey";
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

  findAllList(params) {
    return new Promise((resolve, reject) => {
      fetch
        .get(this.url+ "/" + "findAll", { params })
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

  doCreateTemplateString(id) {
    return new Promise((resolve, reject) => {
      fetch
        .get(`/admin/doCreateTemplateString`)
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
 
  mxDelete(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url + "/" + "delete", params)
        .then(response => {
          if (response.status === 201) {
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

   addList(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url, params)
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

export default new SxjcjcgzMxService("/api/sxjcjcgzMx");
