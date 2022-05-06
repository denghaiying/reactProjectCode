import { observable, action, runInAction, makeObservable } from 'mobx';
import BaseStore from '@/stores/BaseStore';
import fetch from '@/utils/fetch';
import axios from 'axios';
import * as qs from 'qs';
import SysStore from '@/stores/system/SysStore';
import { message } from 'antd';
class ApplyStore extends BaseStore {
  /**
   *
   */

  @observable ktables = {};
  @observable childlist = {};
  @observable childColumns = [];
  @observable mainColumns = [];
  @observable mainTmField = '';
  @observable mainDhField = '';

  @action getDDaklist = async (fid) => {
    if (!this.childlist[fid]) {
      const ktable = await this.getKTable({ fid });
      runInAction(() => {
        this.childlist[fid] = ktable.id;
        this.ktables[ktable.id] = ktable;
      });
    }
  };

  @action getDakTableList = async (dakid) => {
    if (!this.ktables[dakid]) {
      const ktable = await this.getKTable({ dakid });
      runInAction(() => {
        this.ktables[dakid] = ktable;
      });
      return ktable;
    }
    return this.ktables[dakid];
  };

  @action getDaklist = async (dakid, tmzt, umid = '') => {
    debugger;
    const ktable = await this.getKTable({ dakid });
    // if (!this.ktables[dakid]) {
    //   const ktable = await this.getKTable({ dakid });
    //   runInAction( () => {
    //     this.ktables[dakid] = ktable;
    //   });
    // }
    const key = `${dakid}-${tmzt}${umid ? '-' + umid : ''}`;

    const kfields = await this.getKField({
      dakid: dakid,
      lx: tmzt,
      pg: 'list',
    });
    runInAction(() => {
      this.mainColumns = kfields
        .filter((kfield) => kfield['lbkj'] == 'Y')
        .map((kfield) => ({
          width: kfield['mlkd'] * 1,
          dataIndex: kfield['mc'].toLowerCase(),
          code: kfield['mc'].toLowerCase(),
          title: kfield['ms'],
          sxid: kfield['sxid'],
          ellipsis: true,
        }));
      this.mainTmField = kfields.find((item) => item.sxid == 'SX04');
      this.mainDhField = kfields.find((item) => item.sxid == 'SX03');
    });
  };

  @action getKTable = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(
      `/api/eps/control/main/dagl/queryKTable`,
      fd,
      {
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      },
    );
    if (response && response.status === 200) {
      return response.data;
    }
  };

  @action getKField = async (params) => {
    const fd = new FormData();
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    }
    const response = await fetch.post(
      `/api/eps/control/main/dagl/queryKFields`,
      fd,
      {
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      },
    );
    if (response && response.status === 200) {
      return response.data;
    }
  };
  //end

  fileshow = false;
  fileparams = {};
  printshow = false;
  fileData = '';
  // reportName="Blank_A4_1";
  reportName = 'yjsq';
  dataJson = '';
  param = {};
  Umid = 'DAGL023';
  uploadVisible = false;
  yprintUrl = '';
  printVisible = false;
  @observable detailParams = {};
  // 案卷参数
  detailRecordParams = {};
  ajDakid: '';
  fid = '';
  spkj = false;
  fjkj = false;
  sxjckj = false;
  detailSelectRowKeys: string[] = [];
  detailSelectRows: any[] = [];
  allApply: boolean = false;
  pDALYF002 = 0;
  sysRight = {};
  activeTabKey = 'approve_maintab';
  @observable ddVisit = false;
  @observable rykj = false;
  @observable ddkj = false;
  @observable zjkj = false;
  canWfAdd = false;
  setEditRecord(editRecord: {}) {
    this.editRecord = editRecord;
  }

  @action setDdkj(ddkj: boolean) {
    runInAction(() => {
      this.ddkj = ddkj;
    });
  }

  @action setZjkj(zjkj: boolean) {
    runInAction(() => {
      this.zjkj = zjkj;
    });
  }

  @action setDdVisit(ddVisit: boolean) {
    runInAction(() => {
      this.ddVisit = ddVisit;
    });
  }

  @action setCanWfadd(canWfAdd: boolean) {
    runInAction(() => {
      this.canWfAdd = canWfAdd;
    });
  }

  @action setRykj(rykj: boolean) {
    runInAction(() => {
      this.rykj = rykj;
    });
  }

  setSpkj(spkj: boolean) {
    runInAction(() => {
      this.spkj = spkj;
    });
  }
  setFjkj(fjkj: boolean) {
    runInAction(() => {
      this.fjkj = fjkj;
    });
  }
  setSxjckj(sxjckj: boolean) {
    runInAction(() => {
      this.sxjckj = sxjckj;
    });
  }

  setUrl(url: string) {
    this.url = url;
  }

  setReportName(reportName: string) {
    this.reportName = reportName;
  }

  constructor(url: string, wfenable: boolean, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this);
  }

  @action setFileData = async (fileData) => {
    this.fileData = fileData;
  };

  @action setDetailParams = async (detailParams) => {
    // const ktable = await this.getKTable({dakid:detailParams.dakid });
    //  if (!this.ktables[detailParams.dakid]) {
    //    const ktable = await this.getKTable({ dakid });
    //    runInAction( () => {
    //      this.ktables[dakid] = ktable;
    //    });
    //  }
    /*  let kfields;
    if (detailParams.dakid) {
      kfields = await this.getKField({
        dakid: detailParams.dakid,
        lx: detailParams.tmzt,
        pg: 'list',
      });
    }
    debugger;*/

    runInAction(() => {
      /* if (kfields) {
        debugger;
        this.mainColumns = kfields
          .filter((kfield) => kfield['lbkj'] == 'Y')
          .map((kfield) => ({
            width: kfield['mlkd'] * 1,
            dataIndex: kfield['mc'].toLowerCase(),
            code: kfield['mc'].toLowerCase(),
            title: kfield['ms'],
            sxid: kfield['sxid'],
            ellipsis: true,
          }));
        detailParams.tmField = kfields
          .find((item) => item.sxid == 'SX04')
          ?.mc.toLowerCase();
        detailParams.dhField = kfields
          .find((item) => item.sxid == 'SX03')
          ?.mc.toLowerCase();
      }*/
      this.detailParams = detailParams;
      this.fid = detailParams.fid;
    });
  };

  setDetailSelectRowKeys = (selectRowKeys, selectRows) => {
    runInAction(() => {
      this.detailSelectRowKeys = selectRowKeys;
      this.detailSelectRows = selectRows;
    });
  };

  setActiveKey(akey: string) {
    // alert(akey)
    runInAction(() => {
      //    this.activeTabKey = akey;
    });
  }

  setFid = (id) => {
    runInAction(() => {
      this.fid = id;
    });
  };

  @action showFile = async (fileshow, params) => {
    this.fileshow = fileshow;
    if (fileshow) {
      this.fileparams = params;
    }
  };

  @action reportPrint = async (id) => {
    let urls =
      '/api/eps/control/main/yjsp/queryReport?id=' + id + '&umid=' + this.Umid;
    const response = await fetch.get(urls);
    if (response && response.status === 200) {
      //  this.yjsqdate = response.data.results;
      //    let data1 = response.data.message;
      let data1 = response.data.results;
      this.param = data1;
      let reportName1 = data1.reportName;
      this.param['data'] = data1.data;
      this.param['paramter'] = data1.paramter;

      //   let param = {};
      /*  this.param["yjdw"] = data1.yjdw;
        this.param["jsdw"] = data1.jsdw;
        this.param["yjr"] = data1.yjr;
        this.param["jsr"] = data1.jsr;
        this.param["data"] = data1.data;*/

      axios({
        // 用axios发送post请求
        method: 'post',
        url: 'http://localhost:8180/offline/report/apiMap/print/' + reportName1, // 请求地址
        data: this.param, // 参数
        //    responseType: 'blob' // 表明返回服务器返回的数据类型
      })
        .then((response) => {
          if (response.status == 200) {
            this.fileData = response.data;
            //      this.printshow=true;
            const pdfurl = encodeURIComponent(
              '/api/eps/offline/report/loadpdf?file=' + this.fileData,
            );

            this.yprintUrl =
              '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' +
              pdfurl +
              '&printfile=1&downfile=1';
            //  window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=1&downfile=1");
          } else {
            return false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      this.loading = true;
    }
  };

  queryForPageUrl = '/queryDetailForPage';
  // queryByIdUrl = "/queryYjspmxForId";
  addUrl = '/addDetail';
  updateUrl = '/updDetail';

  @action reSetData = async (record) => {
    const { results } = this.data;
    if (results) {
      this.data.results = results.map((m) => (m.id == record.id ? record : m));
    }
    const fd = new FormData();
    for (const key in record) {
      fd.append(key, record[key]);
    }
    await fetch.put(`${this.url}${this.updateUrl}`, fd, {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    });
  };

  @action checkAllApply = async () => {
    const res = await fetch.get(
      `${this.url}/queryNoApply?fid=${this.selectRowKeys[0]}`,
      {},
    );
    if (res.success && res.results == 0) {
      return true;
    }
    return false;
  };

  @action allApprove = async () => {
    const res = await fetch.get(
      `${this.url}/allApprove?fid=${this.selectRowKeys[0]}`,
      {},
    );
    if (res.success && res.results == 0) {
      this.refreshDetail();
    }
  };

  @action allNotApprove = async () => {
    const res = await fetch.get(
      `${this.url}/AllNotApprove?fid=${this.selectRowKeys[0]}`,
      {},
    );
    if (res.success && res.results == 0) {
      this.refreshDetail();
    }
  };

  @action refreshDetail = async () => {
    runInAction(() => {
      this.setSpkj(false);
      this.setSpkj(true);
    });
  };

  @action getUserOptionByDALYF002 = async () => {
    const url =
      '/api/eps/control/main/params/getParamsDevOption?code=DALYF002&yhid=' +
      SysStore.getCurrentUser().id;
    const response = await fetch.get(url);
    if (response.status === 200) {
      if (response.data === '' || response.data == null) {
        this.pDALYF002 = 1;
      } else {
        this.pDALYF002 = response.data;
      }
    } else {
      return;
    }
  };

  @action archRecordsChangeRow = async (value, row) => {
    runInAction(() => {
      this.detailRecordParams = { daid: value[0] };
    });
  };
  @action setDakid = async (dakid) => {
    runInAction(() => {
      this.ajDakid = dakid;
    });
  };

  @action plxzdownload = async (values) => {
    const urla = '/eps/control/main/jydcx/plxzdownload';
    const params = values;
    const response = await fetch.get(urla, { params, responseType: 'blob' });
    if (response.status === 200) {
      const type =
        response.headers['context-type'] && 'application/octet-stream';
      let filename = [];
      if (response.headers['content-disposition']) {
        filename = response.headers['content-disposition'];
        const pos = filename.indexOf('filename=');
        if (pos && pos > 0) {
          filename = filename.substring(pos + 9);
          if (filename.indexOf('"') > -1) {
            filename = filename.substring(1, filename.length - 1);
          }
        }
      } else {
        message.error('下载数据有问题');
        return;
      }
      const blob = new Blob([response.data], { type });
      const url = window.URL.createObjectURL(blob);
      const aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = url;
      aLink.setAttribute('download', decodeURIComponent(filename));
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(url);
      return response;
    }
  };

  @action Dak = async (values) => {
    const url = '/eps/control/main/dak/queryForId';
    const params = values;
    const response = await fetch.get(url, { params });
    if (response.status === 200) {
      return response.data;
    }
  };

  @action Attach = async (values) => {
    const url = '/eps/wdgl/attachdoc/queryForList';
    const params = values;
    const response = await fetch.get(url, { params });
    if (response.status === 200) {
      return response.data;
    }
  };
}

export default ApplyStore;
