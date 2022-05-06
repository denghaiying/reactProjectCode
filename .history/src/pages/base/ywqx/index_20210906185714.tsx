import React, { useEffect, useState, useRef } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Button, Select, TreeSelect, Row, Col } from 'antd';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import { observer, useLocalObservable } from 'mobx-react';
import DwTableLayout from '@/eps/business/DwTableLayout';

import YwqxService from "@/pages/base/ywqx/ywqxService"

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { SettingOutlined } from '@ant-design/icons';
import moment from 'moment';



const FormItem = Form.Item;


const Ywqx = observer((props) => {
  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const umid="JC051";


  /**
       * childStore
       */
  const ywqxStore = useLocalObservable(() => (
    {
      params: {},
      dwTreeData: [],
      dwData: [],
      page_No: 1,
      page_Size: 20,
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
    }
  ));




  const tableProp: ITable = {
    tableSearch: false,
    disableAdd: true,
    disableEdit: true,
    disableDelete: true,
    disableCopy:true,
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

        {/* <Row gutter={20}>
            <Col span={span}>
        <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        </Col>
        < Col span={span}>
        <Form.Item label="名称:" name="mc" required rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear style={{ width: 300 }} />
        </Form.Item>
        </Col>
        <Col span={span}>
        <Form.Item label="单位:" name="flid" required {...dagConfig}>

          <TreeSelect style={{ width: 300 }}
            treeData={sjzdStore.dwTreeData}
            placeholder="选择单位"
            treeDefaultExpandAll
            allowClear
          />

        </Form.Item>
        </Col>
        <Col span={span}>
        <Form.Item label="维护人:" name="whr" >
          <Input disabled defaultValue={yhmc} style={{ width: 300 }} />
        </Form.Item>
        </Col>
        <Col span={span}>
        <Form.Item label="维护时间:" name="whsj" >
          <Input disabled defaultValue={getDate} style={{ width: 300 }} />
        </Form.Item>
        </Col>
       </Row> */}
       ''
      </>
    )
  }


  const [initParams, setInitParams] = useState({})
  const ref = useRef();
  useEffect(() => {
    ywqxStore.queryTreeDwList();
  }, []);

  const source: EpsSource[] = [
    {
      title: '编号',
      code: 'code',
      align: 'center',
      width:80,
      formType: EpsFormType.Input
    },
    {
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '停用',
      code: 'tybz',
      align: 'center',
      width:80,
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        return text == 'N' ? '启用' : '停用';
    }
    },
    {
      title: '停用日期',
      code: 'tyrq',
      align: 'center',
      width:160,
      formType: EpsFormType.Input
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      width:120,
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      width:160,
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '业务权限'
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
        <EpsModalButton name="业务权限" title="业务权限" width={1200}   useIframe={true}  url={'/api/eps/control/main/dakqx/ywqxszMain'}  icon={<SettingOutlined />}/>

      </>
    ])
  }

   // 自定义表格行按钮detail
    const customTableAction = (text, record, index, store) => {
        return (<>
            {[

                //  YwqxDetail(text,record,index,store)

            ]}
        </>);
    }


 const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="code">
          <Input placeholder="请输入编码" />
        </Form.Item >
        <Form.Item label="名称" className="form-item" name="name">
          <Input placeholder="请输入名称" />
        </Form.Item>

      </>
    )
  }

  return (
    <DwTableLayout
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      //treeService={DwService}                  // 左侧树 实现类，必填
    //  ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={YwqxService}                 // 右侧表格实现类，必填
    //  formWidth={1200}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customTableAction={customTableAction}
   //   customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
   //  customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </DwTableLayout>
  );
})

export default Ywqx;


