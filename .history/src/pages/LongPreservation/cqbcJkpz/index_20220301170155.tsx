import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import jkpzService from './service/CqbckpzService';
import { Form, Input, message, Select, Checkbox, Row, Col, Button, Modal, Divider, Radio, Switch } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import Zddy from "./zddy.tsx";
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





const CqbcJkpz = observer((props) => {

const ref = useRef();
const [checkrow, setCheckRow] = useState();
const [mblist, setMblist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [visible, setVisiblezddy] =useState(false);
const [recrodid, setRecrodid]= useState<string>('');
const [jkpname, setJkpname]= useState<string>('');
const [mbid, setMbid]= useState<string>('');
const [zjkid, setZjkid]= useState<string>('');
const [midtbname, setMidtbname]= useState<string>('');
const [asipjkpzlist, setAsipjkpzlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [dakcqbclist, setDakcqbclist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [ftplist, setFtplist]= useState<Array<{id:string;label:string;value:string}>>([]);

const lxTypeData =[{value: '普通', label: '普通'},{value: 'asip', label: 'ASIP'}];

const uingTypeData =[{value: 'Y', label: '启用'},{value: 'N', label: '停用'}];
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

const doCreateTemplateString = (val)=> {
  if (val.length != 1) {
    message.error('操作失败,请选择一行数据');
  } else {
    window.open("/api/eps9/tyjk/example/"+val[0].id)
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
        <Form.Item label="名称:" name="name" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="档案库名称:" name="bmc" required rules={[{ required: true, message: '请选择档案库名称' }]}>
         <Select   placeholder="档案库名称"   options={dakcqbclist} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item name="qyusing" label="启用:" initialValue="true">
          <Radio.Group>
            <Radio.Button value="true">开启</Radio.Button>
            <Radio.Button value="false">关闭</Radio.Button>
          </Radio.Group>
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
        <Button type="primary" onClick={() => onButtonClick(ids)}>字段对应</Button>
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

      const queryCqbcDaKList =  async () =>{
        let url="/api/eps/control/main/dak/queryForList";
        const response =await fetch.post(url+"?iscqbc=Y&dw="+SysStore.getCurrentCmp().id);
            if (response.status === 200) {
              if (response.data.length > 0) {
                let  mbData = response.data.map(o => ({ 'id': o.mbc, 'label':o.bh+"|"+ o.mc, 'value': o.mbc}));
                setDakcqbclist(mbData);
              }
            }
      }
      queryCqbcDaKList();

  }, []);

  const source: EpsSource[] = [{
    title: '编号',
    code: 'bh',
    align: 'center',
    formType: EpsFormType.Input
  },{
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '档案库名称',
      code: 'bmc',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlist=dakcqbclist;
        let aa = jlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '启用',
      code: 'qyusing',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if(text ==='Y'){
          return '启用';
        }else{
          return '停用';
        }
      },
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
    name: '长期保存接口配置'
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
        <Form.Item label="状态" className="form-item" name="qyusing">
          <Select allowClear placeholder="状态" options={uingTypeData} />
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
          tableService={jkpzService}                 // 右侧表格实现类，必填
          formWidth={480}
          searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction}
          customAction={customAction}
       >
       </EpsPanel>
        <Modal
          title="字段对应"
          visible={visible}
          onOk={() => handleOk()}
          onCancel={() =>handleCancel()}
          style={{height:'100%',top:"0px"}}
          width='100%'
        >
          <Zddy jkpzid={recrodid} jkpname={jkpname}  midtbname={midtbname}/>
      </Modal>
    </>
  );
})

export default CqbcJkpz;
