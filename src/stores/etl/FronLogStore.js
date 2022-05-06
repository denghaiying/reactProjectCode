import { observable, action } from 'mobx';
import BaseStore from '../BaseStore';
import TaskService from '../../services/etl/FrontIntService';
import fetch from '../../utils/fetch';


class FrontLogStore extends BaseStore {
  
}

export default new FrontLogStore('/api/front/log');
