import BaseService from "../BaseService";
import fetch from "../../utils/fetch";
import util from "../../utils/util";

class SxjcjcgzService extends BaseService {
  constructor(url) {
    super(url);
    this.IsLogin = false;
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

  findArchiveInfoType() {
    return new Promise((resolve, reject) => {
      fetch
        .get(this.url+"/findArchiveInfoType", {})
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

  findAllMb(params) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/findAllMb", params )
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

export default new SxjcjcgzService("/api/sxjcjcgz");
