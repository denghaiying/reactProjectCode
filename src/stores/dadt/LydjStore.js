import React from 'react';
import { makeObservable, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import fetch from '@/utils/fetch';
import SysStore from '@/stores/system/SysStore';
import FgService from '@/services/ksh/FgService';
import diagest from '@/utils/diagest';
import BaseWfStore from '../workflow/BaseWfStore';
import DapubStore from '../dagl/DapubStore';
import { message } from 'antd';
import { AirConditioning } from '@icon-park/react';
class LydjStore extends BaseWfStore {
  // querySjzd 查询数据字典 zdx: 证件名称
  sjzdData = {};
  treeData = [];
  daklist = [];
  tloading = [];
  tpageno = [];
  tpagesize = [];
  tdata = [];
  tparams = [];
  lymxData = {};
  lymxDataCount = 0;
  lymxLoading = false;
  fjData = [];
  loadingFile = false;
  loadingCard = false;
  pic_z = null;
  pic_f = null;
  fileData = [];
  fileDialogShow = false;
  fileshowtype = '';
  files = {};
  fileTbl = {};
  pdffiles = {};
  downloadingpdf = false;
  downloadingfile = false;
  system = 'NULL';
  timer = '';
  steamvideoimg = '';
  tempUsers = [];
  listTempUsers = [];
  qxModalVisible = false;
  qxCurName = 'attr_qzmc';
  qxMap = {};
  qxData = { ywck: true, kfda: false };
  qxFilterStr = '';
  qxNdFilterStr = '';
  qxMapLoading = false;
  saving = false;
  devIdx = 0;
  lymxShow = false;
  drawVisit = false;

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this, {
      sjzdData: observable,
      treeData: observable,
      daklist: observable,
      tloading: observable,
      tpageno: observable,
      tpagesize: observable,
      tdata: observable,
      tparams: observable,
      lymxData: observable,
      lymxDataCount: observable,
      lymxLoading: observable,
      fjData: observable,
      loadingFile: observable,
      loadingCard: observable,
      pic_z: observable,
      pic_f: observable,
      fileData: observable,
      fileDialogShow: observable,
      fileshowtype: observable,
      files: observable,
      fileTbl: observable,
      pdffiles: observable,
      downloadingpdf: observable,
      downloadingfile: observable,
      system: observable,
      tempUsers: observable,
      listTempUsers: observable,
      qxModalVisible: observable,
      qxMap: observable,
      qxData: observable,
      qxCurName: observable,
      qxFilterStr: observable,
      qxNdFilterStr: observable,
      qxMapLoading: observable,
      saving: observable,
      devIdx: observable,
      lymxShow: observable,
      drawVisit: observable,

      getSjzdData: action,
      getDakTree: action,
      queryDakData: action,
      queryLymxData: action,
      checkLymxRecord: action,
      clearLymxData: action,
      addTmToLymx: action,
      removeTab: action,
      setTPageNo: action,
      setTPageSize: action,
      queryFJList: action,
      deleteFile: action,
      saveDjrData: action,
      uploadSQZip: action,
      downloadResultZip: action,
      readCard: action,
      closeCamera: action,
      rotate: action,
      scanPic: action,
      showFiles: action,
      closeFileDialog: action,
      downloadFile: action,
      downloadPdf: action,
      deleteLYmx: action,
      queryTempUsers: action,
      queryUsedUsers: action,
      clearUsedUsers: action,
      tranferAppro: action,
      diaoJuan: action,
      stlq: action,
      stgh: action,
      showQxModal: action,
      refreshQxset: action,
      reSetQxData: action,
      setAllQxData: action,
      refreshQxFilter: action,
      refreshQxNdFilter: action,
      chaKanDoc: action,
      chaKaiFangArc: action,
      setTmtj: action,
      clearQxData: action,
      changeDevIdx: action,
      showLymxModal: action,
    });
  }

  clearData() {
    this.pic_f = null;
    this.pic_z = null;
  }

  beforeSetEditRecord(value) {
    return value;
  }

  //action
  getSjzdData = async (zdmc) => {
    const fd = new FormData();
    fd.append('zdx', zdmc);
    const res = await fetch.post(`${this.url}/querySjzd`, fd);
    if (res && res.data && res.data.success) {
      runInAction(() => {
        this.sjzdData[zdmc] = res.data.results;
      });
    }
  };

  getSjzdValue = (zdmc, label, valueCol = 'id') => {
    const items = this.sjzdData[zdmc];
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.mc === label) {
          return item[valueCol];
        }
      }
    }
    return '';
  };

  getData = (data) => {
    if (!data) {
      return null;
    }
    return data.map((d) => ({
      label: d.label,
      value: d.id,
      key: d.key,
      children: this.getData(d.children),
      icon: (
        <i
          className={`iconfont ${d.type === 'F' || !d.leaf ? 'icondir' : 'iconfile'
            }`}
        />
      ),
      selectable: d.leaf,
    }));
  };

  getDakList = (data) => {
    if (!data || data.length === 0) {
      return null;
    }
    const arr = [];
    data.forEach((d) => {
      d.type !== 'F' &&
        arr.push({
          label: d.label,
          value: d.id,
          key: d.key,
        });

      const chld = this.getDakList(d.children);
      chld && arr.push(...chld);
    });
    return arr;
  };

  //action
  getDakTree = async () => {
    const params = { isby: 'N', noshowdw: 'Y', node: 'root', tmzt: '4' };
    params['dayh'] = SysStore.getCurrentUser().id;
    params['dw'] = SysStore.getCurrentCmp().id;
    const res = await fetch.get('/api/eps/control/main/dak/queryTree', {
      params,
    });
    runInAction(() => {
      this.treeData = this.getData(res && res.data);
      this.daklist = this.getDakList(res && res.data);
    });
  };

  //action
  queryDakData = async (index, params) => {
    let newPage = false;
    if (index == this.tpageno.length) {
      newPage = true;

      const [...tpageno] = this.tpageno;
      tpageno.push(1);
      this.tpageno = [...tpageno];
      const [...tpagesize] = this.tpagesize;
      tpagesize.push(10);
      this.tpagesize = [...tpagesize];
      const [...tparams] = this.tparams;
      tparams.push(params || {});
      this.tparams = [...tparams];
      const [...tloading] = this.tloading;
      tloading.push(true);
      this.tloading = [...tloading];
    }
    const fd = new FormData();
    fd.append('page', this.tpageno[index] - 1);
    fd.append('limit', this.tpagesize[index]);
    fd.append('tmzt', '4');
    fd.append('hszbz', 'N');
    fd.append('dayh', SysStore.getCurrentUser().id);
    fd.append('dwid', SysStore.getCurrentCmp().id);
    if (params) {
      for (const key in params) {
        fd.append(key, params[key]);
      }
    } else {
      for (const key in this.tparams[index]) {
        fd.append(key, this.tparams[index][key]);
      }
    }
    const res = await fetch.post('/api/eps/control/main/dagl/queryForPage', fd);
    const data = res && res.status === 200 && res.data.success && res.data;
    runInAction(() => {
      const [...ndata] = this.tdata;
      if (newPage) {
        ndata.push(data);
      } else {
        ndata[index] = data;
      }
      this.tdata = [...ndata];
      const [...tloading] = this.tloading;
      tloading[index] = false;
      this.tloading = [...tloading];
    });
  };

  //action
  queryLymxData = async (id) => {
    this.lymxLoading = true;
    const param = new FormData();
    param.append('djdid', id);
    const res = await fetch.post(`${this.url}/queryForLydjtmmx`, param);
    const data = res && res.status === 200 && res.data.success && res.data;
    this.lymxLoading = false;

    runInAction(() => {
      this.lymxData = data;
      console.log('queryLymxData中调用了findCount');
      this.findCount(this.editRecord.id);
    });
  };

  //action
  clearLymxData = () => {
    this.lymxData = [];
  };

  //action
  checkLymxRecord = async (rowindex, checked) => {
    if (rowindex < 0) {
      return;
    }
    const data = Array.from(this.lymxData.results);
    const { ...record } = data[rowindex];
    record.stjy = (checked && 'Y') || 'N';
    record.dzjy = (checked && 'N') || 'Y';
    data[rowindex] = record;
    this.lymxData = { results: data };
  };

  //action 获取条数
  findCount = async (id) => {
    const param = new FormData();
    param.append('djdid', id);
    const res = await fetch.post(`${this.url}/queryForLydjtmmx`, param);
    const data = res && res.status === 200 && res.data.success && res.data;

    runInAction(() => {
      this.lymxDataCount = data.results.length;
    });
  };

  //action
  addTmToLymx = async (index, record) => {
    const param = new FormData();
    param.append('djdid', this.editRecord.id);
    if (index === '') {
      param.append('dakid', record.attr_dakid);

      param.append('bmc', record.attr_bmc);
      param.append('id', record.attr_tmid);
    } else {
      param.append('dakid', this.tparams[index].dakid);
      param.append('bmc', this.tparams[index].bmc);
      param.append('id', record.id);
    }

    param.append('tmzt', 3);
    const res = await fetch.post(`${this.url}/addLydt`, param);
    if (res && res.status === 200 && res.data) {
      if (res.data.success === false) {
        this.openNotification(res.data.message, 'warning');
      } else {
        this.findCount(this.editRecord.id);
        this.openNotification('加入成功', 'success');
        this.queryLymxData(this.editRecord.id);
      }
    }
  };

  //action
  removeTab = (index) => {
    this.tloading.splice(index, 1);
    this.tpageno.splice(index, 1);
    this.tpagesize.splice(index, 1);
    this.tdata.splice(index, 1);
    this.tparams.splice(index, 1);
  };

  //action
  setTPageNo = async (key, pageno) => {
    this.tpageno[key] = pageno;
    await this.queryDakData(key);
  };

  //action
  setTPageSize = async (key, pageSize) => {
    this.tpagesize[key] = pageSize;
    await this.queryDakData(key);
  };

  //action
  queryFJList = async (rec) => {
    this.fjData = [];
    if (!rec) {
      this.pic_z = null;
      this.pic_f = null;
      return;
    }
    this.pic_z = rec.sfzz && `data:image/gif;base64,${rec.sfzz}`;
    this.pic_f = rec.sfzf && `data:image/gif;base64,${rec.sfzf}`;
    const { id, filegrpid } = rec;
    if (!filegrpid) {
      return;
    }

    this.loadingFile = true;
    const params = {
      doctbl: 'DALYDJ_FJ',
      grptbl: 'DALYDJ_FJFZ',
      grpid: filegrpid,
      sfzxbb: 1,
      daktmid: id,
    };
    const res = await fetch.get('/api/eps/wdgl/attachdoc/queryForList', {
      params,
    });
    if (res && res.status === 200 && res.data) {
      const fjlist = res.data;
      if (fjlist) {
        const data = [];
        for (let i = 0; i < fjlist.length; i++) {
          const f = fjlist[i];
          const dres = await fetch.post(
            `/api/eps/wdgl/attachdoc/download?fileid=${f.fileid}&grpid=${f.grpid
            }&doctbl=DALYDJ_FJ&printfile=0&downfile=0&grptbl=DALYDJ_FJFZ&atdw=${SysStore.getCurrentCmp().id
            }&umid=WDGL0004&mkbh=null&downlx=01`,
            {},
            { responseType: 'blob' },
          );
          if (dres && dres.status === 200) {
            const { ...p } = f;
            data.push({
              ...p,
              url: window.URL.createObjectURL(new Blob([dres.data])),
            });
          }
        }
        runInAction(() => {
          this.fjData = data;
          this.loadingFile = false;
        });
      }
    } else {
      this.loadingFile = false;
    }
  };

  //action
  deleteFile = async (grpid, fileid) => {
    const [...odata] = this.fjData;
    const newData = [];
    if (odata && odata.length > 0) {
      for (let i = 0; i < odata.length; i++) {
        const d = odata[i];
        if (d.fileid && d.grpid === grpid && d.fileid === fileid) {
          const fd = new FormData();
          fd.append('doctbl', 'DALYDJ_FJ');
          fd.append('wktbl', 'DALYDJ');
          fd.append('grptbl', 'DALYDJ_FJFZ');
          fd.append('grpid', grpid);
          fd.append('fileid', fileid);
          fetch.post('/api/eps/wdgl/attachdoc/delete', fd);
        } else if (d.id === fileid) {
          //
        } else {
          newData.push(d);
        }
      }
      this.fjData = newData;
    }
  };

  base64ToFile = (base64str, filename) => {
    const arr = base64str.split(',');
    // const mime = arr[0].match(/:(.*?);/)[1],
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename);
  };

  uploadScanFile = async (rec) => {
    const [...fj] = this.fjData;
    const upfiles = fj.filter((o) => o.id);
    if (upfiles && upfiles.length > 0) {
      const grpid = rec.filegrpid || diagest.uuid();
      const dwid = SysStore.getCurrentCmp().id;
      const userinfo = SysStore.getCurrentUser();
      await axios.all(
        upfiles.map((o) => {
          const fd = new FormData();
          fd.append('wrkTbl', 'DALYDJ');
          fd.append('docTbl', 'DALYDJ_FJ');
          fd.append('docGrpTbl', 'DALYDJ_FJFZ');
          fd.append('lx', '');
          fd.append('grpid', grpid);
          fd.append('tybz', 'N');

          fd.append('atdw', dwid);
          fd.append('idvs', JSON.stringify({ id: rec.id }));
          fd.append('Fdata', this.base64ToFile(o.url, `${diagest.uuid()}.png`));
          return fetch.post('/api/eps/wdgl/attachdoc/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }),
      );
    }
  };
  //action
  saveDjrData = async (values, genuser = false, successcallback) => {
    const { ...v } = this.editRecord;
    this.editRecord = { ...v, ...values };
    this.saving = true;
    values.yysj = values.yysj ? moment(values.yysj).format('YYYY-MM-DD HH:mm:ss') : undefined
    const fd = {
      ...values,
      genuser: !!genuser,
      zt: false,
      djr: SysStore.getCurrentUser().yhmc,
      djrq: moment().format('YYYY-MM-DD'),
    };
    if (genuser) {
      fd.qxdata = this.qxData;
    }
    if (this.pic_z) {
      fd.sfzz = this.pic_z.substring(22);
    }
    if (this.pic_f) {
      fd.sfzf = this.pic_f.substring(22);
    }
    let response;
    if (this.opt === 'edit') {
      response = await fetch.put(`${this.url}/update`, fd);
    } else {
      response = await fetch.post(`${this.url}/add`, fd);
    }
    this.saving = false;
    if (response && response.status === 200 && response.data) {
      if (response.data.success) {
        const opt = this.opt;
        this.opt = 'edit';
        const rec = response.data.results;
        await this.uploadScanFile(rec);
        successcallback && successcallback();
        const params = new FormData();
        params.append('id', rec.id);
        const resp = await fetch.post(`${this.url}/queryDadjByKey`, params);
        if (resp && resp.status === 200 && resp.data) {
          this.queryFJList(resp.data);
          runInAction(() => {
            this.editRecord = resp.data;
          });
        }
      } else {
        message.warning(response.data.message);
      }
    }
    this.findCount(this.editRecord.id);
  };

  saveDjData = async (values, needClose = true) => {
    let response;
    if (this.opt === 'edit') {
      response = await fetch.put(`${this.url}/update`, values);
    } else {
      response = await fetch.post(`${this.url}/add`, values);
    }
    if (response && response.status === 200 && response.data) {
      if (response.data.success) {
        this.editVisible = !needClose;
        const params = new FormData();
        params.append('id', response.data.id);
        const resp = await fetch.post(`${this.url}/queryDadjByKey`, params);
        if (resp && resp.status === 200 && resp.data) {
          this.queryFJList(resp.data);
          runInAction(() => {
            this.editRecord = resp.data;
          });
        }
        this.queryFJList(resp.data);
        this.findCount(this.editRecord.id);
        this.queryForPage();
      }
    }
  };

  saveLastDjData = async (values) => {
    let response;
    response = await fetch.put(`${this.url}/update`, values);
    if (response && response.status === 200 && response.data) {
      if (response.data.success) {
        this.editVisible = false;
        runInAction(() => {
          this.editRecord = response.data;
        });
        window.location.reload();
      }
    }
  };

  //action
  uploadSQZip = async (file, params, uploadUrl = '/upload', option) => {
    const param = new FormData();
    param.append('Fdata', file);
    if (params) {
      Object.keys(params).forEach((k) => {
        param.append(k, params[k]);
      });
    }
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (option && option.onProgress) {
      config.onUploadProgress = (e) => {
        option.onProgress(e);
      };
    }
    const id = diagest.uuid().toUpperCase();
    const res = await fetch.post(
      `${this.url}${uploadUrl}?djdid=${id}`,
      param,
      config,
    );
    if (res && res.status === 200 && res.data) {
      if (res.data.success === false) {
        this.openNotification(res.data.message, 'warning');
      } else {
        const o = res.data.results;
        runInAction(() => {
          this.showEditForm('edit', {
            ...o,
            lyfs: this.getSjzdValue('利用方式', '网络', 'bh'),
          });
        });
      }
    }
  };
  //action
  downloadResultZip = async (djdid) => {
    message.info({
      duration: 0,
      content: '结果包正在下载中，请稍后...',
    });
    const param = new FormData();
    param.append('djdid', djdid);
    const response = await fetch.post(`${this.url}/download`, param, {
      responseType: 'blob',
    });
    message.destroy();
    if (response && response.status === 200) {
      const type =
        response.headers['context-type'] && 'application/octet-stream';
      let filename = response.headers['content-disposition'];
      const pos = filename.indexOf('filename=');
      if (pos > 0) {
        filename = filename.substring(pos + 9);
        if (filename.indexOf('"') > -1) {
          filename = filename.substring(1, filename.length - 1);
        }
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
    }
  };
  //action
  readCard = async () => {
    this.loadingCard = true;
    const res = await axios
      .post('http://127.0.0.1:38088/card=idcard', '', {
        timeout: 30000,
      })
      .catch((err) => {
        message.error('身份证读取失败！原因是：' + err);
      });
    if (res && res.status === 200 && res.data) {
      if (res.data.code == 0) {
        const cardinfo = res.data.IDCardInfo;
        const values = {
          jtzz: cardinfo.address,
          cyrxm: cardinfo.name,
          zjhm: cardinfo.cardID,
        };
        const zjlist = this.sjzdData['证件名称'];
        if (zjlist && zjlist.length > 0) {
          for (let i = 0; i < zjlist.length; i++) {
            if (zjlist[i].mc === '身份证') {
              values['zjmc'] = zjlist[i].bh;
            }
          }
        }
        runInAction(() => {
          const { ...v } = this.editRecord;
          this.editRecord = { ...v, ...values };
          this.pic_z = `data:image/gif;base64,${cardinfo.photoBase64_Z}`;
          this.pic_f = `data:image/gif;base64,${cardinfo.photoBase64_F}`;
          this.loadingCard = false;
        });
      }
    }
    this.loadingCard = false;
  };
  //Linux环境读取身份证
  readLinuxCard = async () => {
    this.loadingCard = true;
    const res = await axios
      .post('http://127.0.0.1:6543/getIDCardInfo', '', {
        timeout: 30000,
      })
      .catch((err) => {
        message.error('身份证读取失败！原因是：' + err);
      });
    if (res && res.status === 200 && res.data) {
      if (res.data.returnCode == 0) {
        const cardinfo = res.data.data;
        const values = {
          jtzz: cardinfo.address,
          cyrxm: cardinfo.name,
          zjhm: cardinfo.cardnumber,
        };
        const zjlist = this.sjzdData['证件名称'];
        if (zjlist && zjlist.length > 0) {
          for (let i = 0; i < zjlist.length; i++) {
            if (zjlist[i].mc === '身份证') {
              values['zjmc'] = zjlist[i].bh;
            }
          }
        }
        runInAction(() => {
          const { ...v } = this.editRecord;
          this.editRecord = { ...v, ...values };
          //this.pic_z = `data:image/gif;base64,${cardinfo.img}`;
          // this.pic_f = `data:image/gif;base64,${cardinfo.img}`;
        });
      } else {
        message.warn('身份证读取失败，请重新放置后，再试一次！');
      }
    }
    const openres = await axios.post(
      `http://127.0.0.1:6543/StartPreview?dev_idx=${this.devIdx}&res_id=0&pixfmt=pixfmt`,
      '',
      {
        timeout: 30000,
      },
    );
    if (
      openres &&
      openres.status == 200 &&
      openres.data &&
      openres.data.returnCode == 0
    ) {
      alert('请放置身份证，且正面朝上！放置完成后点击关闭。');
      const response = await this.readPhotoCard(1);
      if (response.status == 200 && response.data.returnCode == 0) {
        alert('请放置身份证，反面面朝上！放置完成后点击关闭。');
        const response1 = await this.readPhotoCard(2);
        if (response1.status == 200 && response1.data.returnCode == 0) {
          runInAction(() => {
            // this.pic_z = null;
            this.pic_z = `data:image/jpg;base64,${response1.data.data.img}`;
          });
        }
      }
    } else {
      message.warn('高拍仪摄像头打开失败，请重新放置后，再试一次！');
    }

    this.loadingCard = false;
  };
  readPhotoCard = (step) => {
    return axios.post(
      `http://127.0.0.1:6543/composeIDcardPic?step=${step}`,
      '',
      {
        timeout: 30000,
      },
    );
  };

  /**
   * 关闭主摄像头
   */
  //action
  closeCamera = async () => {
    await axios.post('http://127.0.0.1:38088/video=close', '', {
      timeout: 30000,
    });
  };
  closeCameraLinux = async () => {
    await axios.post('http://127.0.0.1:6543/StopPreview', '', {
      timeout: 30000,
    });
  };
  //action
  rotate = async (rotate) => {
    await axios.post(
      'http://127.0.0.1:38088/video=rotate',
      `{"camidx":"${this.devIdx}","rotate":"${rotate}"}:""`,
      {
        timeout: 30000,
      },
    );
  };
  InitScanLinux = async () => {
    await axios.get('http://localhost:6543/GetDeviceCount');
  };

  /**
   * 主摄像头拍照
   */
  //action
  scanPic = async () => {
    //参数写法很奇怪，但是必须这样写，否则无法拍照
    const res = await axios.post(
      'http://127.0.0.1:38088/video=grabimage',
      `{"filepath":"base64","rotate":"0","camidx":"${this.devIdx}","cutpage":"0"}:""`,
      {
        timeout: 30000,
      },
    );
    if (res && res.status === 200 && res.data) {
      if (res.data.code == 0) {
        //photoBase64
        runInAction(() => {
          this.fjData.push({
            id: diagest.uuid(),
            url: `data:image/gif;base64,${res.data.photoBase64}`,
          });
        });
      }
    }
  };

  changeDevIdx = async () => {
    const idx = this.devIdx === 0 ? 1 : 0;
    this.devIdx = idx;
    //   console.log(`http://127.0.0.1:38088/StartPreview?dev_idx=${idx}&res_id=0&pixfmt=pixfmt`);
    //  // if (this.system != 'Windows') {

    //     axios.post(
    //       `http://127.0.0.1:38088/StartPreview?dev_idx=${idx}&res_id=0&pixfmt=pixfmt`,
    //       '',
    //       {
    //         timeout: 30000,
    //       },
    //     );
    //    }
    runInAction(() => {
      this.devIdx = idx;
    });
  };

  scanPicLinux = async () => {
    const res = await axios.post(
      'http://127.0.0.1:6543/getPic?quality=100',
      '',
      {
        timeout: 30000,
      },
    );
    if (res && res.status === 200 && res.data) {
      if (res.data.returnCode == 0) {
        //photoBase64
        runInAction(() => {
          this.fjData.push({
            id: diagest.uuid(),
            url: `data:image/gif;base64,${res.data.data.img}`,
          });
        });
      }
    }
  };
  startPreview = async () => {
    return await axios.post(
      `http://127.0.0.1:6543/StartPreview?dev_idx=${this.devIdx}&res_id=0&pixfmt=pixfmt`,
      '',
      {
        timeout: 30000,
      },
    );
  };
  getFrame = async () => {
    return await axios.get(
      `http://127.0.0.1:6543/getFrame?dev_idx=${this.devIdx}&res_id=0&pixfmt=pixfmt`,
      '',
    );
  };
  getRotate = async () => {
    return await axios.get('http://127.0.0.1:6543/getRotate');
  };
  Rotate = async (count) => {
    const res = await axios.post(
      `http://127.0.0.1:6543/Rotate?count=${count}`,
      '',
      {
        timeout: 30000,
      },
    );
    if (res && res.status == 200 && res.data.returnCode == 0) {
      message.success('视频旋转成功！');
    } else {
      message.error('旋转失败！原因是：' + res.data.returnMsg);
    }
  };
  JiuPian = async (checked) => {
    const res = await axios.get(
      `http://127.0.0.1:6543/EnableDeskImage?enable=${checked ? 1 : 0}`,
    );
    if (res && res.status == 200 && res.data.returnCode == 0) {
      message.success(`${checked ? '开启' : '关闭'}纠偏成功！`);
    } else {
      message.error(
        `${checked ? '开启' : '关闭'}纠偏失败！原因是：${res.data.returnMsg}`,
      );
    }
  };

  /**
   * 获取文件列表
   * @param {*} type D:档案库
   * @param {*} docparams
   */
  //action
  showFiles = async (type, docparams) => {
    this.fileDialogShow = true;
    this.fileshowtype = type;
    if ('D' === type) {
      const { bmc, grpid, id, rec, dakid } = docparams;
      const params = { doctbl: `${bmc}_FJ`, grptbl: `${bmc}_FJFZ`, grpid };
      const res = await fetch.get('/api/eps/wdgl/attachdoc/queryForList', {
        params,
      });
      this.fileTbl = {
        doctbl: `${bmc}_FJ`,
        grptbl: `${bmc}_FJFZ`,
        id,
        type: 'D',
        rec,
        bmc,
        dakid,
        daktmid: rec.id,
        tmzt: '4',
      };
      console.log('LydjStore.rec', this.fileTbl);
      runInAction(() => {
        console.log('fileData', this.fileData);
        this.fileData = (res && res.status === 200 && res.data) || [];
      });
    } else {
      const { filegrpid } = docparams;
      const params = {};
      if (filegrpid) {
        params['grpid'] = filegrpid;
        params['doctbl'] = 'DALYDJ_FJ';
        params['grptbl'] = 'DALYDJ_FJFZ';
        params['daktmid'] = docparams.tmid;
        params['dakid'] = docparams.dakid;
      } else {
        const { dakid, tmid } = docparams;
        const table = await DapubStore.getDakTableList(dakid);
        const p = new FormData();
        p.append('bmc', table.bmc);
        p.append('id', tmid);
        const obj = await fetch.post(
          '/api/eps/control/main/dagl/queryForId',
          p,
        );
        if (obj && obj.status === 200 && obj.data) {
          params['grpid'] = obj.data.filegrpid;
          params['doctbl'] = `${table.bmc}_FJ`;
          params['grptbl'] = `${table.bmc}_FJFZ`;
          params['daktmid'] = obj.data.id;
          params['dakid'] = dakid;
        }
      }
      if (params.grpid) {
        const res = await fetch.get('/api/eps/wdgl/attachdoc/queryForList', {
          params,
        });
        this.fileTbl = {
          doctbl: params.doctbl,
          grptbl: params.grptbl,
          type: 'L',
        };
        if ('daktmid' in params) {
          this.fileTbl.daktmid = params.daktmid;
        }
        if ('dakid' in params) {
          this.fileTbl.dakid = params.dakid;
        }
        runInAction(() => {
          this.fileData = res && res.status === 200 && res.data;
          this.findCount(this.editRecord.id);
        });
      }
    }
  };

  //action
  closeFileDialog = () => {
    this.files = {};
    this.fileDialogShow = false;
  };

  //action
  downloadFile = async (fileid, grpid) => {
    if (!this.files[fileid]) {
      this.downloadingfile = true;
      const dres = await fetch.post(
        `${this.url}/filedownload?fileid=${fileid}&grpid=${grpid}&doctbl=${this.fileTbl.doctbl
        }&printfile=0&downfile=0&grptbl=${this.fileTbl.grptbl}&atdw=${SysStore.getCurrentCmp().id
        }&umid=WDGL0004&mkbh=null&downlx=02&daktmid=${this.fileTbl.daktmid
        }&dakid=${this.fileTbl.dakid}&tmzt=4&id=${this.editRecord.id}`,
        {},
        { responseType: 'blob' },
      );
      if (dres && dres.status === 200) {
        const { ...p } = this.files;
        p[fileid] = {
          data: new Blob([dres.data]),
          grpid,
          grptbl: this.fileTbl.grptbl,
          doctbl: this.fileTbl.doctbl,
          id: this.fileTbl.id,
          bmc: this.fileTbl.bmc,
          dakid: this.fileTbl.dakid,
          rec: this.fileTbl.rec,
        };
        runInAction(() => {
          this.files = { ...p };
          this.downloadingfile = false;
        });
      }
    }
    // this.downloadingfile = false;
  };

  //action
  downloadPdf = async (fileid, pages, nums) => {
    //只有档案库中查看时才需要拆页，所以要传递利用单的id过去
    this.downloadingpdf = true;
    const key = `${this.fileTbl.id}_${fileid}_${(pages && pages.length > 0 && pages.join('_')) || '_all'
      }`;
    if (this.pdffiles[key]) {
      this.downloadingpdf = false;
      return this.pdffiles[key];
    }
    const v = this.files[fileid];
    if (v) {
      const { data, rec, ...p } = v;
      p['pages'] = pages;
      p['record'] = JSON.stringify(rec);
      const param = new FormData();
      if (p) {
        Object.keys(p).forEach((k) => {
          param.append(k, p[k]);
        });
      }
      param.append('id', this.fileTbl.id);
      param.append('bmc', this.fileTbl.bmc);
      param.append('dakid', this.fileTbl.dakid);
      param.append('rec', JSON.stringify(this.fileTbl.rec));
      param.append('tmys', (pages && pages.length) || nums);
      param.append('atdw', SysStore.getCurrentCmp().id);
      const res = await fetch.post(`${this.url}/downloadpdf/${fileid}`, param, {
        responseType: 'blob',
      });
      this.downloadingpdf = false;
      if (res && res.status === 200) {
        const data = res.data;
        runInAction(() => {
          this.pdffiles[key] = data;
        });
        this.queryLymxData(this.fileTbl.id);
        return data;
      }
    }
  };

  //action
  deleteLYmx = async (record) => {
    const params = new FormData();
    params.append('id', record.id);
    params.append('djdid', this.editRecord.id);
    const res = await fetch.post(`${this.url}/deleteLydjtmmx`, params);
    if (res && res.status === 200 && res.data) {
      if (res.data.success === false) {
        this.openNotification(res.data.message, 'warning');
      } else {
        //
        const { tmys } = record;
        const { fyys } = this.editRecord;
        const num = (fyys || 0) - (tmys || 0);
        if (num > 0) {
          this.setRecordValue('fyys', num);
        } else {
          this.setRecordValue('fyys', 0);
        }

        this.queryLymxData(this.editRecord.id);
      }
    }
  };

  //action
  getCurrentOS = () => {
    if (navigator.userAgent.indexOf('Window') > 0) {
      this.system = 'Windows';
    } else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
      this.system = 'Mac';
    } else if (navigator.userAgent.indexOf('Linux') > 0) {
      this.system = 'Linux';
      this.InitScanLinux();
    } else {
      this.system = 'NUll';
    }
  };

  //action
  queryTempUsers = async () => {
    const res = await fetch.get(`${this.url}/tempuser`);
    if (res && res.status === 200 && res.data) {
      runInAction(() => {
        this.tempUsers = res.data;
        this.listTempUsers = res.data;
      });
    }
  };
  // action
  queryUsedUsers = async (djid) => {
    const res = await fetch.get(`${this.url}/tempuseduser/${djid}`);
    if (res && res.status === 200 && res.data) {
      runInAction(() => {
        const usesid = res.data || [];
        this.listTempUsers =
          (this.tempUsers || []).filter((o) => !usesid.includes(o.id)) || [];
      });
    }
  };
  //action
  clearUsedUsers = () => {
    this.listTempUsers = Array.from(this.tempUsers);
  };

  //action
  tranferAppro = async () => {
    const res = await fetch.post(
      `${this.url}/tranferappro/${this.editRecord.id}`,
      this.lymxData.results || [],
    );
    if (res && res.status === 200 && res.data) {
      if (res.data.success) {
        message.info(`生成借阅单${res.data.message}成功`);
      } else {
        message.error(res.data.message);
      }
    }
  };

  //action
  diaoJuan = async () => {
    const res = await fetch.post(
      `${this.url}/diaojuan/${this.editRecord.id}`,
      this.lymxData.results || [],
    );
    if (res && res.status === 200 && res.data) {
      if (res.data.success) {
        const lsh = res.data.message;
        message.info(
          (lsh.startsWith('$') && `已调卷,调卷单号：${lsh.substring(1)}`) ||
          `生成调卷单成功,调卷单号：${lsh}`,
        );
      } else {
        message.error(res.data.message);
      }
    }
  };

  //action
  stlq = async () => {
    const res = await fetch.get(`${this.url}/stlq/${this.editRecord.id}`);
    if (res && res.status === 200 && res.data) {
      if (res.data.success) {
        message.info(`实体领取成功`);
      } else {
        message.error(res.data.message);
      }
    }
  };

  //action
  stgh = async () => {
    const res = await fetch.get(`${this.url}/stgh/${this.editRecord.id}`);
    if (res && res.status === 200 && res.data) {
      if (res.data.success) {
        message.info(`实体归还成功`);
      } else {
        message.error(res.data.message);
      }
    }
  };

  //action
  showQxModal = async (show) => {
    this.qxModalVisible = show;
    if (show) {
      this.qxMapLoading = true;
      const res = await fetch.post(`${this.url}/qxset/attr_qzh`, []);
      // const res2 = await fetch.post(`${this.url}/qxset/attr_flh`, []);
      this.qxMapLoading = false;
      runInAction(() => {
        if (res && res.status === 200) {
          this.qxMap.attr_qzh = res.data;
          this.qxCurName = 'attr_qzh';
        }
        // if (res2 && res2.status === 200) {
        //   this.qxMap.attr_flh = res.data;
        // }
        this.qxData = { ywck: true, kfda: false };
      });
    }
  };

  //action
  refreshQxset = async (name, params = []) => {
    this.qxMapLoading = true;
    const res = await fetch.post(`${this.url}/qxset/${name}`, params);
    this.qxMapLoading = false;
    if (res && res.status === 200) {
      runInAction(() => {
        this.qxFilterStr = '';
        this.qxNdFilterStr = null;
        this.qxCurName = name;
        this.qxMap[name] = res.data;
      });
    }
  };

  //action
  refreshQxFilter = (keyword) => {
    this.qxFilterStr = keyword;
  };

  //action
  refreshQxNdFilter = (range) => {
    this.qxNdFilterStr = range;
  };
  //action
  chaKanDoc = (checked) => {
    this.qxData.ywck = checked;
  };

  //action
  chaKaiFangArc = (checked) => {
    this.qxData.kfda = checked;
  };

  //action
  setDoc = (checked) => {
    this.qxData.ywck = checked;
  };

  //action
  setTmtj = (flag, text) => {
    if (flag) {
      this.qxData.attr_tm = text;
    } else {
      this.qxData.tm_no = text;
    }
  };

  // action
  setAllQxData = (name, checked) => {
    let data = Array.from(this.qxData[name] || []);
    const selectData = this.qxMap[name].filter(
      (o) =>
        (name !== 'attr_nd' &&
          (!this.qxFilterStr || o.includes(this.qxFilterStr))) ||
        !this.qxNdFilterStr ||
        this.qxNdFilterStr.length != 2 ||
        !this.qxNdFilterStr[0] ||
        (o >= this.qxNdFilterStr[0] && o <= this.qxNdFilterStr[1]),
    );
    if (checked) {
      this.qxData[name] = Array.from(new Set(data.concat(selectData)));
    } else {
      this.qxData[name] = Array.from(
        data.filter((o) => !selectData.includes(o)),
      );
    }
  };

  //action
  reSetQxData = (name, value, checked) => {
    let data = Array.from(this.qxData[name] || []);
    if (checked) {
      data.push(value);
    } else {
      data = Array.from(data.filter((o) => o != value));
    }
    this.qxData[name] = data;
  };

  //action
  clearQxData = () => {
    this.qxData = { ywck: true, kfda: false };
  };

  //action
  showLymxModal = async (show, rec) => {
    this.lymxShow = show;
    if (show) {
      this.queryLymxData(rec.id);
    }
  };
}

export default new LydjStore('/api/eps/control/main/dalydj', true, true);
