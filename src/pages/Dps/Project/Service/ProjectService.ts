import BaseService from '@/eps/commons/BaseService';
import { ITableService } from '@/eps/commons/panel';
import moment from 'moment';
import Project from '..';

class ProjectService extends BaseService implements ITableService {
  //分页查询
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    const params = { params: args, page: page + 1, size };
    return new Promise((resolve, reject) => {
      return super
        .findAll(params)
        .then((res) => {
          //数据渲染
          return resolve(res.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  // 新增数据
  saveByKey(key, data) {
    data['xmid'] = `${moment().format('YYYYMMDDHHmmssSSS')}`;
    data['id'] = `${Math.random()}`;
    data['enable'] = data['enable'] ? 'Y' : 'N';
    data['mbId'] = data.jnmbId ? data.mbId + ',' + data.jnmbId : data.mbId;
    return super.save(data);
  }
  rows =null;
  // 修改数据
  updateForTable(data) {
    data['enable'] = data['enable'] ? 'Y' : 'N';
    data['mbId'] = data.jnmbId ? data.mbId + ',' + data.jnmbId : data.mbId;
    return super.update(data)?.then((response)=>{
      if(response&&response.status===200){
        this.rows=data['mbId'];
      }
    });
  }


  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  }
}

export default new ProjectService('/api/eps/dps/project');
