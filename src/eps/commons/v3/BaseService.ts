import HttpRequest from './HttpRequest';
import SysStore from '@/stores/system/SysStore';

class BaseService extends HttpRequest {
  url: string;

  constructor(url: string) {
    super('');
    this.url = url;
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      super
        .get(`${this.url}/${encodeURIComponent(id)}`)
        .then((response) => {
          if (response.status === 200) {
            return resolve(response.data);
          } else {
            return reject(response.data.message);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findAll(params) {
    return new Promise((resolve, reject) => {
      super
        .get({
          url: `${this.url}`,
          params: params,
        })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  queryForPage(params, pageno = 1, pagesize = 10) {
    return new Promise((resolve, reject) => {
      super
        .post({ url: this.url, params, data: { pageno, pagesize } })
        .then((response) => {
          if (response.status === 200) {
            return resolve(response.data);
          } else {
            return reject(response.data.message);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  save(data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super
        .post({ url: this.url, data: data })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  postForm(url, data) {
    if (!data) {
      data = {};
    }
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    return new Promise((resolve, reject) => {
      const fd = new FormData();

      if (data) {
        for (const key in data) {
          fd.append(key, data[key]);
        }
      }
      return super
        .post({
          url: `${url}`,
          data: fd,

          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          if (res) {
            return resolve(res);
          }
          return reject(res);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  postForm(formParams) {
    const { url = '', params } = formParams;
    let data = params;
    if (!data) {
      data = {};
    }
    data['whr'] = SysStore.getCurrentUser().yhmc;
    data['whrid'] = SysStore.getCurrentUser().id;
    return new Promise((resolve, reject) => {
      const fd = new FormData();

      if (data) {
        for (const key in data) {
          fd.append(key, data[key]);
        }
      }
      return super
        .post({
          url: `${url}`,
          data: fd,

          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          if (res) {
            return resolve(res);
          }
          return reject(res);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  update(data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      super
        .put({
          url: `${this.url}/${encodeURIComponent(data.id)}`,
          data: data,
        })
        .then((res) => {
          if (res.status === 201) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  delete(data: { id: string }) {
    return new Promise((resolve, reject) => {
      super
        .delete({ url: `${this.url}/${encodeURIComponent(data.id)}` })
        .then((response) => {
          if (response.status === 204 || response.status === 200) {
            return resolve(true);
          } else {
            return reject(response.data.message);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findForPage(url, params, pageno = 1, pagesize = 10) {
    return new Promise((resolve, reject) => {
      super
        .post({
          url: url + `?pageno=${pageno}&pagesize=${pagesize}`,
          data: params,
        })
        .then((response) => {
          if (response.status === 200) {
            return resolve(response.data);
          } else {
            return reject(response.data.message);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findList(params) {
    return new Promise((resolve, reject) => {
      super
        .post({ url: this.url + '/findList', params })
        .then((response) => {
          if (response.status === 200) {
            return resolve(response.data);
          } else {
            return reject(response.data.message);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findForKey(params) {
    return new Promise((resolve, reject) => {
      super
        .post({ url: this.url + '/findForKey', params })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            return reject(response.data.message);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  del(data) {
    console.log('delete', `${this.url}/delete?id=${data.id}`);
    return new Promise((resolve, reject) => {
      if (!data || !data.id) {
        return reject('请正确输入待删除数据');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super
        .delete(`${this.url} / ${data.id}`)
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  batchDelete(data) {
    return new Promise((resolve, reject) => {
      if (!data || !data.id) {
        return reject('请正确输入待删除数据');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super
        .post({
          url: `${this.url}/batchDelete`,
          data,
        })
        .then((res) => {
          if (res.data && res.data.success) {
            return resolve(res.data);
          }
          return reject(res.data.message);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

export default BaseService;
