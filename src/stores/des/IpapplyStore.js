import { action, observable, runInAction, makeObservable } from 'mobx';
import BaseWfStore from '../workflow/BaseWfStore';
import fetch from '@/utils/fetch';
import BaseStore from '../BaseStore';
import { message } from 'antd';
import moment from 'moment';
import { Table } from '@alifd/next';
import { values } from '@umijs/deps/compiled/lodash';
import SysStore from '@/stores/system/SysStore';

class IpapplyStore extends BaseWfStore {
  typelist = {
    101: '条目著录项',
    201: '原文类型',
    202: '原文DPI',
    203: '原文内容',
    204: '原文EXIF',
    205: '原文数量',
    301: '条目原文匹配',
    302: '原文条目匹配',
    303: '条目原文内容匹配',
    304: '条目原文数量匹配',
  };
  /**
   * 描述data
   */
  exprData = [];
  defaultexpr = '';
  zhuluData = [];
  filedsData = [];
  resultrecord = false;
  fieldcolumns = [];
  iptcfgData = [];
  yuanweniptcfgData = [];
  sqdw = '';
  sqsm = '';
  ywdir = '';
  sqrq = '';
  jcfw = '';
  id = '';
  type = '';
  sqr = '';
  jcdw = '';
  jcr = '';
  jcrq = '';
  sjly = 'w';
  dakid = '';
  tmzt = undefined;
  list = [];
  dakData = [];
  templloading = false;
  openRowKeys = [];
  importVisible = false;
  templdata = [];
  filterdak = [];
  // 主表档案库信息
  ktable = {};
  // 动态字段信息
  kfileds = [];
  telesql = '';
  ljjc = false; //立即检测

  templjcszcolumns = [
    {
      title: '检测类型',
      dataIndex: 'type',
      width: 200,
      cell: (value) => {
        switch (value) {
          case '101':
            return <span>条目著录项</span>;
          case '201':
            return <span>原文类型</span>;
          case '202':
            return <span>原文DPI</span>;
          case '203':
            return <span>原文内容</span>;
          case '204':
            return <span>原文EXIF</span>;
          case '301':
            return <span>条目原文匹配</span>;
          case '302':
            return <span>原文条目匹配</span>;
          case '303':
            return <span>条目原文内容匹配</span>;
          default:
            return null;
        }
      },
    },
    {
      title: '检测对象',
      dataIndex: 'zlx',
      width: 100,
    },
    {
      title: '检测名称',
      dataIndex: 'iptcfgName',
      width: 200,
    },
  ];

  templcolumn = [
    {
      title: '模版名称',
      dataIndex: 'name',
      width: 500,
    },
  ];

  constructor(url, wfenable, oldver = true) {
    super(url, wfenable, oldver);
    makeObservable(this, {
      list: observable,
      openRowKeys: observable,
      templdata: observable,
      sqdw: observable,

      resetEditRecord: action,
      queryForList: action,
      deleteTemplData: action,
      queryModule: action,
    });
  }

  resetEditRecord = (value) => {
    this.editRecord = value;
  };

  typelistArray = () => {
    const re = [];
    Object.keys(this.typelist).forEach((k) => {
      re.push({ key: k, title: this.typelist[k] });
    });
    return re;
  };

  queryForList = async () => {
    const response = await fetch.get(this.url + '/queryForList', {});
    runInAction(() => {
      if (response && response.status === 200) {
        this.list = response.data;
      }
    });
  };

  setfieldcolumns = (columns) => {
    this.fieldcolumns = columns;
  };

  queryExprData = async () => {
    const response = await fetch.get('/api/eps/des/jcsqexpr/list/');
    runInAction(() => {
      if (response && response.status === 200) {
        const list = [];
        response.data.forEach((element) => {
          list.push({ label: element.expr, value: element.id });
          this.defaultexpr = element.id;
        });
        this.exprData = list;
      }
    });
  };

  queryFields = async (sqid) => {
    const params = { sqid: sqid || this.editRecord.id };
    const response = await fetch.get(`/eps/des/jcsqfields`, { params: params });
    if (response && response.status === 200) {
      runInAction(() => {
        this.zhuluData = this.afterQueryData(response.data);
        this.filedsData = this.renderFields(response.data);
      });
    }
  };

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
          tabledata.name1 = data[i].name;
        } else {
          tabledata.name1 = '';
        }
        if (i + 1 < data.length) {
          tabledata.name2 = data[i + 1].name;
        } else {
          tabledata.name2 = '';
        }
        if (i + 2 < data.length) {
          tabledata.name3 = data[i + 2].name;
        } else {
          tabledata.name3 = '';
        }
        if (i + 3 < data.length) {
          tabledata.name4 = data[i + 3].name;
        } else {
          tabledata.name4 = '';
        }
        if (i + 4 < data.length) {
          tabledata.name5 = data[i + 4].name;
        } else {
          tabledata.name5 = '';
        }
        newData.push(tabledata);
      }
    }
    return newData;
  };

  /**
   * 上传条目文件
   * @param file
   * @returns {Promise<void>}
   */
  excelUploadFile = async (file, num) => {
    const response = await this.uploadFile(
      file,
      { num: num },
      `/upload/${this.editRecord.id}`,
    );
    return response;

  };

  /**
   * 查询著录项设置下拉框值
   * @param params
   * @returns {Promise<void>}
   */
  findIptcfg = (params) => {
    this.queryIptcfg(params).then((response) => {
      if (response && response.status == 200) {
        this.iptcfgData = this.renderIptcfg(response.data);
      }
    });
  };
  /**
   * 查询著录项设置下拉框值
   * @param params
   * @returns {Promise<void>}
   */
  findYuanwenIptcfg = (params) => {
    this.queryIptcfg(params).then((response) => {
      if (response && response.status == 200) {
        this.yuanweniptcfgData = response.data;
      }
    });
  };
  queryIptcfg = (values) => {
    const params = { params: JSON.stringify(values) };
    return fetch.get('/api/eps/des/iptcfg/list/', { params });
  };
  /**
   * 封装著录项设置下拉框数据
   * @param data
   * @returns {[]}
   */
  renderIptcfg = (data) => {
    const dataSource = [];
    if (data.length >= 1) {
      data.forEach((item) => {
        dataSource.push({ value: item.id, label: item.name });
      });
    }
    return dataSource;
  };
  /**
   * 保存著录项
   * @param {*} values
   */
  saveZhulu = async (values) => {
    return await fetch.patch(
      `${this.url}/${this.editRecord.id}/detail/importfields`,
      values,
    );
  };

  saveYuanwen = async (selectRowKeys) => {
    return await fetch.patch(
      `${this.url}/${this.editRecord.id}/detail/importfiles`,
      selectRowKeys,
    );
  };
  //保存申请数据
  saveIpapplyData = async (values) => {
    values.ljjc = values.ljjc ? 'Y' : 'N';
    values.sjly === 'w' ? (values.dakid = '') : (values.ywdir = '');
    values.sqrq = moment(values.sqrq).format('yyyy-MM-DD');
    values.jcrq = moment(values.jcrq).format('yyyy-MM-DD');
    return await fetch.post(`${this.url}/`, values);
  };
  startInspect = async (id) => {
    fetch.get(`${this.url}/start/${id}`);
  };
  // updateIpapplyData = async (values) => {
  //   return await fetch.post(`${this.url}/${values.id}`,values);
  // };

  /**
   * 保存成模板
   */
  saveasModule = async (name, sqid) => {
    const params = { name: name };
    const response = await fetch.post(
      `${this.url}/saveastempl/${encodeURIComponent(sqid)}`,
      params,
    );
    if (response&&response.status === 200) {
      return true;
    }else{
      return false;
    }
  };

  /**
   * 查询模板
   */
  queryModule = async () => {
    const response = await fetch.get('/eps/des/templ/list/');
    if (response.status === 200) {
      // const list = [];
      runInAction(() => {
        // response.data.forEach(f => {
        //   list.push({ id: f.id, templName: f.templName,templSqid:f.templSqid, label: f.templName, value: f.templSqid, });
        // });
        this.templdata = response.data;
      });
    }
  };
  //	额外渲染行的渲染函数
  expandedRowRender = (record, index) => {
    const children = record.children;
    return (
      <div style={{ marginTop: 5 }}>
        <Table dataSource={children} fixedHeader maxBodyHeight={200} isZebra>
          {this.templjcszcolumns.map((col) => (
            <Table.Column align="center" key={col.dataIndex} {...col} />
          ))}
        </Table>
      </div>
    );
  };

  /**
   * 模版表格操作列
   * @param value
   * @param index
   * @param record
   * @returns {*}
   */
  renderTemplTableCell = (value, index, record) => {
    return (
      <div>
        <a
          href="javascript:;"
          onClick={() => onTemplImportAction(record.templSqid)}
        >
          导入
        </a>
        <a
          href="javascript:;"
          style={{ marginLeft: 5 }}
          onClick={() => onTemplDeleteAction(record.id)}
        >
          <FormattedMessage id="e9.btn.delete" />
        </a>
      </div>
    );
  };

  /**
   * 查询检测设置信息
   * @returns {Promise<void>}
   */
  queryModuleDetail = async (jcsqId) => {
    const response = await fetch.get(`/api/eps/des/jcsq/${jcsqId}/detail`);
    if (response && response.status === 200) {
      this.jcmxdata = response.data;
    }
  };

  /**
   * 批量插入检测明细数据
   * @param {*} values
   * @returns
   */
  insertJcsqMx = async (values) => {
    const response = await fetch.post(
      `/api/eps/des/jcsqmx/batch/${this.record.id}`,
      values,
    );
    return response;
  };

  /**
   * 查询检测设置信息
   * @returns {Promise<void>}
   */
  queryDetail = async () => {
    const response = await fetch.get(
      `/api/eps/des/jcsq/${this.record.id}/detail`,
    );
    if (response && response.status === 200) {
      // runInAction('查询检测设置信息', () => {
      this.twoStepData = this.afterQueryData(response.data);
      // });
    }
  };

  // /**
  //  * 关闭导入检测设置弹框
  //  * @returns {Promise<void>}
  //  */
  //  closeImportForm = async () => {
  //   this.importVisible = false;
  // };

  /**
   * 打开检测设置弹框
   * @param record
   * @returns {Promise<void>}
   */
  openImportSetting = async (record) => {
    // this.sqdw = record.sqdw;
    // this.sqsm = record.sqsm;
    // this.ywdir= record.ywdir;

    this.opt = 'edit';
    this.record = record;
    await this.queryFields();
    this.selectRowKeys = [];
    this.selectRowRecords = [];
  };

  /**
   * 删除模版数据
   * @param id
   * @returns {Promise<void>}
   */
  deleteTemplData = async (id) => {
    const response = await fetch.delete(`/api/eps/des/templ/${id}`);
    if (response.status === 204) {
      this.queryModule();
    }
  };
  //只查询一文一件的档案库
  findDak = async () => {
    return await fetch.get(
      '/api/eps/control/main/dak/queryTreeNew?dw=' +
        SysStore.getCurrentUser().dwid +
        '&isby=N&noshowdw=Y&node=root&daklx=01',
    );
  };
  updateData = (data) => {
    data.forEach((item) => {
      item.value = item.id;
      if (item.children.length > 0) {
        this.updateData(item.children);
      }
    });
  };
  //查询所有档案库
  findAllDak = async () => {
    const response = await fetch.get('/api/eps/control/main/dak/queryForList');
    if (response.status === 200) {
      this.dakData = response.data;
    }
  };
  //将档案库中的条目著录项添加到jcsqfileds中
  daktmzlx = async (value) => {
    value['sqid'] = this.editRecord.id;
    return await fetch.post('/api/eps/des/jcsqfields/addtmzlx', value);
  };
  //根据档案库查询条目著录项
  findmbzlxbydakid = async (value) => {
    const response = await fetch.get(
      `/api/eps/des/jcsq/findmbzlxbydakid/${value}`,
    );

    runInAction(() => {
      if (response && response.status === 200) {
        this.kfileds = response.data;
      }
    });
    return response;
  };
  //根据档案库id查询档案库信息
  findDakmxByid = async (value) => {
    const response = await fetch.get(
      `/api/eps/control/main/dak/queryForKey?id=${value}`,
    );
    runInAction(() => {
      if (response && response.status === 200) {
        this.ktable = response.data;
      }
    });
  };
}

export default new IpapplyStore('/api/eps/des/jcsq', false, false);
