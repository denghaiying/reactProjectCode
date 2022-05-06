import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Button, Select, TreeSelect } from 'antd';
import ZtcService from '@/services/base/ztc/ZtcService';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import Search from 'antd/es/input/Search';
import DwStore from '@/stores/system/DwStore';
import { observer, useLocalObservable } from 'mobx-react';
const FormItem = Form.Item;


const Ztc = observer((props) => {
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
  const ztcStore = useLocalObservable(() => (
    {
      lxData: [],
      page_No: 1,
      page_Size: 20,
      async queryZtcLxList() {
        const response = await fetch.get(`/api/eps/control/main/ztcflwh/queryForPage?pageIndex=${this.page_No - 1}&pageSize=${this.page_Size}&page=${this.page_No - 1}&limit=${this.page_Size}`);
        if (response.status === 200) {

          var sjData = [];
          if (response.data.results.length > 0) {
            for (var i = 0; i < response.data.results.length; i++) {
              let newKey = {};
              newKey = response.data.results[i];
              newKey.key = newKey.id
              newKey.value = newKey.id
              newKey.label = newKey.mc

              sjData.push(newKey)
            }
            this.lxData = sjData;
            console.log("lxData", this.lxData);
          }
          return;
        }

      },
    }
  ));




  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  //自定义表单校验
  const dagConfig = {
    rules: [{ required: true, message: '请选择' }],
  };

  // 自定义表单


  const customForm = () => {

    return (
      <>

        <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="分类:" name="flid" required {...dagConfig}>

          <Select
            style={{ width: 300 }}
            placeholder="请选择分类"
            options={ztcStore.lxData}
          />
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


  const [initParams, setInitParams] = useState({})
  const ref = useRef();
  useEffect(() => {
    ztcStore.queryZtcLxList();
  }, []);

  const source: EpsSource[] = [
    {
      title: '名称',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '分类',
      code: 'flid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        for (var i = 0; i < ztcStore.lxData.length; i++) {
          var lx = ztcStore.lxData[i];
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
    name: '主题词'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="分类" className="form-item" name="cx_lx">
          <Select
            style={{ width: 300 }}
            placeholder="请选择分类"
            options={ztcStore.lxData}
          />
        </FormItem >
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
      //treeService={DwService}                  // 左侧树 实现类，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={ZtcService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
    //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
})

export default Ztc;
