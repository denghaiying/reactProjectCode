import { observable, action } from "mobx";
import moment from "moment";
import BaseStore from "../BaseStore";
import EepFileService from '../../services/longpreservation/EepFileService';
import {fetch,ajaxUrl }from "../../utils/fetch";

class EepFileStore extends BaseStore {
  @action async findAll (params) {
    this.loading = true;
    this.params = params;
    try {
        const  result = await EepFileService.findByEepInfo(this.params);
         this.data =result && result.map(o =>{
        o.id=o.fileid;
        return o;
      })
       this.loading = false;
    } catch (err) {
      this.loading = false;
      throw err;
    }
  }


  @action async downloadFile(){
      window.open(ajaxUrl+"/eepinfo/download/"+this.params.eepInfoId+"/"+this.selectRowKeys[0]+"."+this.selectRowRecords[0].ext)
  }

}

export default new EepFileStore("/api/eepinfo",true,false);
