import { action, makeObservable, observable } from 'mobx';
import qs from 'qs';
import fetch from '../../utils/fetch';
import util from '../../utils/util';
import BaseWfStore from './BaseWfStore';


class WfparamStore extends BaseWfStore {
  queryForPageUrl = "/queryForWfparamPage";
  addUrl = "/addWfparam";
  updateUrl = "/updateWfparam";
  deleteUrl = "/deleteWfparam";
  wfsrvid = "";

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this, {
      wfsrvid: observable,
      setWfsrvId: action,
      resetEditRecord: action,
    });
  }

  setWfsrvId = async (wfsrvid) => {
    // eslint-disable-next-line quote-props
    this.wfsrvid = wfsrvid;
    this.setParams({ 'wfvid': wfsrvid });
  }
  resetEditRecord = (value) => {
    this.editRecord = value;
  }

  findByCode (wfvid, code) {
    return new Promise((resolve, reject) => {
      fetch.get(`${this.url}/queryWfparamForId?${qs.stringify({ wfvid, code })}`).then(
        response => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(util.bussinessException(response.status, response.data));
          }
        }
      ).catch(err => {
        reject(util.bussinessException(err.response.status, err.response.data));
      });
    });
  }
}

export default new WfparamStore('/eps/workflow/wfsrv', false, true);
