import BaseService from "../BaseService";
import fetch from "../../utils/fetch";
import util from "../../utils/util";

class ZsmkbjfjService extends BaseService {
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
 
  delete(id, record) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url+"/deletefj", record, { params: { id} })
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

export default new ZsmkbjfjService("/eps/ksh/zsmkbjfj");
