import { observable, action } from 'mobx';
import BaseStore from '../BaseStore';
import TaskService from '../../services/longpreservation/TaskService';
import fetch from '../../utils/fetch';
import diagest from '../../utils/diagest';
const dwurl="/arch/dw";
const dakurl="/arch/dak";
class TaskStore extends BaseStore {
  @observable passwordValues = {};
  @observable pswModalVisible = false;
  @observable rsModalVisible = false;
  @observable dakDataSource = [];
  @observable dwDataSource = [];
  @observable dakValue = '';
  


  beforeSetEditRecord (value) {
    value.uenable = value.TaskEnable === 1;
    return value;
  }

  beforeSaveData (values) {
    const d = values;
    d.TaskEnable = d.uenable ? 1 : 0;
    return values;    
  }

  @action queryDw = async () => {
    this.loading = true;
    const response = await fetch
      .post(dwurl);
    if (response && response.status === 200) {
      this.dwDataSource=response.data.map(o=>({'label':o.dwmc,'value':o.dwid}));
    } else {
      this.loading = true;
    }
  }

  @action dwChange = async (dwid) => {
    const response=await fetch.post(dakurl+"/"+dwid,{})
    this.editRecord.taskDakid='';
    if (response && response.status === 200) {
      this.dakDataSource=response.data.map(o=>({'label':o.mc,'value':o.id}));
    } 
    
  }

  @action dakChange = async (value) => {
      this.editRecord.taskDakid=value;
  }

  @action start = async (value) => {
    this.loading=true;
    TaskService.runTask()
    this.loading=false;
  }

  @action stop = async () => {
    this.editRecord.taskDakid=value;
  }
  @action rule = async () => {
     return await TaskService.rule(this.selectRowRecords[0]);
  }
  @action reset = async (value) => {
    return await  TaskService.reset(value);
    this.loading=false;
  }
}

export default new TaskStore('/api/task',true,false);
