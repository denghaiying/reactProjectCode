import BaseService from '@/eps/commons/v2/BaseService';
import IEpsService from '@/eps/commons/IEpsService';
import { ITableService } from '@/eps/commons/panel';

class RunningLogService extends BaseService implements IEpsService, ITableService {
  findByKey(
    key: string | number,
    page: number = 1,
    size: number = 10,
    args: object = {},
  ): Promise<any> {
    if (args['rq'] != null) {
      args['rqb'] = args['rq'][0].format('YYYY-MM-DD 00:00:00');
      args['rqe'] = args['rq'][1].format('YYYY-MM-DD 23:59:59');
      args['rq'] = '';
    }
    args['dwid'] = key;
    args['yhmc'] = '';
    args['lx'] = '';
    args['isInHistory'] = 'N';
    args['pageIndex'] = page;
    args['pageSize'] = size;
    args['page'] = page;
    args['limit'] = size;
    args['sortOrder'] = '';
    args['sortField'] = '';
    return new Promise((resolve, reject) => {
      return super
        .get({ url: this.url + '/queryForPage', params: args })
        .then((res) => {
          if (res.status > 300) {
            return reject(res);
          }

          return resolve(res.data || res.results);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findAll(params) {
    return new Promise((resolve, reject) => {
      return super
        .post({ url: this.url + '/queryForPage', params })
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

  saveByKey(key, data) {
    data['id'] = `${Math.random()}`;

    return super.save(data);
  }

  updateForTable(data) {
    data['inm'] = 'Y';
    return super.update(data);
  }

  deleteForTable(data) {
    return super.del(data);
  }

  batchDelete(data) {
    return super.batchDelete(data);
  }
}

export default new RunningLogService('/api/eps/control/main/syslog');
