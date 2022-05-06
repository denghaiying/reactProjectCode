import { action, observable, runInAction } from 'mobx';
import fetch from '../../utils/fetch';
import BaseStore from '../BaseStore';

class JcsqStore extends BaseStore {
  @observable range = '';
  @observable step = 1;
  @observable record = {};
  @observable twoStepData = [];
  @observable yuanwenVisible = false;
  @observable yuanwenData = [];
  @observable zhuluVisible = false;
  @observable importVisible = false;
  @observable fieldsData = [];
  @observable zhuluData = [];
  @observable filedsData = [];
  @observable resultrecord = false;
  @observable iptcfgData = [];
  @observable auditState = false;
  @observable exprData = [];
  @observable updatePosition = true;

  @action findAll = async (params) => {
    fetch.get(this.url, { params })
      .then((response) => {
        this.data = response.data;
      });
  };

  @action saveOneStepData = async (values) => {
    let response;
    if (this.opt === 'edit') {
      response = await fetch
        .put(`${this.url}/${encodeURIComponent(this.editRecord.id)}`, values);
    } else {
      response = await fetch.post(this.url, values);
    }
    if (response && response.status === 201) {
      this.onestepDate = response.data;
    }
  };

  /**
   * 查询检测设置信息
   * @returns {Promise<void>}
   */
  @action queryDetail = async () => {
    const response = await fetch
      .get(`${this.url}/${this.record.jcsqId}/detail`);
    if (response && response.status === 200) {
      runInAction(() => {
        this.twoStepData = this.afterQueryData(response.data);
      });
    }
  };

  /**
   * 查询匹配规则
   * @returns {Promise<void>}
   */
  @action queryExpr = async () => {
    fetch.get('/jcsqexpr').then((response) => {
      this.exprData = this.renderExpr(response.data);
    });
  };

  /**
   * 查询原文设置信息
   * @param params
   * @returns {Promise<void>}
   */
  @action queryIptcfg = async (params) => {
    fetch.get('/iptcfg', { params })
      .then((response) => {
        this.yuanwenData = response.data;
      });
  };

  /**
   * 查询著录项设置下拉框值
   * @param params
   * @returns {Promise<void>}
   */
  @action findIptcfg = async (params) => {
    fetch.get('/iptcfg', { params })
      .then((response) => {
        this.iptcfgData = this.renderIptcfg(response.data);
      });
  };

  /**
   * 查询著录项设置信息
   * @returns {Promise<void>}
   */
  @action queryFields = async () => {
    const response = await fetch
      .get(`${this.url}/${this.record.jcsqId}/fields`);
    if (response && response.status === 200) {
      runInAction(() => {
        this.zhuluData = this.afterQueryData(response.data);
        this.fieldsData = this.renderFields(response.data);
      });
    }
  };

  /**
   * 更改检测范围
   * @param value
   * @returns {Promise<void>}
   */
  @action changeRange = async (value) => {
    this.range = value;
  };

  /**
   * 设置表单步骤
   * @param value
   * @returns {Promise<void>}
   */
  @action setStep = async (value) => {
    this.step = value;
  };

  /**
   * 清除步骤值
   * @returns {Promise<void>}
   */
  @action cleanStep = async () => {
    this.step = 0;
  };

  /**
   * 初始化监测范围,表单步骤值
   * @param record
   * @returns {Promise<void>}
   */
  @action renderRange = async (record) => {
    this.range = record.jcsqJcfw;
    this.step = 1;
  };

  /**
   * 删除检测设置
   * @param id
   * @returns {Promise<void>}
   */
  @action removeTableData = async (id) => {
    fetch.delete(`/jcsqmx/${id}`).then(() => {
      this.queryDetail();
    });
  };

  /**
   * 关闭原文设置弹框
   * @returns {Promise<void>}
   */
  @action closeYForm = async () => {
    this.yuanwenVisible = false;
  };

  /**
   * 关闭原文设置弹框
   * @returns {Promise<void>}
   */
  @action closeZForm = async () => {
    this.zhuluVisible = false;
  };

  /**
   * 关闭导入检测设置弹框
   * @returns {Promise<void>}
   */
  @action closeImportForm = async () => {
    this.importVisible = false;
  };

  /**
   * 打开检测设置弹框
   * @param record
   * @returns {Promise<void>}
   */
  @action openImportSetting = async (record) => {
    this.opt = 'edit';
    this.record = record;
    await this.queryFields();
    this.importVisible = true;
    this.selectRowKeys = [];
    this.selectRowRecords = [];
  };

  /**
   * 打开原文设置弹框
   * @param params
   * @returns {Promise<void>}
   */
  @action openYuanwen = async (params) => {
    await this.queryIptcfg(params);
    this.yuanwenVisible = true;
  };

  /**
   * 打开著录项设置弹框
   * @param params
   * @returns {Promise<void>}
   */
  @action openZhulu = async (params) => {
    await this.findIptcfg(params);
    this.zhuluVisible = true;
  };

  /**
   * 保存原文设置信息
   * @returns {Promise<void>}
   */
  @action saveYuanwen = async () => {
    fetch.patch(`${this.url}/${this.record.jcsqId}/detail/importfiles`, this.selectRowKeys).then(() => {
      this.queryDetail();
    });
    this.yuanwenVisible = false;
  };

  /**
   * 审核
   * @returns {Promise<void>}
   */
  @action audit = async () => {
    this.auditState = false;
    const res = await fetch.patch(`${this.url}/${this.selectRowRecords[0].jcsqId}`, { jcsqSpzt: 'C' });
    if (res.status === 201) {
      this.auditState = true;
      this.selectRowKeys = [];
      this.selectRowRecords = [];
      this.setParams({ zts: ['I'] });
    }
  };

  /**
   * 保存著录项设置信息
   * @param values
   * @returns {Promise<void>}
   */
  @action saveZhulu = async (values) => {
    fetch.patch(`${this.url}/${this.record.jcsqId}/detail/importfields`, values).then(() => {
      this.queryDetail();
    });
    this.zhuluVisible = false;
  };

  /**
   * 上传条目模板
   * @param file
   * @returns {Promise<void>}
   * @constructor
   */
  @action UploadExcel = async (file) => {
    const request = await this.uploadFiles(file, false, `/upload/templ/${this.record.jcsqId}`, 'templfile');
    if (request.status === 200) {
      runInAction(() => {
        this.resultrecord = true;
      });
      await this.queryFields();
    }
  };

  /**
   * 上传条目文件
   * @param file
   * @returns {Promise<void>}
   * @constructor
   */
  @action UploadFile = async (file) => {
    const request = await this.uploadFiles(file, false, `/upload/${this.record.jcsqId}`, 'datafile');
    if (request.status === 200) {
      runInAction(() => {
        this.resultrecord = true;
      });
      await this.queryFields();
    }
  };

  /**
   * 上传文件
   * @param file
   * @param params
   * @param uploadUrl
   * @param name
   * @param option
   * @returns {AxiosPromise<any>}
   */
  uploadFiles (file, params, uploadUrl = '/upload', name, option) {
    const param = new FormData();
    param.append(name, file);
    if (params) {
      Object.keys(params).forEach(k => {
        param.append(k, params[k]);
      });
    }
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    if (option && option.onProgress) {
      config.onUploadProgress = ((e) => { option.onProgress(e); });
    }
    return fetch.post(`${this.url}${uploadUrl}`, param, config);
  }

  /**
   * 封装著录项表格数据
   * @param data
   * @returns {[]}
   */
  renderFields = (data) => {
    const newData = [];
    if (data.length >= 1) {
      for (let i = 0; i < data.length; i += 5) {
        const tabledata = {};
        if (i < data.length) {
          tabledata.name1 = data[i].jcsqfieldsName;
        } else {
          tabledata.name1 = '';
        }
        if (i + 1 < data.length) {
          tabledata.name2 = data[i + 1].jcsqfieldsName;
        } else {
          tabledata.name2 = '';
        }
        if (i + 2 < data.length) {
          tabledata.name3 = data[i + 2].jcsqfieldsName;
        } else {
          tabledata.name3 = '';
        }
        if (i + 3 < data.length) {
          tabledata.name4 = data[i + 3].jcsqfieldsName;
        } else {
          tabledata.name4 = '';
        }
        if (i + 4 < data.length) {
          tabledata.name5 = data[i + 4].jcsqfieldsName;
        } else {
          tabledata.name5 = '';
        }
        newData.push(tabledata);
      }
    }
    return newData;
  };

  /**
   * 封装著录项设置下拉框数据
   * @param data
   * @returns {[]}
   */
  renderIptcfg = (data) => {
    const dataSource = [];
    if (data.length >= 1) {
      data.forEach(item => {
        dataSource.push({ value: item.iptcfgId, label: item.iptcfgName });
      });
    }
    return dataSource;
  };

  /**
   * 封装匹配规则下拉框数据
   * @param data
   * @returns {[]}
   */
  renderExpr = (data) => {
    const dataSource = [];
    if (data.length >= 1) {
      data.forEach(item => {
        dataSource.push({ value: item.jcsqexprCode, label: `${item.jcsqexprCode}|${item.jcsqexprExpr}` });
      });
    }
    return dataSource;
  };
}
export default new JcsqStore('/jcsq');
