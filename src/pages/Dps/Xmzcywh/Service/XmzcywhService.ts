import BaseService from '@/eps/commons/BaseService';
import { ITableService, ITreeService } from '@/eps/commons/panel';
import { response } from '@umijs/deps/compiled/express';
import { resolve } from '_@umijs_utils@3.5.20@@umijs/utils';
import fetch from '../../../../utils/fetch';

class XmzcywhService
  extends BaseService
  implements ITableService, ITreeService
{
  // 不使用异步树时，可以直接返回空数组
  loadAsyncDataByKey(key: any): Promise<any> {
    return new Promise<any>((resolve) => {
      return resolve([]);
    });
  }

  progroupData = [];

  //左边单位树
  findTree(key: string = '') {
    let params = { 'projectName': key }
    return new Promise((resolve, reject) => {
      return super
        .get({ url: `/api/eps/dps/progroup/findModelTree`, params })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }
          // 注意，返回数据需转换为[{key: 'xxx', title: 'yyy'}]格式的数据，否则左侧树内容可能不能正常显示
          // let data = res.data.map(item => { return { id: item.id, title: item.projectname, key: item.id } })
          let data = res.data;
          return resolve(data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  //分页查询
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    if (args.hasOwnProperty('progroupName')) {
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
    } else {
      if (key !== undefined && key != '') {
        args['projectId'] = key;
        const params = { params: args, page: page + 1, size };
        return new Promise((resolve, reject) => {
          return super
            .findAll(params)
            .then((res) => {
              if (res.data.total === 0) {
                this.findprogroupId(key).then(() => {
                  return resolve(this.progroupData);
                });
              } else {
                return resolve(res.data);
              }
              //数据渲染
            })
            .catch((err) => {
              return reject(err);
            });
        });
      }
    }
  }

  async findprogroupId(key) {
    const param = { params: { progroupId: key } };
    const response = await fetch.get('/api/eps/dps/promem/list/', {
      params: param,
    });
    if (response.status === 200) {
      this.progroupData = response.data;
    }
  }

  // 新增数据
  saveByKey(key, data) {
    data['id'] = `${Math.random()}`;
    data['isfzr'] = data['isfzr'] ? 'Y' : 'N';
    return super.save(data);
  }

  // 修改数据
  updateForTable(data) {
    data['isfzr'] = data['isfzr'] ? 'Y' : 'N';
    return super.update(data);
  }

  // 删除数据
  deleteForTable(data: object): Promise<any> {
    return super.del(data);
  }
}

export default new XmzcywhService('/api/eps/dps/promem');
