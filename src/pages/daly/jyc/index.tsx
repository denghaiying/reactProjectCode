import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Button } from 'antd';
import JycService from '@/services/daly/jyc/JycService';
import SysStore from '@/stores/system/SysStore';

import moment from 'moment';
const FormItem = Form.Item;
/**
 * 获取当前用户
 */
const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
}

// 自定义表单


const customForm = () => {

  return (
    <>
      <Form.Item label="近义词:" name="jyc" required rules={[{ required: true, message: '请输入近义词' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="关键词:" name="gjc" required rules={[{ required: true, message: '请输入关键词' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
    </>
  )
}

function jyc() {
  const [initParams, setInitParams] = useState({})

  const ref = useRef();
  useEffect(() => {

  }, []);

  const source: EpsSource[] = [
    {
      title: '近义词',
      code: 'jyc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '关键词',
      code: 'gjc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '近义词'
  }

  // const searchFrom = () => {
  //   return (
  //     <>
  //       <FormItem label="词语" className="form-item" name="cz"><Input placeholder="请输入词语" /></FormItem >

  //     </>
  //   )
  // }


  /**
    * 查询
    * @param {*} current
    */
  const OnSearch = (values: any, store: EpsTableStore) => {
    store && store.findByKey(store.key, 1, store.size, values);
  };

  // 自定义查询按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <>
        <Form layout="inline" style={{ width: '100vw' }} onFinish={(value) => OnSearch(value, store)}>
          <Form.Item label="" className="form-item" name="cz">
            <Input placeholder="请输入词语" />
          </Form.Item>
          <Form.Item label="" className="form-item" name="name">
            <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
        </Form>
      </>
    ])
  }



  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={JycService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      //tableRowClick={(record) => console.log('abcef', record)}

      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default jyc;
