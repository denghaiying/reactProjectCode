import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class MbglService extends BaseService implements ITableService {

  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args, page: page + 1, size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        //数据渲染
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }
  // 根据模版类型与模板结构查询当前模版是否是唯一的，若不是则提示模版重复请勿重复新增
  findByLxAndJg(params, data, opt) {
    return super.findAll(params).then(res => {
      if (res.data.list.length > 0) {
        return Promise.reject('模版类型与模版结构重复,请勿重复新增!');
      }
      return Promise.resolve();
    }).then(() => {
      if (opt === "add") {
        return super.save(data);
      }
      // if (opt === "edit") {
      //   return super.update(data);
      // }
    }).catch(err => {
      return Promise.reject(err);
    })
  };
  // 新增数据
  saveByKey(key, data) {
    const params = { params: { mbtype: data.mbtype, mbeepjg: data.mbeepjg } };
    return this.findByLxAndJg(params, data, "add");
  };

  // 修改数据
  updateForTable(data) {
    // const params = { params: { mbtype: data.mbtype, mbeepjg: data.mbeepjg } };
    // return this.findByLxAndJg(params, data, "edit");
    return super.update(data);
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
}


export default new MbglService('/api/eps/e9eep/eepmb');
