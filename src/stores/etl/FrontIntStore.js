import { observable, action } from 'mobx';
import BaseStore from '../BaseStore';
import FrontIntService from '../../services/etl/FrontIntService';
import fetch from '../../utils/fetch';


class FrontIntStore extends BaseStore {
  @observable passwordValues = {};
  @observable pswModalVisible = false;
  @observable rsModalVisible = false;
  @observable dakDataSource = [];
  @observable tableColums = [];
  @observable currentStep = 0;
  @observable transferDefaultValue = {};
  stepValues = {};


  beforeSetEditRecord (value) {
    value.uenable = value.TaskEnable === 1;
    return value;
  }

  beforeSaveData (values) {
  
    return values;    
  }

  @action setStep = async (step) => {
    this.currentStep=step;
  }
  @action setStepValues = async (params) => {
    this.stepValues={...this.stepValues,...params}
    if(params && params.field){
      this.transferDefaultValue["field"]=(params.field);
    }
    if(params && params.search){
      this.transferDefaultValue["search"]=(params.search);
    }
    console.log(this.stepValues)
  }

  @action findColumns = async () => {
    const response=await FrontIntService.findTableColumns({tb:this.stepValues.tb})
    this.tableColums=response.map(o=>({"label":o.archivecolumnName,"value" :o.archivecolumnName}));
  }


  @action onSubmit= async()=>{
    if(this.stepValues.whsj){
      this.stepValues.whsj = this.stepValues.whsj.format("YYYY-MM-DD HH:mm:ss");
    }
    this.saveData(this.stepValues);
  }


}

export default new FrontIntStore('/api/front');
