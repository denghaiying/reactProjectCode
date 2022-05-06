import { observable, action, runInAction, makeObservable } from 'mobx';
import BaseStore from '@/stores/BaseStore';
import fetch from '@/utils/fetch';
import axios from 'axios';
import * as qs from 'qs';

class ApplyStore extends BaseStore {
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
  detailParams = {};
  fid = '';
  spkj = false;
  sxjckj = false;
  detailSelectRowKeys: string[] = [];
  detailSelectRows: any[] = [];
  allApply: boolean = false;

  setEditRecord(editRecord: {}) {
    this.editRecord = editRecord;
  }

  setSpkj(spkj: boolean) {
    runInAction(() => {
      this.spkj = spkj;
    });
  }

  setSxjckj(sxjckj: boolean) {
    runInAction(() => {
      this.sxjckj = sxjckj;
    });
  }

  setSxjckj(sxjckj: boolean) {
    runInAction(() => {
      this.sxjckj = sxjckj;
    });
  }

  setSxjckj(sxjckj: boolean) {
    runInAction(() => {
      this.sxjckj = sxjckj;
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

  setDetailParams = (detailParams) => {
    runInAction(() => {
      debugger
      this.fid = detailParams.fid;
      this.detailParams = detailParams;
    });
  };

  setDetailSelectRowKeys = (selectRowKeys, selectRows) => {
    runInAction(() => {
      debugger
      this.detailSelectRowKeys = selectRowKeys;
      this.detailSelectRows = selectRows;
    });
  };

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
    debugger;
    runInAction(() => {
      this.setSpkj(false);
      this.setSpkj(true);
    });
  };
}

export default ApplyStore;
