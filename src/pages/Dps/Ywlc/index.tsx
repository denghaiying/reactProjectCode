import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import React, { useEffect, useRef } from 'react';
import { observer, } from 'mobx-react';
import { Form, Input} from 'antd';
import type { EpsSource, ITable, ITitle } from '@/eps/commons/declare';
import YwlcService from './service/YwlcService';
import moment from 'moment';

/**
 * 工作内容
 */
const Ywlc = observer((props) => {
  useEffect(() => {
  }, []);

  // 按钮和查询框区域(新增、编辑、删除按钮)
  const tableProp: ITable = {
    tableSearch: true,
    disableCopy: true,
    disableDelete: true,
    disableEdit: true,
    disableAdd: true,
    searchCode: 'name',
    }

  // 表单名称
  const title: ITitle = {
    name: '加工内容'
  }

  // 定义table表格字段
  const source: EpsSource[] = [
    // {
    //   title: '编号',
    //   code: 'code',
    //   align: 'center',
    //   formType: EpsFormType.Input
    // },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '备注',
      code: 'remark',
      align: 'center',
      formType: EpsFormType.Input
    },
  ]

  // 自定义弹框表单
  const customForm = (text, form) => {
    // 自定义表单
    return (
      <>
        <Form.Item hidden label="编号:" name="code" initialValue={`${moment().format('YYYYMMDDHHmmssSSS')}`} required  rules={[{ required: true, message: '请输入编号' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="名称:" name="name" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="备注:" name="remark" >
          <Input.TextArea allowClear showCount maxLength={500} style={{ height: '10px', width: '300px' }} />
        </Form.Item>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={YwlcService}           // 右侧表格实现类，必填
        formWidth={500}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      >
      </EpsPanel>
    </>
  );
})

export default Ywlc;
