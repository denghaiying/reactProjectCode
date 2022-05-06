import BaseStore from '../BaseStore';
import diagest from '../../utils/diagest';

const webkey = 'e9doc888';

class SrvStore extends BaseStore {
  beforeSetEditRecord (value) {
    if (value.srvAkey) {
      value.akey = diagest.desdeccode(webkey, value.srvAkey);
    }
    if (value.srvSkey) {
      value.skey = diagest.desdeccode(webkey, value.srvSkey);
    }
    value.denable = value.srvDisable === 0;
    return value;
  }

  beforeSaveData (values) {
    const d = values;
    d.srvAkey = diagest.desencode(webkey, d.akey);
    d.srvSkey = diagest.desencode(webkey, d.skey);
    d.srvDisable = d.denable ? 0 : 1;
    return values;
  }
}

export default new SrvStore('/docapi/srv');
