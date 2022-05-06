import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Button, Select, TreeSelect } from 'antd';
import fulltextConfService from '@/services/system/fulltext/FulltextConfService';
import SysStore from '@/stores/system/SysStore';
const { Option } = Select;
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
  disableCopy:true,
}

// 自定义表单


const customForm = () => {

  return (
    <>

      <Form.Item label="排序规则:" name="px" >
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="服务地址:" name="cpath" required rules={[{ required: true, message: '请输入服务地址' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="类型:" name="isdefault" initialValue="N">
      <Select  style={{ width: 300 }} >
            <Option value="Y">是</Option>
            <Option value="N">否</Option>

    </Select>
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc} >
        <Input disabled  style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled  style={{ width: 300 }} />
      </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}

function fulltextConf() {
  const [initParams, setInitParams] = useState({})

  const ref = useRef();
  useEffect(() => {

  }, []);

  const source: EpsSource[] = [
    {
      title: '全文索引服务地址',
      code: 'cpath',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '排序规则',
      code: 'px',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '是否默认',
      code: 'isdefault',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if (text) {
          return text == 'Y' ? '是' : '否';
        } else {
          return text = "无";
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
      formType: EpsFormType.Input,
    }
  ]
  const title = {
    name: '全文检索配置'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="编号" className="form-item" name="esCode"><Input placeholder="请输入编号" /></FormItem >
        <FormItem label="名称" className="form-item" name="esName"><Input placeholder="请输入名称" /></FormItem >
        <FormItem label="系统字段" className="form-item" name="esSource"><Input placeholder="请输入系统字段" /></FormItem >
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
      tableService={fulltextConfService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}

      // searchForm={searchFrom}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
    //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default fulltextConf;
