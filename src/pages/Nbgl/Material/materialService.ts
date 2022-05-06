import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class materialService extends BaseService implements ITableService {

  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    const params = { params: args, page, size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        //数据渲染
        if (res.data.list.length > 0) {
          res.data.list.forEach(e => {
            if (e.materialsfty === '1') {
              e.materialsfty = true;
            } else {
              e.materialsfty = false;
            }
          });
        }
        return resolve(res.data);
      }).catch(err => {
        return reject(err);
      })
    });
  }


  //新增数据
  saveByKey(key, data) {
    data['id'] = `${Math.random()}`;
    data['materialsfty'] = data['materialsfty'] === true ? '1' : '0';
    return super.save(data);

  };

  //修改数据
  updateForTable(data) {
    data['materialsfty'] = data['materialsfty'] === true ? '1' : '0';
    return super.update(data)
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };
}

export default new materialService('/api/eps/nbgl/material');