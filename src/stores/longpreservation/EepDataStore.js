import { observable, action } from "mobx";
import moment from "moment";
import BaseStore from "../BaseStore";
import EepDataService from '../../services/longpreservation/EepDataService';
import fetch from "../../utils/fetch";

class EepDataStore extends BaseStore {



  @action async findAll (params) {
    this.loading = true;
    this.params = params;
    try {
      this.data = await EepDataService.findByEepInfo(this.params);
      const columns = await EepDataService.queryEepColumn(this.params);
      if(columns && columns.columModle){
        this.columns=columns.columModle.map(o=>{
          const result={
            title: o.text,
            dataIndex: o.dataIndex,
            width: 200,
          }
         return result;
        })
      }
      this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }

  @action saveDataTest = async (values,ydata) => {
    values = this.beforeSaveData(values);
    let xid=values.id;
      this.editVisible = false;
      const list=[];
     
        for(let i=0;i<ydata.length;i++){
          if(ydata[i].id==xid){
            list.push(values);
          }else{
            list.push(ydata[i]);
          }
      }
      this.data=list;
      
  }


}

export default new EepDataStore("/api/eepdata",true,false);
