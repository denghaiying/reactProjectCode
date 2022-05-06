import { observable, action } from "mobx";
import moment from "moment";
import BaseStore from "../BaseStore";
import EepInfoService from '../../services/longpreservation/EepInfoService';
import fetch from "../../utils/fetch";
import util from "../../utils/util";


class EepInfoStore extends BaseStore {
 
    @action importEepinfos = async () => {
        try {
            this.loading = true;
            await EepInfoService.importEepinfos(this.selectRowRecords);
            this.loading=false;
          } catch (err) {
            this.loading = false;
            util.showError(err);
          }
      }

      @action onDetection = async () => {
        try {
          
            await EepInfoService.onDetection(this.selectRowRecords);
        
          } catch (err) {
            this.loading = false;
            util.showError(err);
          }
        
      }


}

export default new EepInfoStore("/api/eepinfo",true,false);
