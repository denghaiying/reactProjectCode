import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import {Form, Input, Button, Select, TreeSelect, Col, Row} from 'antd';
import SjzdService from '@/services/base/sjzd/SjzdService';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import DwTableLayout from '@/eps/business/DwTableLayout'
import DwSelectTree from '@/eps/business/DwSelectTree'

const FormItem = Form.Item;


const Sjzd = observer((props) => {
  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


  /**
       * childStore
       */
  const sjzdStore = useLocalObservable(() => (
    {
      params: {},
      dwTreeData: [],
      dwData: [],
      page_No: 1,
      page_Size: 20,
      dwStore:[],

      async queryTreeDwList() {
        if (!this.dwData || this.dwData.length === 0) {
          const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
          if (response.status === 200) {
            var sjData = [];
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id
                newKey.value = newKey.id
                newKey.lable = newKey.mc
                newKey.title = newKey.mc
                sjData.push(newKey)
              }
              this.dwTreeData = sjData;
            }
            return;
          }
        }
      },


       async queryDwList() {

          const response = await fetch.get(`/api/eps/control/main/dw/queryForList`);
          if (response.status === 200) {
             if (response.data.length > 0) {
              this.dwStore = response.data;
            }
            return;
          }

      },
    }
  ));




  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
  }

  //自定义表单校验
  const dagConfig = {
    rules: [{ required: true, message: '请选择' }],
  };

  // 自定义表单

  const span = 24;
  const _width = 240
  const customForm = () => {

    return (
      <>

        <Row gutter={20}>
          <Col span={span}>
        <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
          <Input  style={{width:  _width}} className="ant-input"/>
        </Form.Item>
          </Col>
          <Col span={span}>
        <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input  style={{width:  _width}} className="ant-input"/>
        </Form.Item>
          </Col>
          <Col span={span}>
           <Form.Item label="单位:" name="dw" >

          <TreeSelect  className="ant-select" style={{width:  _width}}
            treeData={sjzdStore.dwTreeData}
            placeholder="选择单位"
            treeDefaultExpandAll
            allowClear
          />

        </Form.Item>
          </Col>
          <Col span={span}>
        <Form.Item label="维护人:" name="whr" >
          <Input disabled defaultValue={yhmc} style={{width:  _width}} className="ant-input" />
        </Form.Item>
          </Col>
          <Col span={span}>
        <Form.Item label="维护时间:" name="whsj" >
          <Input disabled defaultValue={getDate} style={{width:  _width}} className="ant-input" />
        </Form.Item>
          </Col>
        </Row>

      </>
    )
  }


  const [initParams, setInitParams] = useState({})
  const ref = useRef();
  useEffect(() => {
    sjzdStore.queryTreeDwList();
    sjzdStore.queryDwList();
  }, []);

  const source: EpsSource[] = [
    {
      title: '编号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '名称',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '单位',
      code: 'dw',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < sjzdStore.dwStore.length; i++) {
          var lx = sjzdStore.dwStore[i];
          if (lx.id === text) {
            return lx.mc;
          }
        }
      }
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
    name: '数据字典'
  }

  const searchFrom = () => {
    return (
      <>
        {/* <FormItem label="分类" className="form-item" name="cx_lx">
          <Select
            style={{ width: 300 }}
            placeholder="请选择分类"
            options={sjzdStore.dwTreeData}
          />
        </FormItem > */}
        <FormItem label="编号" className="form-item" name="cx_bh"><Input placeholder="请输入编号" /></FormItem >
        <FormItem label="名称" className="form-item" name="cx_mc"><Input placeholder="请输入名称" /></FormItem >
      </>
    )
  }

  const tableProp: ITable = {
    tableSearch: false,
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
    <DwTableLayout
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      tableProp={tableProp}
      ref={ref}
      treeProp={treeProp}            // 右侧表格设置属性，选填
      tableService={SjzdService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
    //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </DwTableLayout>
  );
})

export default Sjzd;
