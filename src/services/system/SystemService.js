import BaseService from '../BaseService';
import util from '../../utils/util';

class SystemService extends BaseService {
  findAll (params) {
    return new Promise((resolve, reject) => {
      super.findAll(params).then(data => {
        resolve(data);
        util.setSStorage('system', data);
      }).catch(err => reject(err));
    });
  }

  getSystems = () => {
    return util.getSStorage('system');
  }

  getSystem = (path) => {
    const sys = this.getSystems();
    if (sys) {
      for (let i = 0; i < sys.length; i += 1) {
        if (sys[i].id === path) {
          return sys[i];
        }
      }
    }
    return undefined;
  }

  getSystemByPath = (path) => {
    const sys = this.getSystems();
    if (sys) {
      for (let i = 0; i < sys.length; i += 1) {
        if (sys[i].systemUrl === path) {
          return sys[i];
        }
      }
    }
    return undefined;
  }
}

export default new SystemService('/api/sysapi/sys');
