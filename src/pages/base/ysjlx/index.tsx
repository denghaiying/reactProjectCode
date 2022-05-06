import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Button, Select, TreeSelect } from 'antd';
import YsjlxService from '@/services/base/ysjlx/YsjlxService';
import SysStore from '@/stores/system/SysStore';

import moment from 'moment';
import Search from 'antd/es/input/Search';
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

      <Form.Item label="类型编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="类型名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" >
        <Input disabled defaultValue={yhmc} style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" >
        <Input disabled defaultValue={getDate} style={{ width: 300 }} />
      </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}

function ysjlx() {
  const [initParams, setInitParams] = useState({})

  const ref = useRef();
  useEffect(() => {

  }, []);

  const source: EpsSource[] = [
    {
      title: '类型编号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '类型名称',
      code: 'mc',
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
    name: '元数据类型'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="编号" className="form-item" name="cx_bh"><Input placeholder="请输入编号" /></FormItem >
        <FormItem label="名称" className="form-item" name="cx_mc"><Input placeholder="请输入名称" /></FormItem >
      </>
    )
  }


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
        {/* <Form layout="inline" style={{ width: '100vw' }} onFinish={(value) => OnSearch(value, store)}>
         <Form.Item label="" className="form-item" name="dwid">
                      <TreeSelect style={{ width: 250 }}
                          treeData={systemConfStore.dwTreeData}
                          placeholder="选择单位"
                          treeDefaultExpandAll
                          allowClear
                      />
                  </Form.Item>
          <Form.Item label="" className="form-item" name="cx_bh">

          </Form.Item >
          <Form.Item label="" className="form-item" name="cx_mc">
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="" className="form-item" name="name">
            <Button type="primary" htmlType="submit">查询</Button>
          </Form.Item>
        </Form> */}
      </>
    ])
  }



  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={YsjlxService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
    //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default ysjlx;
