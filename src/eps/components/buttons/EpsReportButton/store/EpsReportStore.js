import { action, observable } from 'mobx';
import moment from 'moment';
import BaseStore from '../../../../../stores/BaseStore';
import SysStore from '../../../../../stores/system/SysStore';
import fetch from '../../../../../utils/fetch';
import React from 'react';
import axios from 'axios';
import Eps from '@/utils/eps';
import { base64encode, utf16to8 } from '@/utils/EpsUtils';

const mkrl = '/api/eps/control/main/epsreport';

class EpsReportStore extends BaseStore {
  /**
   * 获取当前用户名称
   */
  @observable yhmc = SysStore.getCurrentUser().yhmc;

  /**
   * 获取当前用户ID
   */
  @observable yhid = SysStore.getCurrentUser().id;
  /**
   * 获取当前时间
   */
  @observable getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  @observable total = 15;
  @observable visible = false;
  @observable currentData = [];
  @observable agriculturalList = [];
  @observable pageNumber = parseInt(window.location.hash.slice(1), 0) || 1;
  @observable umid = '';

  @observable uploadstate = true;

  @observable selectid = '';
  @observable selectedRow = {};
  @observable epsReportEntity = {};
  @observable menuData = [];

  @observable param = {};
  @observable printUrl = '';

  @observable allData = [];

  @action setSelectId = async (selectid) => {
    this.selectid = selectid;
  };

  @action setMenuData = async (menuData) => {
    this.menuData = menuData;
  };
  @action setallData = async (data) => {
    this.allData = data;
  };
  @action setSelectedRow = async (selectedRow) => {
    this.selectedRow = selectedRow;
  };

  @action setUploadstate = async (uploadstate) => {
    this.uploadstate = uploadstate;
  };

  @action setPageNumber = async (pageNumber) => {
    this.pageNumber = pageNumber;
  };

  @action queryForId = async (id) => {
    if (id !== '') {
      const response = await fetch.post(`${this.url}/queryForId?id=` + id);
      if (response && response.status === 200) {
        this.epsReportEntity = response.data;
      } else {
        this.loading = true;
      }
    }
  };

  @action findMenu = async (umid) => {
    this.loading = true;

    const responselb = await fetch.post(
      `${this.url}/queryForList?umid=` + umid,
    );
    if (responselb && responselb.status === 200) {
      this.menuData = responselb.data;
      this.setMenuData(responselb.data);
    } else {
      this.loading = true;
    }
  };

  // @action reportPrint = async (id, store) => {
  //   console.log("EPSREPORTS");
  //   /*    let urls = "/api/eps/control/main/epsreport/queryReportData?id=" + id;
  //       const response = await fetch.get(urls);*/

  //   const response = await fetch
  //     .post(`${this.url}/queryReportData`, this.params, {
  //       params: {
  //         id: id,
  //         storeParams: store.params,
  //         ...this.params,
  //       },
  //     });

  //   if (response && response.status === 200) {

  //     let data1 = response.data.results;
  //     this.param = data1;

  //     //   let param = {};
  //     let reportName = data1.reportName;

  //     this.param["data"] = data1.data;
  //     this.param["paramter"] = data1.paramter;

  //     axios({ // 用axios发送post请求
  //       method: 'post',
  //       url: 'http://localhost:8180/offline/report/apiMap/print/' + reportName, // 请求地址
  //       data: this.param // 参数
  //       //    responseType: 'blob' // 表明返回服务器返回的数据类型
  //     })
  //       .then(response => {

  //         if (response.status == 200) {

  //           this.fileData = response.data;
  //           //      this.printshow=true;
  //           const pdfurl = encodeURIComponent(
  //             "/eps/offline/report/loadpdf?file="
  //             + this.fileData);

  //           this.printUrl = '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + '&printfile=1&downfile=1';
  //           //          window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=1&downfile=1");
  //         } else {
  //           return false;
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   } else {
  //     this.loading = true;
  //   }

  // }

  @action reportPrint = async (reportinfo, store,id) => {
    debugger;

    // var sjData = props.ids;
    // let ids="";
    // if (props.ids) {
    //   for (var i = 0; i < sjData.length; i++) {
    //    ids +=","+sjData[i].id;
    //   }
    //  ids.substring(1);


    // const sjData = store.selectedRowKeys;
    // let ids = sjData.toString();
    let ids="";
    debugger;
    if (id && id.ids.length>0) {
      const sjData=id.ids;
      for (let i = 0; i < sjData.length; i++) {
        ids += "," + sjData[i].id;
      }
      ids.substring(1);
    }
    debugger;
    if (reportinfo.designType === '1') {
      debugger;
      const pm = {
        ids: ids,
      };
      const param =
        reportinfo.reportid +
        '?ssotoken=' +
        cookie.load('ssotoken') +
        '&epsParam=' +
        encodeURIComponent(JSON.stringify(pm));
      const ipvaule = await fetch.post(
        '/api/eps/control/main/params/getParamsDevOption',
        this.params,
        {
          params: {
            code: 'REPORT0001',
            gnid: '',
            yhid: SysStore.getCurrentUser().id,
            ...this.params,
          },
        },
      );
      const pathvaule = await fetch.post(
        '/api/eps/control/main/params/getParamsDevOption',
        this.params,
        {
          params: {
            code: 'REPORT0012',
            gnid: '',
            yhid: SysStore.getCurrentUser().id,
            ...this.params,
          },
        },
      );

      this.printUrl =
        'http://' + ipvaule.data + pathvaule.data + '/view/' + param;

      // window.open(url);
    } else if (reportinfo.designType === '3') {
      debugger;
      const pp = store.params;
      pp['ids'] = ids;

      const response = await fetch.post(
        `/api/eps/control/main/epsreport/queryReportData`,
        this.params,
        {
          params: {
            id: reportinfo.id,
            storeParams: pp,
            ...this.params,
          },
        },
      );

      if (response && response.status === 200) {
        //  this.yjsqdate = response.data.results;
        //    let data1 = response.data.message;
        let data1 = response.data.results;
        this.param = data1;
        let reportName1 = data1.reportName;
        this.param['data'] = data1.data;
        this.param['paramter'] = data1.paramter;

        const jasperPathVaule = await fetch.post(
          '/api/eps/control/main/params/getParamsDevOption',
          this.params,
          {
            params: {
              code: 'REPORT0002',
              gnid: '',
              yhid: SysStore.getCurrentUser().id,
              ...this.params,
            },
          },
        );

        if (!jasperPathVaule) {
          return;
        }

        axios({
          // 用axios发送post请求
          method: 'post',
          url:
            'http://' +
            jasperPathVaule.data +
            '/offline/report/apiMap/print/' +
            reportName1, // 请求地址
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

              this.printUrl =
                '/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' +
                pdfurl +
                '&printfile=1&downfile=1&_timestamp=' +
                new Date().getTime();
                window.open('/api/eps/control/main/app/lib/pdf/web/viewer.html?file=' + pdfurl + "&printfile=1&downfile=1");
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
    }
  };

  @action doPrintOrPreview = async (opt, repid,store,id) => {
    if (!repid) {
      return;
    }
    if (!this.existsReportPlugin()) {
      return;
    }
    let qurl = Eps.getRootUrl() + '/api/eps/control/main/epsreport';
    if (1 == 1) {
      this.queryForId(repid).then(() => {
        let reportinfo = this.epsReportEntity;
        if (reportinfo.designType != '2') {
          this.reportPrint(reportinfo, store,id);
        } else {
          let names = this.allData.reportDataSetNames;
          if (names && names.length > 0) {
            let pms = {};
            let tknifo = 'token=' + Eps.getCookie('token');
            if (opt == 'design') {
              pms['opt'] = '0';
            } else if (opt == 'print') {
              pms['opt'] = '2';
            } else {
              pms['opt'] = '1';
            }
            pms['id'] = repid;
            pms['queryUrl'] = qurl + '/queryForId?' + tknifo;
            let datainfo = [];
            for (let i = 0; i < names.length; i++) {
              let di = {};
              di['name'] = names[i];
              if (names[i] == 'GRID') {
                di['fields'] = JSON.stringify(
                  this.getReportDBFields(this.allData.fields),
                ).replace(/\u005C\u005C/g, '\u005C');
              }
              if (names[i] == 'GRID_MASTER') {
                di['fields'] = JSON.stringify(
                  this.getReportDBFields(this.allData.fields),
                ).replace(/\u005C\u005C/g, '\u005C');
              }
              if (names[i] == 'GRID_SLAVE') {
                di['fields'] = JSON.stringify(
                  this.getReportDBFields(this.allData.datilfields),
                ).replace(/\u005C\u005C/g, '\u005C');
              }
              //di["indexfieldnames"]="";
              //di["masterdataname"]="";
              //di["masterfields"]="";
              let rdi = this.doGetReportDataInfo(names[i]);
              for (let key in rdi) {
                di[key] = rdi[key];
              }
              datainfo.push(di);
            }
            pms['datainfo'] = JSON.stringify(datainfo);
            pms['saveurl'] = qurl + '/updatexml?' + tknifo;
            pms['rsqlparams'] = JSON.stringify(this.doGetReportSqlParams());
            pms['rsqlurl'] = qurl + '/runsql?' + tknifo;
            pms['queryparams'] = JSON.stringify({}).replace(
              /\u005C\u005C/g,
              '\u005C',
            );

            let vd = base64encode(utf16to8(JSON.stringify(pms)));
            let reporturl = this.url + '/genVReport';
            const fd = new FormData();
            fd.append('data', vd);
            fetch
              .post(reporturl, fd, {
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded',
                },
              })
              .then((response) => {
                if (response.status === 200) {
                  let opnenurl = 'epssoft:@EpsReport@?';
                  opnenurl +=
                    'id=' +
                    response.data +
                    '&url=' +
                    qurl +
                    '/queryVReport?' +
                    tknifo;
                  window.location.href = opnenurl;
                }
              });
          }
        }
      });
    }
  };

  doGetReportDataInfo(name, baseQueryMethod, page) {
    let rdi = {};
    rdi['url'] = this.doGetDataUrl(name, baseQueryMethod, page);
    rdi['par'] = this.doGetDataParams(name, page);
    return rdi;
  }

  getJsonQueryParams(queryparams) {
    let p = {};
    if (queryparams) {
      for (let key in queryparams) {
        let val = queryparams[key];
        let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
        if (reg.test(val)) {
          p[key] = this.encodeUnicode(val);
        } else {
          p[key] = val;
        }
      }
    }
    return p;
  }

  getReportDBFields(fields) {
    if (fields) {
      let re = [];
      for (let i = 0; i < fields.length; i++) {
        let fd = fields[i];
        re.push({
          name: fd.code.toUpperCase(),
          type: 'string',
          width: 1000,
          text: this.encodeUnicode(fd.title),
        });
      }
      return re;
    } else {
      return null;
    }
  }

  doGetDataUrl(name) {
    let str = Eps.getRootUrl() + this.getReportDataUrlByName(name);
    return str ? str + '?token=' + Eps.getCookie('token') : '';
  }

  doGetDataParams(name, page) {
    let par = {};
    if ('GRID_MASTER' == name) {
      if (this.allData.store.params) {
        for (let key in this.allData.store.params) {
          let val = this.allData.store.params[key];
          let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
          if (reg.test(val)) {
            par[key] = this.encodeUnicode(val);
          } else {
            par[key] = val;
          }
        }
      }
    }
    if ('GRID_SLAVE' == name) {
      par['fid'] =
        (this.allData.store.selectedRowKeys &&
          this.allData.store.selectedRowKeys[0]) ||
        '';
      if (this.allData.store.params) {
        for (let key in this.allData.store.params) {
          let val = this.allData.store.params[key];
          let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
          if (reg.test(val)) {
            par[key] = this.encodeUnicode(val);
          } else {
            par[key] = val;
          }
        }
      }
    } else {
      if (this.allData.store.params) {
        for (let key in this.allData.store.params) {
          let val = this.allData.store.params[key];
          let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
          if (reg.test(val)) {
            par[key] = this.encodeUnicode(val);
          } else {
            par[key] = val;
          }
        }
      }
    }
    return JSON.stringify(par).replace(/\u005C\u005C/g, '\u005C');
  }

  getReportDataUrlByName(dataSetName) {
    let data = '';
    if ('GRID' == dataSetName) {
      data = this.allData.baseQueryMethod;
    }
    if ('GRID_MASTER' == dataSetName) {
      data = this.allData.baseQueryMethod;
    }
    if ('GRID_SLAVE' == dataSetName) {
      data = this.allData.datilQueryMethod;
    }
    return data;
  }

  doGetReportSqlParams(page) {
    return {};
  }

  existsReportPlugin() {
    // if (Ext.isIE) {
    //
    // } else {
    // try {
    // window.location.href = "epssof2t:@EpsReport@?";
    // } catch (e) {
    // var url = location.href;
    // url = url.substring(0, url.indexOf("?") < 0
    // ? url.length
    // : url.indexOf("?"));
    // window.open(url + "/resource/soft/EPSReport_6.0.exe");
    // }
    // }
    return true;
  }

  encodeUnicode(str) {
    let newstr = str.replace(/(^\s*)|(\s*$)/g, '');
    let res = [];
    for (let i = 0; i < newstr.length; i++) {
      res[i] = ('00' + newstr.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + res.join('\\u');
  }

  /* @action queryForPage = async () => {

       this.loading = true;

       const response = await fetch
           .post(`${this.url}/queryForPage`, this.params, {
               params: {
                   page: this.pageno-1,
                   pagesize: this.pagesize,
                   limit: this.pagesize,
                   umid: this.umid,
                   ...this.params,
               },
           });
       if (response && response.status === 200) {
           runInAction(() => {
               this.total = response.data.total;
               //    this.data = this.afterQueryData(response.data.results);
               let totals = response.data.total;
               var sjData = [];
               this.data = response.data.results;
               this.loading = false;
           });
       }
       else {
           this.loading = true;
       }

   }*/
}

export default new EpsReportStore('/api/eps/control/main/epsreport');
