import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import fetch from '@/utils/fetch';

class FwService extends BaseService implements ITableService {
  //分页查询
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    const params = { params: args, page, size };
    return new Promise((resolve, reject) => {
      return super
        .findAll(params)
        .then((res) => {
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
  findAllData(params) {
    return new Promise((resolve, reject) => {
      super
        .get({
          url: `${this.url}/list/`,
          params: { params: params },
        })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  //新增数据
  saveByKey(key, data) {
    data['id'] = `${Math.random()}`;
    return super.save(data);
  }

  //修改数据
  updateForTable(data) {
    return super.update(data);
  }

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  }
  //查询用户数据
  queryForYh(lx) {
    return new Promise((resolve, reject) => {
      fetch
        .get('/api/eps/control/main/yh/queryForList?lx=' + lx)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }
  //查询数据字典明细
  querySjzdMx(fid) {
    return new Promise((resolve, reject) => {
      fetch
        .get('/api/eps/control/main/sjzdmx/querySjzdmxBySjzd?fid=' + fid)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  //查询附件
  queryfiles(fid) {
    return new Promise((resolve, reject) => {
      fetch
        .get('/api/eps/gwgl/gwglfile/list/', {
          params: { params: { fid: fid } },
        })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }
  //删除文件
  deleteFile(id) {
    return new Promise((resolve, reject) => {
      fetch
        .delete(`/api/eps/gwgl/fw/deleteFile/${encodeURI(id)}`)
        .then((response) => {
          if (response.status === 204) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }
}
export default new FwService('/api/eps/gwgl/fw');
