import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import zdgxService from './service/Eps9ZdgxService';
import { Form, Input, message, Select, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';

import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [{value: "C", label: "文本型"}, {value: "N", label: "数值型"}, {value: "D", label: "日期型"}, {value: "T", label: "日期时间型"}, {value: "B",label: "大文本型"}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',
  onEditClick:(form, record) =>{
    if(record.bgqx === "Y"){
      record.bgqx= true;
    }else{
      record.bgqx= false;
    }
    form.setFieldsValue(record);
  },
}



const Zddy = observer((props) => {

const ref = useRef();
const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [zjklist, setZjkzdlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [jkpzlist, setJkpzlist]= useState<Array<{id:string;label:string;value:string}>>([]);


const _width = 360


const customForm = () => {

  return (
    <>
      <Form.Item label="接口名称:" name="name" initialValue={props.jkpname}>
        <Input  style={{ width: _width }}  disabled/>
      </Form.Item>
      <Form.Item label="档案库字段名:" name="dakzd">
         <Select   placeholder="接口类型"   options={daklist} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="中间库字段:" name="zjkzd">
        <Select   placeholder="数据库"   options={zjklist} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="字段名称:" name="zdmc" required  rules={[{ required: true, message: '请输入字段名称' }]} >
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="获取保管期限:" valuePropName="checked" name="bgqx" >
        <Checkbox  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="默认值:" name="zdmrz">
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="字段类型:" name="zdlx" required rules={[{ required: true, message: '请选择字段类型' }]}>
        <Select   placeholder="数据库"   options={lxData}  style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="接口ID:" name="jkid"  hidden initialValue={props.jkpzid}>
          <Input disabled style={{ width:_width }}  />
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

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zdgxService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }


  useEffect(() => {
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{'jkid':props.jkpzid});
    const querymbzlxList =  async (params) =>{
        const kkdyponse =await fetch.post("/api/eps9/tyjk/kkdy/findForKey",{jkid:props.jkpzid});
         debugger
          let url="/api/eps/control/main/mbzlx/queryForList";
          const response =await fetch.post(url+"?mbid="+props.mbid,params);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  mbData = response.data.map(o => ({ 'id': o.mc, 'label': o.mc+"|"+o.ms, 'value': o.mc }));
              setDaklist(mbData);
            }else{
              setDaklist(response.data);
            }
          }
    }


    const queryzjkzdList =  async () =>{
      const zjkzdresponse =await fetch.post("/api/eps9/tyjk/zdgx/queryForZjkZdList",{zjkid:props.jkpzid,midtbname:props.midtbname});
      if (zjkzdresponse.status === 200) {
      if (zjkzdresponse.data.length > 0) {
      let  mbData = zjkzdresponse.data.map(o => ({ 'id': o.name, 'label': o.name, 'value': o.name}));
       setZjkzdlist(mbData);
      }
     }
}


    const queryjkpzList =  async () =>{
          let url="/api/eps9/tyjk/jkpz/findForKey";
          const response =await fetch.post(url,{'jkid':props.jkpzid});
          if (response.status === 200) {
            if (response.data) {
                let  mbData ={ 'id': response.data.id, 'label': response.data.name, 'value': response.data.id };
                setJkpzlist(mbData);
            }
          }
    }
    querymbzlxList({});
    queryzjkzdList();
    queryjkpzList();
  }, [props.jkpzid]);



  const source: EpsSource[] = [{
      title: '接口ID',
      code: 'jkid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let sjjkpz=jkpzlist;
        if(text === sjjkpz.value){
           return sjjkpz.label;
        }else{
          return text;
        }
      }
    }, {
      title: '接口名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '档案库字段名',
      code: 'dakzd',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let dakzdlist=daklist;
        let aa = dakzdlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      }
    },{
      title: '中间库字段',
      code: 'zjkzd',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '字段名称',
      code: 'zdmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '默认值',
      code: 'zdmrz',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '字段类型',
      code: 'zdlx',
      align: 'center',
      formType: EpsFormType.Input,
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
    name: '字段对应'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="接口名称" className="form-item" name="name"><Input placeholder="请输入接口名称" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="xysjlxmc"><Input placeholder="请输入名称" /></Form.Item >

      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={zdgxService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={900}
       // searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        initParams={{'jkid':props.jkpzid}}
      >
      </EpsPanel>
    </>
  );
})

export default Zddy;
