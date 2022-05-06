import { observable, action } from 'mobx';
import BaseStore from '../BaseStore';
import InspectionService from '../../services/user/UserService';

import diagest from '../../utils/diagest';

class InspectionStore extends BaseStore {
  @observable passwordValues = {};
  @observable pswModalVisible = false;
  @observable rsModalVisible = false;
  @observable roleData = [];
  @observable InspectionroleIds = [];

  beforeSetEditRecord (value) {
    value.uenable = value.InspectionEnable === 1;
    return value;
  }

  beforeSaveData (values) {
    const d = values;
    d.InspectionEnable = d.uenable ? 1 : 0;
    return values;    
  }

  @action setPasswordValues = async (passwordValues) => {
    this.passwordValues = passwordValues;
  };

  @action showPasswordDailog = (visible) => {
    
    
     
  };

  @action reSetroleData = (values) => {
    this.InspectionroleIds = values;
  };

}

export default new InspectionStore('/api/inspection',true,false);
