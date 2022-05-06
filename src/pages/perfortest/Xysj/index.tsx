import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import xysjService from '@/services/perfortest/XysjService';
import xysjsxService from '@/services/perfortest/XysjsxService';
import { Form, Input, message, InputNumber, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name'
}

const Xysj = observer((props) => {

const ref = useRef();

const [sxlist, setSxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [lxlist, setLxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  // 创建右侧表格Store实例
const [tableStore] = useState<EpsTableStore>(new EpsTableStore(xysjService));

    useEffect(() => {
    const queryXysjsxList =  async () =>{
      if(tableStore){
        let url="/api/api/xysjsx";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data.length > 0) {
            let  SxData = response.data.map(o => ({ 'id': o.xysjsxbh, 'label': o.xysjsxmc, 'value': o.xysjsxbh }));
            console.log('qjjslist===',SxData);
            setSxlist(SxData);
          }else{
            setSxlist(response.data);
          }
        }
        }
    }

      const queryXysjlxList =  async () =>{
      if(tableStore){
        let url="/api/api/xysjlx";
        const response =await fetch.get(url);
         if (response.status === 200) {
          if (response.data.length > 0) {
            let  lxData = response.data.map(o => ({ 'id': o.id, 'label': o.xysjlxmc, 'value': o.id }));
            console.log('lxlist===',lxData);
            setLxlist(lxData);
          }else{
            setLxlist(response.data);
          }
        }
        }
    }
    queryXysjsxList();
    queryXysjlxList();
    //YhStore.queryForPage();
  }, []);

const customForm = () => {

  return (
    <>
      <Form.Item label="字段名称:" name="xysjzdmc" required rules={[{ required: true, message: '请输入字段名称' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="字段描述:" name="xysjzdms" required rules={[{ required: true, message: '请输入字段描述' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="字段英文描述:" name="xysjzdywms" required rules={[{ required: true, message: '请输入字段英文描述' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
       <Form.Item label="字段长度:" name="xysjzdcd" required rules={[{ required: true, message: '请输入字段长度' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="字段属性:" name="xysjzdsx" required rules={[{ required: true, message: '请选择字段属性' }]}>
         <Select   placeholder="字段属性"   options={sxlist} style={{width:  300
         // ## zindex:999
          }}/>
      </Form.Item>
      <Form.Item label="字段类型:" name="xysjzdlx" required rules={[{ required: true, message: '请选择字段类型' }]}>
        <Select   placeholder="字段类型"   options={lxlist} style={{width:  300,zindex:999}}/>
      </Form.Item>
      <Form.Item label="字段排序:" name="xysjpx" required rules={[{ required: true, message: '请输入字段排序' }]}>
        <InputNumber min={0} max={100}  initialValue={0} style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <></>
    ])
  }


  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }


  const source: EpsSource[] = [ {
      title: '字段名称',
      code: 'xysjzdmc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '字段描述',
      code: 'xysjzdms',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '字段英文描述',
      code: 'xysjzdywms',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '字段长度',
      code: 'xysjzdcd',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '字段属性',
      code: 'xysjzdsx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let lxlist=sxlist;
        let aa = lxlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    }, {
      title: '字段类型',
      code: 'xysjzdlx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let list=lxlist;
        let aa = list.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '字段排序',
      code: 'xysjpx',
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
    }]
  const title: ITitle = {
    name: '元数据'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="xysjlxbh"><Input placeholder="请输入编号" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="xysjlxmc"><Input placeholder="请输入名称" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={xysjService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={500}
        tableRowClick={(record) => console.log('abcef', record)}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default Xysj;
