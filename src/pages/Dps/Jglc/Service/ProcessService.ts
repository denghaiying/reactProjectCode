import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import { json } from 'express';
import fetch from '@/utils/fetch';
// import 
class ProcessService extends BaseService implements ITableService {

  workdata = [];
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

  // 新增数据
  saveByKey(key: string, data: { [x: string]: string; workctt?: any; }) {
    data['workctt'] = (data.workctt).toString();
    data['id'] = `${Math.random()}`
    return super.save(data)
  };

  // 修改数据
  updateForTable(data: { [x: string]: any; workctt?: any; }) {
    data['workctt'] = (data.workctt).toString();
    return super.update(data)
  };

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  };

  async findWorkdata() {
    const response = await fetch.get("/api/eps/dps/work/");
    if (response.status === 200) {
      if (response.data.length !== 0) {
        this.workdata = response.data.list.map((item: { code: any; name: any; }) => ({ 'value': item.code, 'label': item.name }));
      }
    }
  };
}


export default new ProcessService('/api/eps/dps/process');
