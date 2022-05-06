import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import cqbcZtService from './service/CqbcZtService';
import { Form, Input, message, Select, Checkbox, Row, Col, Button, Modal, Divider, Radio, Switch } from 'antd';
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

const span = 8;
const _width = 240





const cqbcZt = observer((props) => {

const ref = useRef();
const [recrodid, setRecrodid]= useState<string>('');

const [ftplist, setFtplist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [dwlist, setDwlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [dakxlist, setDakxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);

const dwonChange =  async (value) => {
  let url="/api/eps/control/main/dak/queryForList?iscqbc=Y&dw=";
    const response =await fetch.get(url+value,{});
     if (response.status === 200) {
        if (response.data.length > 0) {
          let  mbData = response.data.map(o => ({ 'id': o.id,'label': o.bh+"|"+o.mc,'value': o.id }));
          setDakxlist(mbData);
        }else{
          setDakxlist(response.data);
        }

    }
};


const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'name',
  labelColSpan: 8,
  rowSelection:{
    type:'checkbox'
  },
  enableBatchDelete: true,
  onEditClick:(form, record) =>{
    if(record.qyusing=="Y"){
      record.qyusing= "true";

    }else{
      record.qyusing= "false";
    }
    form.setFieldsValue(record);
  },
}

const onButtonClick = (val)=> {
 if (val.length != 1) {
        message.error('操作失败,请选择一行数据');
  }else{
    setRecrodid(val[0].id);
    setJkpname(val[0].name);
    setMidtbname(val[0].bmc);
    setVisiblezddy(true);
  }
 };


const onbatchDeleteClick = async (val) => {
        if (val.length == 0) {
            message.error('操作失败,请至少选择一行数据');
        } else {
          const tableStores = ref.current?.getTableStore();
          tableStores.batchDelete(val);
        }
};



const handleCancel = () => {
  setVisiblezddy(false);
};


const handleOk = () => {
  setVisiblezddy(false);
};

const customForm = () => {

  return (
    <>

      <Form.Item label="编号:" name="bh" required rules={[{ required: true, message: '请输入编号' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="名称:" name="ztmc" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="单位:" name="dw" required rules={[{ required: true, message: '请选择单位' }]}>
         <Select   placeholder="单位"   options={dwlist} style={{width:  _width}} onChange={dwonChange}/>
      </Form.Item>
      <Form.Item label="档案库:" name="dak" required rules={[{ required: true, message: '请选择档案库' }]}>
         <Select   placeholder="档案库"   options={dakxlist} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="文件存储:" name="ftpid" required rules={[{ required: true, message: '请选择文件存储' }]}>
          <Select   placeholder="文件存储"   options={ftplist} style={{width:  _width}}/>
      </Form.Item>


      <Form.Item label="总容量:" name="zrl" required rules={[{ required: true, message: '请输入总容量' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: _width }} />
      </Form.Item>

      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
        {/* //<Button type="primary" onClick={() => onButtonClick(ids)}>字段对应</Button> */}
      </>
    ])
  }

  // 创建右侧表格Store实例

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }
  useEffect(() => {

      const queryftpList =  async () =>{
        let url="/api/eps/wdgl/ftphttp/queryForList";
        const response =await fetch.post(url);
            if (response.status === 200) {
              if (response.data.length > 0) {
                let  mbData = response.data.map(o => ({ 'id': o.id, 'label':o.name, 'value': o.id}));
                setFtplist(mbData);
              }
            }
      }
      const queryDwList =  async () =>{
          let url="/api/eps/control/main/dw/queryForList";
          const response =await fetch.post(url);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  dakData = response.data.map(o => ({ 'id': o.id, 'label':o.mc, 'value': o.id }));
              setDwlist(dakData);
            }else{
              setDwlist(response.data);
            }
          }
      }
      const querydakList =  async () =>{
          let url="/api/eps/control/main/dak/queryForList?iscqbc=Y";
          const response =await fetch.post(url);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  dakData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
              setDaklist(dakData);
            }else{
              setDaklist(response.data);
            }
          }
      }
      queryDwList();
      queryftpList();
      querydakList();

  }, []);

  const source: EpsSource[] = [{
    title: '编号',
    code: 'bh',
    align: 'center',
    formType: EpsFormType.Input
  },{
      title: '名称',
      code: 'ztmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '单位',
      code: 'dw',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlist=dwlist;
        let aa = jlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '档案库',
      code: 'dak',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlist=daklist;
        let aa = jlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '文件存储',
      code: 'ftpid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlist=ftplist;
        let aa = jlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '总容量',
      code: 'zrl',
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
    name: '载体配置'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="bh">
          <Input placeholder="请输入编号" />
        </Form.Item>
        <Form.Item label="名称" className="form-item" name="name">
          <Input placeholder="请输入名称" />
        </Form.Item>
      </>
    )
  }

  return (
    <>
     <EpsPanel
          title={title}                            // 组件标题，必填
          ref={ref}
          source={source}                          // 组件元数据，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={cqbcZtService}                 // 右侧表格实现类，必填
          formWidth={480}
          searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction}
          customAction={customAction}
       >
       </EpsPanel>
    </>
  );
})

export default cqbcZt;
