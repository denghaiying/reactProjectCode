import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import cqbcwjzhService from './service/CqbcwjzhService';
import { Form, Input, message, Select, FormInstance, Radio } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import {
  InteractionTwoTone,
  ContactsTwoTone,
  ControlTwoTone,
  GoldTwoTone,
} from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from '../../../utils/fetch';
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const zhhlx = [
  { value: 'pdf', label: 'pdf' },
  { value: 'ofd', label: 'ofd' },
  { value: 'mp4', label: 'mp4' },
  { value: 'flv', label: 'flv' },
  { value: 'avi', label: 'avi' },
  { value: 'mpg', label: 'mpg' },
  { value: 'wmv', label: 'wmv' },
  { value: '3gp', label: '3gp' },
  { value: 'rm', label: 'rm' },
];
const Cqbcwjzh = observer((props) => {
  const tableProp: ITable = {
    disableCopy: true,
    searchCode: 'name',
    onEditClick: (form, record) => {
      if (record.state === 'Y') {
        record.state = 'true';
      } else {
        record.state = 'false';
      }
      form.setFieldsValue(record);
    },
  };

  const ref = useRef();

  const _width = 380;

  const [cqwjlist, setCqwjlist] = useState<
    Array<{ id: string; label: string; value: string }>
  >([]);

  const customForm = (form: FormInstance) => {
    return (
      <>
        <Form.Item
          label="标题:"
          name="name"
          required
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input allowClear style={{ width: _width }} />
        </Form.Item>
        <Form.Item
          label="待转换类型:"
          name="dzhlx"
          required
          rules={[{ required: true, message: '请输入待转换' }]}
        >
          <Select
            placeholder="待转换类型"
            options={cqwjlist}
            style={{ width: _width }}
          />
        </Form.Item>
        <Form.Item
          label="转换后类型:"
          name="zhhlx"
          required
          rules={[{ required: true, message: '请输入转换后' }]}
        >
          <Select
            placeholder="转换后类型"
            options={zhhlx}
            style={{ width: _width }}
          />
        </Form.Item>
        <Form.Item name="state" label="状态:" initialValue="true">
          <Radio.Group>
            <Radio.Button value="true">开启</Radio.Button>
            <Radio.Button value="false">关闭</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注:" name="bz">
          <Input allowClear style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
          <Input disabled style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
          <Input disabled style={{ width: _width }} />
        </Form.Item>

        {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
      </>
    );
  };
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return [<></>];
  };

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return <></>;
  };
  useEffect(() => {
    const queryCqwjList = async () => {
      let url = '/api/eps/control/main/cqbcwjzc/queryForList';
      const response = await fetch.get(url);
      if (response.status === 200) {
        if (response.data.length > 0) {
          let SxData = response.data.map((o) => ({
            id: o.id,
            label: o.ext,
            value: o.ext,
          }));
          setCqwjlist(SxData);
        } else {
          setCqwjlist(response.data);
        }
      }
    };
    queryCqwjList();
    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [
    {
      title: '标题',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '待转换类型',
      code: 'dzhlx',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    {
      title: '转换后类型',
      code: 'zhhlx',
      align: 'center',
      formType: EpsFormType.Input,
      width: 200,
    },
    ,
    {
      title: '备注',
      code: 'bz',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '状态',
      code: 'state',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text === 'Y') {
          return '开启';
        } else {
          return '关闭';
        }
      },
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input,
      width: 300,
    },
  ];
  const title: ITitle = {
    name: '转换配置',
  };

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="标题" className="form-item" name="name">
          <Input placeholder="请输入标题" style={{ width: 300 }} />
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
        tableService={cqbcwjzhService} // 右侧表格实现类，必填
        ref={ref} // 获取组件实例，选填
        formWidth={600}
        searchForm={searchFrom}
        customForm={customForm} // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction} // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction} // 自定义全局按钮（如新增、导入、全局打印等），选填
      ></EpsPanel>
    </>
  );
});

export default Cqbcwjzh;
