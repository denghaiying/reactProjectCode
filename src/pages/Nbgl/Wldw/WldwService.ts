import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';

class WldwService extends BaseService implements ITableService {
  //分页查询
  findByKey(key: string | number, page: number = 1, size: number = 10, args: object = {}): Promise<any> {
    //根据单位名称,单位分类(客户、供应商)查询
    if (args['dwfl'] !== "") {
      if (args['dwfl'] === "wldwkh") {
        args['wldwkh'] = '1';
      }
      if (args['dwfl'] === "wldwgys") {
        args['wldwgys'] = '1';
      }
      delete args['dwfl'];
    }
    const params = { params: args, page, size };
    return new Promise((resolve, reject) => {
      return super.findAll(params).then(res => {
        //数据渲染
        if (res.data.list.length > 0) {
          res.data.list.forEach(e => {
            if (e.wldwkh === '1') {
              e.wldwkh = true;
            } else {
              e.wldwkh = false;
            }
            if (e.wldwgys === '1') {
              e.wldwgys = true;
            } else {
              e.wldwgys = false;
            }
            if (e.wldwsfty === '1') {
              e.wldwsfty = true;
            } else {
              e.wldwsfty = false;
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
    data['wldwsfty'] = data['wldwsfty'] === true ? '1' : '0';
    data['wldwkh'] = data['wldwkh'] === true ? '1' : '0';
    data['wldwgys'] = data['wldwgys'] === true ? '1' : '0';
    return super.save(data);
  }

  //修改数据
  updateForTable(data) {
    data['wldwsfty'] = data['wldwsfty'] === true ? '1' : '0';
    data['wldwkh'] = data['wldwkh'] === true ? '1' : '0';
    data['wldwgys'] = data['wldwgys'] === true ? '1' : '0';
    return super.update(data);
  }
  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };

}

export default new WldwService('/api/eps/nbgl/wldw');