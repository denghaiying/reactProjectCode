import HttpRequest from './HttpRequest';
import SysStore from '@/stores/system/SysStore';

class BaseService extends HttpRequest {
  url: string;

  constructor(url: string) {
    super('');
    this.url = url.startsWith('/api') ? url : `/api${url}`;
  }

  findAll(params) {
    return new Promise((resolve, reject) => {
      super
        .get({
          url: `${this.url}/queryForPage`,
          params: { page: 0, limit: 20 },
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

  findById(id) {
    return super.get({
      url: `${this.url}/${id}`,
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
        .get({
          url: `${this.url}/update/`,
          params: data,
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
  save(data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('请检查待保存数据，不能为空');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super
        .get({ url: this.url + '/add', params: data })
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

  delByMap(data = {}) {
    return new Promise((resolve, reject) => {
      if (!data || !data.id) {
        return reject('请正确输入待删除数据');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super
        .post({
          url: `${this.url}/delete`,
          params: data,
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

  del(data) {
    console.log('delete', `${this.url}/delete?id=${data.id}`);
    return new Promise((resolve, reject) => {
      if (!data || !data.id) {
        return reject('请正确输入待删除数据');
      }
      data['whr'] = SysStore.getCurrentUser().yhmc;
      data['whrid'] = SysStore.getCurrentUser().id;
      return super
        .post({
          url: `${this.url}/delete?id=${data.id}`,
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
