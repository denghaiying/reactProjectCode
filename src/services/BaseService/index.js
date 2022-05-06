import fetch from '../../utils/fetch';
import util from '../../utils/util';

class BaseService {
  constructor(url) {
    this.url = url;
  }

  findById (id) {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/${encodeURIComponent(id)}`).then(
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

  findAll (params) {
    return new Promise((resolve, reject) => {
      fetch
        .get(this.url, { params })
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

  queryForPage (params, pageno = 1, pagesize = 10) {
    return new Promise((resolve, reject) => {
      fetch
        .post(this.url, params, { params: { pageno, pagesize } })
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

  add (record) {
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
          reject(util.bussinessException(err.response.status, err.response.data));
        });
    });
  }

  /** 更新所有字段 */
  update (id, record) {
    return new Promise((resolve, reject) => {
      fetch
        .put(`${this.url}/${encodeURIComponent(id)}`, record)
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

  updatesome (id, record) {
    return new Promise((resolve, reject) => {
      fetch
        .patch(`${this.url}/${encodeURIComponent(id)}`, record)
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

  updateMenutype (id, type) {
    return new Promise((resolve, reject) => {
      fetch
        .patch(`${this.url}/${encodeURIComponent(id)} / ${encodeURIComponent(type)} `)
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

  delete (id) {
    return new Promise((resolve, reject) => {
      fetch.delete(`${this.url} / ${encodeURIComponent(id)}`).then(response => {
        if (response.status === 204) {
          resolve(true);
        } else {
          reject(util.bussinessException(response.status, response.data));
        }
      }).catch(err => {
        reject(util.bussinessException(err.response.status, err.response.data));
      });
    });
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
}

export default BaseService;
