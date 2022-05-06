import { observable, action, runInAction } from 'mobx';
import BaseStore from '../BaseStore';

class AppraisaApplyStore extends BaseStore {
  @observable fileshow = false;
  @observable fileparams = {};

  @action showFile = async (fileshow, params) => {
    this.fileshow = fileshow;
    if (fileshow) {
      this.fileparams = params;
    }
  }
}

export default AppraisaApplyStore;

