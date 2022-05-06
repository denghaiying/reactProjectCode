import { observable, action, runInAction } from 'mobx';
import BaseStore from '../BaseStore';

class DaxhStore extends BaseStore {
  @observable fileshow = false;
  @observable fileparams = {};

  @action showFile = async (fileshow, params) => {
    this.fileshow = fileshow;
    if (fileshow) {
      this.fileparams = params;
    }
  }
}

export default new DaxhStore('/api/eps/control/main/daxh', true, true);

