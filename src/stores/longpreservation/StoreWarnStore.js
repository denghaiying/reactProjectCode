import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';


class StoreWarnStore extends BaseStore {

}

export default new StoreWarnStore('/api/storewarn',true,false);
