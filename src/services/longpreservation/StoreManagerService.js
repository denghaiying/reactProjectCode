import BaseService from '../BaseService';
import fetch from '../../utils/fetch';
import util from '../../utils/util';

class StoreManagerService extends BaseService {

  constructor(url) {
    super(url);
    this.IsLogin = false;
  }

}

// e9store.registerStore('sys_user', new UserService('/userapi/user'));
export default new StoreManagerService('/api/ftphttp');
