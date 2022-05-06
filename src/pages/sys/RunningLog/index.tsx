import React, { useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import RunningLogStore from '../../../stores/system/RunningLogStore';
import EpsFormType from '@/eps/commons/EpsFormType';
import logService from '@/services/system/RunningLogService';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, DatePicker, Button, message, Modal } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
import DwService from '@/services/system/DwService';
import Examine from './Examine';
const { confirm } = Modal;
const FormItem = Form.Item;
const tableProp: ITable = {
  tableSearch: false,
  disableDelete: true,
  disableEdit: true,
  disableAdd: true,
  disableCopy: true,
  searchCode: 'yhmc',
  rowSelection: { type: 'checkbox' },
};

function RunningLog() {
  // 自定义表格行按钮
  const customTableAction = (text, record, index, store, rows) => {
    return [
      <Examine
        record={record}
        store={store}
        ids={rows}
        key={'examine' + index}
      />,
    ];
  };
  const ref = useRef();
  const [examine_visible, setExamineVisible] = useState(false);
  const [cancel_examine_visible, setCancelExamineVisible] = useState(false);
  /**
   * 获取审核备注
   * @param val
   */
  const getNote = (val) => {
    RunningLogStore.note = val.target.value;
  };
  /**
   * 获取审核结果
   * @param {*} val
   */
  const getShjg = (val) => {
    RunningLogStore.shjg = val;
  };

  /**
   * 提交多选审核前的数据校验
   */
  const check_onPut_Examine = async (values, store) => {
    if (values.length >= 1) {
      var sjdata = [];
      var isTrue;
      for (var i = 0; i < values.length; i++) {
        let shjg = '';
        shjg = values[i].shjg;
        if (shjg === '通过' || shjg === '不通过') {
          message.warning('该条日志已经审核,不能再次审核！');
          isTrue = false;
          break;
        } else {
          let newKey = '';
          newKey = values[i].id;
          sjdata.push(newKey);
          isTrue = true;
        }
      }
      RunningLogStore.selectid = sjdata.toString();
      if (isTrue) {
        setExamineVisible(true);
      }
    }
  };

  /**
   * 取消多选审核前的数据校验
   */
  const check_onPut_Cancel_Examine = async (values, store) => {
    if (values.length >= 1) {
      var sjdata = [];
      var isTrue;
      for (var i = 0; i < values.length; i++) {
        let shjg = '';
        shjg = values[i].shjg;
        if (shjg === '通过' || shjg === '不通过') {
          let newKey = '';
          newKey = values[i].id;
          sjdata.push(newKey);
          isTrue = true;
        } else {
          message.warning('该条日志还未审核,不能取消审核！');
          isTrue = false;
          break;
        }
      }
      RunningLogStore.cancel_selectid = sjdata.toString();
      if (isTrue) {
        setCancelExamineVisible(true);
      }
    }
  };

  /**
   * 提交多选审核
   */
  const onPut_Examine = async (store, ids) => {
    //调用审核方法
    const response = await RunningLogStore.checkLog();
    if ((response.status = 200)) {
      message.success('操作成功');
      setExamineVisible(false);
      await store.findByKey(store.key, 1, store.size, store.params);
    } else {
      message.error('操作失败');
      setExamineVisible(false);
      await store.findByKey(store.key, 1, store.size, store.params);
    }
  };
  /**
   * 取消多选审核
   */
  const onPut_Cancel_Examine = async (store, ids) => {
    //调用取消方法
    const response = await RunningLogStore.cancel_checkLog();
    if ((response.status = 200)) {
      message.success('操作成功');
      setCancelExamineVisible(false);
      await store.findByKey(store.key, 1, store.size, store.params);
    } else {
      message.error('操作失败');
      setCancelExamineVisible(false);
      await store.findByKey(store.key, 1, store.size, store.params);
    }
  };

  // 自定义功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return [
      <>
        <Button type="primary" onClick={() => expSelectExcel(ids)}>
          导出所选
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={() => expAllExcel()}>
          导出全部
        </Button>
        &nbsp;&nbsp;
        <Button type="primary" onClick={() => check_onPut_Examine(ids, store)}>
          批量审核
        </Button>
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={() => check_onPut_Cancel_Examine(ids, store)}
        >
          批量取消
        </Button>
        <Modal
          title={<span className="m-title">审核</span>}
          visible={examine_visible}
          onOk={() => {
            onPut_Examine(store, ids), ref.current?.clearTableRowClick();
          }}
          onCancel={() => setExamineVisible(false)}
        >
          <Form labelCol={{ span: 5 }} className="schedule-form" name="shForm">
            <FormItem
              label="审核人编号:"
              name="yhid"
              initialValue={RunningLogStore.yhid}
            >
              <Input disabled style={{ width: '250px' }} />
            </FormItem>
            <FormItem
              label="审核人:"
              name="shr"
              initialValue={RunningLogStore.yhmc}
            >
              <Input disabled style={{ width: '250px' }} />
            </FormItem>
            <FormItem
              label="审核时间:"
              name="shsj"
              initialValue={RunningLogStore.getDate}
            >
              <Input disabled style={{ width: '250px' }} />
            </FormItem>
            <FormItem label="审核结果:" initialValue="通过">
              <Select
                style={{ width: 180, height: 30 }}
                id="shjg"
                defaultValue="通过"
                onSelect={(val) => getShjg(val)}
              >
                <Option value="通过">通过</Option>
                <Option value="不通过">不通过</Option>
              </Select>
            </FormItem>
            <FormItem label="审核备注:" name="note">
              <Input.TextArea
                name="note"
                onChange={(val) => getNote(val)}
                style={{ width: '250px' }}
              />
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title={<span className="m-title">取消审核</span>}
          visible={cancel_examine_visible}
          onOk={() => {
            onPut_Cancel_Examine(store, ids), ref.current?.clearTableRowClick();
          }}
          onCancel={() => setCancelExamineVisible(false)}
        >
          <Form labelCol={{ span: 5 }} className="schedule-form" name="shForm">
            <FormItem
              label="审核人编号:"
              name="yhid"
              initialValue={RunningLogStore.yhid}
            >
              <Input disabled style={{ width: '250px' }} />
            </FormItem>
            <FormItem
              label="审核人:"
              name="shr"
              initialValue={RunningLogStore.yhmc}
            >
              <Input disabled style={{ width: '250px' }} />
            </FormItem>
            <FormItem
              label="审核时间:"
              name="shsj"
              initialValue={RunningLogStore.getDate}
            >
              <Input disabled style={{ width: '250px' }} />
            </FormItem>
            <FormItem label="审核结果:" name="shjg" initialValue="取消审核">
              <Select
                style={{ width: 180, height: 30 }}
                id="shjg"
                defaultValue="取消审核"
                onChange={(val) => getShjg(val)}
              >
                <Select.Option value="取消审核">取消审核</Select.Option>
              </Select>
            </FormItem>
            <FormItem label="审核备注:" name="note">
              <Input.TextArea
                name="note"
                onChange={(value) => getNote(value)}
                style={{ width: '250px' }}
              />
            </FormItem>
          </Form>
        </Modal>
      </>,
    ];
  };
  //导出所有
  const handexpAllExcel = () => {
    var dcrz = {};
    dcrz['title'] = '运行日志';
    dcrz['heads'] =
      '模块,功能号,功能名称,用户号,用户姓名,日志,IP地址,详情,时间';
    var urlstr =
      '/api/eps/control/main/syslog/dcExcelAll?title=' +
      dcrz.title +
      '&heads=' +
      dcrz.heads;
    window.location.href = urlstr;
    message.success('导出成功');
  };
  //删除和保存提示弹框的取消按钮、新增和编辑到列表页的取消按钮
  const handleCancel = () => {
    console.log('Clicked cancel button');
  };
  const expAllExcel = async () => {
    confirm({
      title: '是否导出全部日志信息?',
      icon: <ExclamationCircleOutlined />,
      content: '导出全部可能会照成系统卡顿',
      okText: '导出',
      okType: 'danger',
      cancelText: '取消',
      onOk: handexpAllExcel,
      onCancel: handleCancel,
    });
    var dcrz = {};
    dcrz['title'] = '运行日志';
    dcrz['heads'] =
      '模块,功能号,功能名称,用户号,用户姓名,日志,IP地址,详情,时间';
  };
  //导出所选
  const expSelectExcel = async (val) => {
    if (val.length <= 0) {
      message.error('操作失败,请至少选择一行数据');
    } else {
      // var ids = [];
      var ids = '';
      for (var i = 0; i < val.length; i++) {
        let id = '';
        id = val[i].id;
        // ids.push(id);
        ids += ',' + id;
      }
      var dcrz = {};
      dcrz['title'] = '运行日志';
      dcrz['heads'] =
        '模块,功能号,功能名称,用户号,用户姓名,日志,IP地址,详情,时间';
      // var formData = new FormData();
      // formData.append('title', dcrz.title);
      // formData.append('heads', dcrz.heads);
      // formData.append('ids', ids.toString());
      var urlstr =
        '/api/eps/control/main/syslog/dcExcel?title=' +
        dcrz.title +
        '&heads=' +
        dcrz.heads +
        '&ids=' +
        ids;
      window.location.href = urlstr;
      message.success('导出成功');
    }
  };

  const source: EpsSource[] = [
    {
      title: '时间',
      code: 'rq',
      align: 'center',
      width: 130,
      formType: EpsFormType.Input,
    },
    {
      title: '模块',
      code: 'mkbh',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '功能编号',
      align: 'center',
      code: 'gnid',
      width: 110,
      formType: EpsFormType.Select,
    },
    {
      title: '功能名称',
      align: 'center',
      code: 'gnmc',
      width: 80,
      formType: EpsFormType.None,
      // render: (text, record, index) => {
      //     return text == 'N' ? '否' : '是';
      // }
    },
    {
      title: '登陆账号',
      code: 'yhbh',
      align: 'center',
      width: 60,
      formType: EpsFormType.None,
      // render: (text, record, index) => {
      //     return text == 'N' ? '否' : '是';
      // }
    },
    {
      title: '操作人',
      code: 'yhmc',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },

    {
      title: '日志',
      code: 'op',
      align: 'center',
      width: 120,
      formType: EpsFormType.None,
    },
    {
      title: 'IP地址',
      code: 'ip',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '详情',
      code: 'fullinfo',
      align: 'left',
      width: 320,
      formType: EpsFormType.None,
    },
    {
      title: '审核',
      code: 'shjg',
      align: 'center',
      width: 100,
      formType: EpsFormType.None,
    },
  ];

  const title = {
    name: '运行日志',
  };

  const searchFrom = () => {
    return (
      <>
        <FormItem label="操作人编号" className="form-item" name="yhbh">
          <Input placeholder="请输入编号" style={{ width: 200 }} />
        </FormItem>
        <FormItem label="ip地址" className="form-item" name="ip">
          <Input placeholder="请输入IP" style={{ width: 200 }} />
        </FormItem>
        <FormItem label="请选择操作" className="form-item" name="op">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择操作"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="功能操作">功能操作</Option>
            <Option value="登录系统">登录系统</Option>
            <Option value="登出系统">登出系统</Option>
            <Option value="打开功能">打开功能</Option>
            <Option value="用户管理">用户管理</Option>
            <Option value="角色管理">角色管理</Option>
            <Option value="关闭功能">关闭功能</Option>
            <Option value="增加文档">增加文档</Option>
            <Option value="删除文档">删除文档</Option>
            <Option value="下载文档">下载文档</Option>
            <Option value="打开档案库">打开档案库</Option>
            <Option value="退出档案库">退出档案库</Option>
            <Option value="查看原文文档">查看原文文档</Option>
            <Option value="水印查看">水印查看</Option>
            <Option value="档案条目编辑">档案条目编辑</Option>
            <Option value="eps检索">eps检索</Option>
            <Option value="跨库检索">跨库检索</Option>
          </Select>
        </FormItem>
        <FormItem label="日期范围" className="form-item" name="rq">
          <RangePicker />
        </FormItem>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        //treeSearch={true}
        title={title}
        source={source}
        ref={ref}
        treeService={DwService}
        tableProp={tableProp}
        tableService={logService}
        searchForm={searchFrom}
        customAction={customAction}
        customTableAction={customTableAction}
      ></EpsPanel>
    </>
  );
}

export default RunningLog;
