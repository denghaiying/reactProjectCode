import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useState, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Form, Input, Select } from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import SysStore from '../../../stores/system/SysStore';
import moment from 'moment';
import MbglService from './service/MbglService';

const FormItem = Form.Item;
/**
 * 数据包服务---EEP模版服务
 */
const Mbgl = observer((props) => {
  const [fromDisabled, setDisabled] = useState(false);
  const ref = useRef();
  useEffect(() => {}, []);
  /**
   * childStore
   */
  const MbglStore = useLocalObservable(() => ({
    lxData: [],
    page_No: 1,
    page_Size: 20,
    mbtype: '0',
    mbenable: '0',
    mbeepjg: '0',
    mbeepjgdata: [],
  }));
  const [mbeepjgdata, setMbeepjgdata] = useState(MbglStore.mbeepjgdata);
  // 高级搜索框
  const searchFrom = () => {
    return (
      <>
        <FormItem label="模版类型" className="form-item" name="mbtype">
          <Select style={{ width: 300 }} placeholder="请选择模版类型">
            <option value="0">标准版</option>
            <option value="1">档案库版</option>
          </Select>
        </FormItem>
        <FormItem label="模版名称" className="form-item" name="mbname">
          <Input style={{ width: 300 }} placeholder="请输入模版名称" />
        </FormItem>
      </>
    );
  };
  // 获取当前用户名称和维护时间
  const whr = SysStore.getCurrentUser().yhmc;
  const whsj = moment().format('YYYY-MM-DD HH:mm:ss');
  const qyrq = moment().format('YYYY-MM-DD');
  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    onEditClick: (form, record) => {
      setDisabled(true);
      setMbeepjgdata([
        { value: '0', label: '一文一件' },
        { value: '1', label: '案卷' },
        { value: '2', label: '党政机关一文一件' },
        { value: '3', label: '会计档案一文一件' },
        { value: '4', label: '财务档案案卷' },
        { value: '5', label: '苏州地铁案卷' },
        { value: '6', label: '中交二公局一文一件' },
        { value: '7', label: '溧水档案馆一文一件' },
        { value: '8', label: '申万宏源案卷' },
      ]);
    },
    onAddClick: (form, record) => {
      return setDisabled(false);
    },
  };

  // 表单名称
  const title: ITitle = {
    name: 'EEP模版管理',
  };

  // 定义table表格字段
  const source: EpsSource[] = [
    {
      title: '模版编码',
      code: 'mbcode',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '模版名称',
      code: 'mbname',
      align: 'center',
      width: 150,
      formType: EpsFormType.Input,
    },
    {
      title: '模版类型',
      code: 'mbtype',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === '0') {
          return '标准版(T48)';
        }
        if (text === '1') {
          return '档案库版';
        }
      },
    },
    {
      title: '模版结构',
      code: 'mbeepjg',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === '0') {
          return '一文一件';
        }
        if (text === '1') {
          return '案卷';
        }
        if (text === '2') {
          return '党政机关一文一件';
        }
        if (text === '3') {
          return '会计档案一文一件';
        }
        if (text === '4') {
          return '财务档案案卷';
        }
        if (text === '5') {
          return '苏州地铁案卷';
        }
        if (text === '6') {
          return '中交二公局一文一件';
        }
        if (text === '7') {
          return '溧水档案馆一文一件';
        }
        if (text === '8') {
          return '申万宏源案卷';
        }
        if (text === '9') {
          return '申万宏源合同类一文一件';
        }
        if (text === '10') {
          return '申万宏源流程类一文一件';
        }
      },
    },
    {
      title: '是否启用',
      code: 'mbenable',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === '0') {
          return '启用';
        }
        if (text === '1') {
          return '停用';
        }
      },
    },
    {
      title: '备注',
      code: 'mbremarks',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input,
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input,
    },
  ];
  // 自定义弹框表单
  const customForm = (text, form) => {
    // 启用停用日期判断
    const onEnableChange = (value) => {
      if (value === '1') {
        text.setFieldsValue({ mbqyrq: null });
        text.setFieldsValue({ mbtyrq: moment().format('YYYY-MM-DD') });
      } else {
        text.setFieldsValue({ mbqyrq: moment().format('YYYY-MM-DD') });
        text.setFieldsValue({ mbtyrq: null });
      }
    };
    // 模版类型与模版结构下拉框联动
    const onMbChange = (value) => {
      let data = [];
      if (value === '0') {
        data = [
          { value: '0', label: '一文一件' },
          { value: '1', label: '案卷' },
        ];
      } else {
        data = [
          { value: '2', label: '党政机关一文一件' },
          { value: '3', label: '会计档案一文一件' },
          { value: '4', label: '财务档案案卷' },
          { value: '5', label: '苏州地铁案卷' },
          { value: '6', label: '中交二公局一文一件' },
          { value: '7', label: '溧水档案馆一文一件' },
          { value: '8', label: '申万宏源案卷' },
          { value: '9', label: '申万宏源合同类一文一件' },
          { value: '10', label: '申万宏源流程类一文一件' }
        ];
      }
      setMbeepjgdata(data);
    };
    // 自定义表单
    return (
      <>
        <Form.Item
          label="模版编码:"
          name="mbcode"
          required
          rules={[{ required: true, message: '请输入模版编码' }]}
        >
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="模版名称:"
          name="mbname"
          required
          rules={[{ required: true, message: '请输入模版名称' }]}
        >
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="模版类型:"
          name="mbtype"
          required
          rules={[{ required: true, message: '请选择模版类型' }]}
        >
          <Select
            style={{ width: 300 }}
            placeholder="请选择模版类型"
            disabled={fromDisabled}
            onChange={onMbChange}
          >
            <option value="0">标准版(T48)</option>
            <option value="1">档案库版</option>
          </Select>
        </Form.Item>
        <Form.Item
          label="模版结构:"
          name="mbeepjg"
          required
          rules={[{ required: true, message: '请选择模版结构' }]}
        >
          <Select
            style={{ width: 300 }}
            placeholder="请选择模版结构"
            disabled={fromDisabled}
          >
            {mbeepjgdata.map((item) => (
              <option key={item.value}>{item.label}</option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="是否启用:"
          name="mbenable"
          initialValue={MbglStore.mbenable}
          required
          rules={[{ required: true, message: '请选择是否启用' }]}
        >
          <Select
            style={{ width: 300 }}
            className="ant-select"
            disabled={fromDisabled}
            onChange={onEnableChange}
          >
            <option value="0">启用</option>
            <option value="1">停用</option>
          </Select>
        </Form.Item>
        {/* <Form.Item label="启用日期:" name="mbqyrq">
          <Input style={{ width: 300 }} defaultValue={qyrq} disabled />
        </Form.Item>
        <Form.Item label="停用日期:" name="mbtyrq">
          <Input style={{ width: 300 }} disabled />
        </Form.Item> */}
        <Form.Item label="备注:" name="mbremarks">
          <Input.TextArea
            allowClear
            showCount
            maxLength={500}
            style={{ height: '10px', width: '300px' }}
          />
        </Form.Item>
        <Form.Item label="维护人:" name="whr">
          <Input disabled defaultValue={whr} style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj">
          <Input disabled defaultValue={whsj} style={{ width: 300 }} />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <EpsPanel
        title={title} // 组件标题，必填
        source={source} // 组件元数据，必填
        tableProp={tableProp} // 右侧表格设置属性，选填
        tableService={MbglService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={500}
        searchForm={searchFrom} // 高级搜索查询框
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      />
    </>
  );
});

export default Mbgl;
