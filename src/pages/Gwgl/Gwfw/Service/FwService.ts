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
  //删除文件
  deletefileByID(params) {
    return new Promise((resolve, reject) => {
      fetch
        .get(
          `/api/eps/gwgl/doctype/deleteFile?id=${
            params.id
          }&filename=${encodeURI(params.filename)}`,
        )
        .then((response) => {
          if (response.status === 200) {
            resolve(true);
          } else {
            debugger;
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
