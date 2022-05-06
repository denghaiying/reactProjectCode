import { observable, action, runInAction, makeObservable } from 'mobx';
import moment, { isMoment } from 'moment';
import { message } from 'antd';
import BaseWfStore from './BaseWfStore';
import SysStore from '../system/SysStore';
import fetch from '../../utils/fetch';

class WfdefStore extends BaseWfStore {
  defaultDefData = {
    def: {
      wfvid: '',
      bdms: false,
      whr: 'e9',
    },
    nodes: [
      {
        type: 'node',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '开始',
        x: 224,
        y: 55.5,
        id: 'ea1184e8',
        index: 0,
        code: '0000',
        title: '',
        canreject: true,
        canreturn: true,
        canedit: true,
        params: '',
      },
      {
        type: 'node',
        size: '70*70',
        shape: 'flow-circle',
        color: 'red',
        label: '结束',
        x: 224,
        y: 299,
        id: '481fbb1a',
        index: 3,
        code: 'ZZZZ',
        title: '',
        canreject: true,
        canreturn: true,
        canedit: true,
        params: '',
      },
      {
        type: 'node',
        size: '80*48',
        shape: 'flow-rect',
        color: '#1890FF',
        label: '审批',
        code: '0010',
        title: '',
        canreject: true,
        canreturn: true,
        canedit: true,
        params: '',
        x: 224,
        y: 165.5,
        id: '36bf5cbe',
        index: 4,
      },
    ],
    edges: [
      {
        source: 'ea1184e8',
        sourceAnchor: 2,
        target: '36bf5cbe',
        targetAnchor: 0,
        id: '463fa01c',
        index: 1,
      },
      {
        source: '36bf5cbe',
        sourceAnchor: 2,
        target: '481fbb1a',
        targetAnchor: 0,
        id: '51a8a62f',
        index: 2,
      },
    ],
  };

  id = '';
  defData = { def: {} };
  proclist = {};

  queryForPageUrl = '/queryForWfdefPage';
  queryByIdUrl = '/queryWfdefForId';
  addUrl = '/addWfdef';
  updateUrl = '/updateWfdef';
  deleteUrl = '/deleteWfdef';

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this, {
      id: observable,
      defData: observable,
      proclist: observable,
      defDataChange: action,
      resetEditRecord: action,
      saveDefData: action,
      getPorcs: action,
    });
  }

  // 图形化工作流界面变化
  defDataChange = async (values) => {
    this.defData.def = values;
  };

  resetEditRecord = async (id) => {
    if (id) {
      this.opt = 'edit';
      const d = await this.findById(id);
      runInAction(() => {
        this.id = id;
        if (d.xmls) {
          const ddata = JSON.parse(d.xmls);
          ddata.def.wfvid = d.wfvid;
          this.defData = ddata;
        } else {
          const o = {};
          Object.assign(o, d);
          o.bdms = o.bdms === 'Y';
          const { nodes, edges } = this.defaultDefData;
          const ddata = { def: o, nodes, edges };
          this.defData = ddata;
        }
      });
    } else {
      this.opt = 'add';
      runInAction(() => {
        this.id = '';
        Object.assign(this.defData, this.defaultDefData);
      });
    }
  };

  saveDefData = async (d) => {
    const { def } = this.defData;
    const { bdms, whr, whsj, ...wfdef } = def;
    wfdef.bdms = bdms ? 'Y' : 'N';
    const { ...o } = d;
    o.def = def;
    wfdef.xmls = JSON.stringify(o);

    const fd = new URLSearchParams();
    for (const key in wfdef) {
      fd.append(key, wfdef[key]);
    }
    fd.append('whrid', SysStore.getCurrentUser().id);
    fd.append('whr', SysStore.getCurrentUser().yhmc);
    fd.append('whsj', moment().format('YYYY-MM-DD HH:mm:ss'));
    let response;
    if (this.opt === 'edit') {
      fd.append('id', this.id);
      response = await fetch.put(`${this.url}${this.updateUrl}`, fd, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } else {
      response = await fetch.post(`${this.url}${this.addUrl}`, fd, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    }
    if (response && response.status === 200) {
      if (response.data.success) {
        runInAction(() => {
          this.opt = 'edit';
          this.id = response.data.results.id;
        });
        message.success('保存流程成功');
      } else {
        message.warning(response.data.message);
      }
    }
  };

  getPorcs = async (wfid) => {
    if (!this.proclist[wfid]) {
      const fd = new FormData();
      fd.append('wfid', wfid);
      const response = await fetch.post(`/eps/workflow/wf/getWpids`, fd, {
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      });
      if (response && response.status === 200) {
        runInAction(() => {
          this.proclist[wfid] = response.data;
        });
      }
    }
  };

  getPromisePorcs = async (wfid) => {
    return new Promise(async (resolve, reject) => {
      if (!this.proclist[wfid]) {
        const fd = new FormData();
        fd.append('wfid', wfid);
        const response = await fetch.post(`/eps/workflow/wf/getWpids`, fd, {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        });
        if (response && response.status === 200) {
          runInAction(() => {
            this.proclist[wfid] = response.data;
          });
          return resolve(true);
        }
      }
    });
  };
}
export default new WfdefStore('/api/eps/workflow/wfdy', false, true);
