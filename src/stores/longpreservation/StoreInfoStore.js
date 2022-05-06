import { observable, action, runInAction } from 'mobx';
import moment from 'moment';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';


class StoreInfoStore extends BaseStore {

}

export default new StoreInfoStore('/api/storeinfo',true,false);
