
import { observable, action } from 'mobx';
import { Message } from '@alifd/next';
import BaseStore from '../BaseStore';
import fetch from '../../utils/fetch';


class JcjgStore extends BaseStore {
  @observable jcsqJcfw = [
    { value: 'A', label: '条目和原文' },
    { value: 'B', label: '仅条目' },
    { value: 'C', label: '仅原文' },
  ];

  // 页面检测申请的数据
  @observable jcList = [];
  // 检测结果的数据
  @observable jcsqmxList = [];
  // 点击浏览时的当前行数据
  @observable currentRow = '';
  // 控制错误原文数据的弹框
  @observable dialogErrFileVisible = false;
  // 控制错误条目数据的弹框
  @observable dialogErrDataVisible = false;
  // 动态表字段
  @observable zlxlist = [];
  // 错误数据
  @observable jcjgErrData = [];
  // 错误条目数据的内容
  @observable editRecords = {};
  // 错误原文数据的内容
  @observable editRecordss = {};
  // 默认查询检测完成的数据
  @observable searchData = { zts: ['Z'] };

  // 查询检测申请数据
  @action findAll = async (params) => {
    fetch.get('/jcsq', { params })
      .then((response) => {
        this.jcList = response.data;
      });
  }

  // 查询检测结果
  @action findJcsqmx = async (params, record) => {
    await fetch.get(`/jcsq/${encodeURIComponent(params.sqid)}/detail`)
      .then((response) => {
        this.jcsqmxList = response.data;
      });
    this.showEditForm('view', record);
  }


  // 显示错误条目数据详情弹窗
  @action showEditForms = (opt, editRecords) => {
    this.opt = opt;
    this.dialogErrDataVisible = true;
    this.editRecords = this.beforeSetEditRecord(editRecords);
  }


  // 关闭错误条目数据详情弹窗
  @action closeEditForms = () => {
    this.dialogErrDataVisible = false;
  }

  // 显示错误原文数据详情弹窗
  @action showEditFormss = (opt, editRecordss) => {
    this.opt = opt;
    this.dialogErrFileVisible = true;
    this.editRecordss = this.beforeSetEditRecord(editRecordss);
  }


  // 关闭错误原文数据详情弹窗
  @action closeEditFormss = () => {
    this.dialogErrFileVisible = false;
  }

  // 查询条目数据动态表字段
  @action findZlx = async (record) => {
    fetch.get(`/jcsq/${record.jcsqId}/fields`)
      .then(response => {
        if (response.status === 200) {
          this.zlxlist = this.afterQueryZlx(response.data);
        }
      });
  }

  // 在查询动态表字段后对特殊字段的列宽进行设置
  afterQueryZlx (data) {
    const list = [];
    data.forEach(f => {
      if (f.jcsqfieldsName === '序号') {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 100 });
      } else if (f.jcsqfieldsName === '档号') {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 300 });
      } else if (f.jcsqfieldsName === '文号') {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 250 });
      } else if (f.jcsqfieldsName === '题名') {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 800 });
      } else if (f.jcsqfieldsName === '责任者') {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 400 });
      } else if (f.jcsqfieldsName === '载体数量') {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 150 });
      } else {
        list.push({ title: f.jcsqfieldsName, dataIndex: f.jcsqfieldsName, width: 200 });
      }
    });
    list.push({ title: '错误内容', dataIndex: 'context', width: 500 });
    return list;
  }

  // 查询错误信息（包括错误条目数据和错误原文数据）
  @action findErrorResult = async (record) => {
    await fetch.get(`/jcjg/${record.jcsqmxSqid}/${record.jcsqmxId}/jcjgerr`)
      .then(response => {
        if (response.status === 200) {
          this.jcjgErrData = response.data;
        }
      });
    this.edit(record);
  }
  edit (record) {
    switch (record.jcsqmxType) {
      case '101':
      case '301':
      case '303':
        this.showEditForms('view', record);
        break;
      case '201':
      case '202':
      case '203':
      case '204':
      case '302':
        this.showEditFormss('view', record);
        break;
      default: break;
    }
  }

  // 导出pdf
  @action outToPdf = async () => {
    this.OutToPdfOne(this.selectRowRecords);
  }

  @action OutToPdfOne = async (currentRows) => {
    const pdf = '.pdf';
    fetch
      .post('/jcsq/outpdf', currentRows[0], { responseType: 'blob' })
      .then(response => {
        if (response.status === 200) {
          const data = response.data;
          if (!data) {
            Message.alert('该pdf文件不存在！');
          } else {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', currentRows[0].jcsqSqdw + pdf);
            document.body.appendChild(link);
            link.click();
            const list = currentRows.slice(1);
            if (list.length > 0) {
              this.OutToPdfOne(list);
            }
          }
        }
      });
  }
  /**
   * 详情变动行
   */
  @action ChangeRecord = async (record) => {
    this.currentRow = record;
  }
}
export default new JcjgStore('/jcjg');
