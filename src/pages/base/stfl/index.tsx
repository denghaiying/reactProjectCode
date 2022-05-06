import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import {EpsSource, ITable, ITree} from '@/eps/commons/declare';
import {Form, Input, Button, Select, TreeSelect, Col, Row} from 'antd';
import StflService from '@/services/base/stfl/StflService';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import DwTableLayout from '@/eps/business/DwTableLayout'
const FormItem = Form.Item;


const Stfl = observer((props) => {
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
  const stflStore = useLocalObservable(() => (
      {
        params: {},
        dwTreeData: [],
        dwData: [],
        async queryTreeDwList() {
          // if (!this.dwData || this.dwData.length === 0) {
          const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid_ReactTree`);
          if (response.status === 200) {
            var sjData = [];
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id
                newKey.value = newKey.id
                newKey.title = newKey.mc
                sjData.push(newKey)
              }
              console.log("sjData",sjData);
              this.dwTreeData = sjData;
            }
            return;
          }
          // }
        },

        async queryDwList() {
          // if (!this.dwData || this.dwData.length === 0) {
          const response = await fetch.get(`/api/eps/control/main/dw/queryForListByYhid`);
          if (response.status === 200) {
            var sjData = [];
            if (response.data.length > 0) {
              for (var i = 0; i < response.data.length; i++) {
                let newKey = {};
                newKey = response.data[i];
                newKey.key = newKey.id
                newKey.value = newKey.id
                newKey.label = newKey.mc
                sjData.push(newKey)
              }
              console.log("sjData",sjData);
              this.dwData = sjData;
            }
            return;
          }
          // }
        },
      }

  ));




  const tableProp: ITable = {
    tableSearch: false,
  }

  //自定义表单校验
  const dagConfig = {
    rules: [{ required: true, message: '请选择' }],
  };

  // 自定义表单

  const span = 24;
  const _width = 240;
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
            <TreeSelect style={{ width: _width }}
                        treeData={stflStore.dwTreeData}
                        placeholder="选择单位"
                        treeDefaultExpandAll
                        className="ant-select"
                        allowClear
            />
          </Form.Item>
            </Col>
            <Col span={span}>
          <Form.Item label="提醒标志" className="form-item" name="txbz">
            <Select
              className="ant-select" style={{width:  _width}}
                placeholder="请选择"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
            >
              <Option value="Y">是</Option>
              <Option value="N">否</Option>

            </Select>
          </Form.Item>
            </Col>


            <Col span={span}>
          <Form.Item label="维护人:" name="whr" >
            <Input disabled defaultValue={yhmc} style={{width:  _width}} className="ant-input" />
          </Form.Item>
            </Col>
            <Col span={span}>
          <Form.Item label="维护时间:" name="whsj" >
            <Input disabled defaultValue={getDate} style={{width:  _width}} className="ant-input"/>
          </Form.Item>
            </Col>
          </Row>
        </>
    )
  }


  const [initParams, setInitParams] = useState({})
  const ref = useRef();
  useEffect(() => {
    stflStore.queryTreeDwList();
    stflStore.queryDwList();
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
        for (var i = 0; i < stflStore.dwData.length; i++) {
          var lx = stflStore.dwData[i];
          console.log("lx", lx);
          if (lx.id === text) {
            return lx.mc;
          }
        }
      }
    },
    {
      title: '提醒标志',
      code: 'txbz',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text) {
          return text == 'Y' ? '是' : '否';
        }
        else {
          return text == '无';
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
    name: '实体分类'
  }

  const searchFrom = () => {
    return (
        <>

          <FormItem label="名称" className="form-item" name="cx_mc"><Input placeholder="请输入名称" /></FormItem >
          <FormItem label="编号" className="form-item" name="cx_bh"><Input placeholder="请输入编号" /></FormItem >
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


  const treeProp: ITree = {
    treeSearch: false,
    treeCheckAble: false
  }


  return (
      <DwTableLayout
          title={title}                            // 组件标题，必填
          source={source}                          // 组件元数据，必填
          treeProp={treeProp}
          //treeService={DwService}                  // 左侧树 实现类，必填
          ref={ref}
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={StflService}                 // 右侧表格实现类，必填
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

export default Stfl;
