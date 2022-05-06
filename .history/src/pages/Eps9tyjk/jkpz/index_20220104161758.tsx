import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import jkpzService from './service/JkpzService';
import { Form, Input, message, Select, Checkbox, Row, Col, Button, Modal, Divider } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import Zddy from "./zddy.tsx";
import zjkService from './service/ZjkService';

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





const Jkpz = observer((props) => {

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
const [zjklist, setZjkzdlist]= useState<Array<{id:string;label:string;value:string}>>([]);

const tableProp: ITable = {

  searchCode: 'name',
  labelColSpan: 8,
  rowSelection:{
    type:'checkbox'
  },
  enableBatchDelete: true,
  onEditClick:(form, record) =>{
    if(record.sqjcqy=="Y"){
      record.sqjcqy= true;
    }else{
      record.sqjcqy= false;
    }
    if(record.scdh=="Y"){
      record.scdh= true;
    }else{
      record.scdh= false;
    }
    if(record.afterdele=="是"){
     record.afterdele= true;
    }else{
     record.afterdele= false;
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
    setMbid(val[0].mb);
    setZjkid(val[0].zjkid);
    setMidtbname(val[0].midtbname);
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
    <Row gutter={20}>
      <Col span={span}>
        <Form.Item label="名称:" name="name" required  rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear style={{ width:  _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="中间表表名:" name="midtbname">
         <Select   placeholder="数据库"   options={zjklist} style={{width:  _width}}/>
        </Form.Item>
      </Col>
    <Divider orientation="left" plain> 其它信息</Divider>
      <Col span={span}>
        <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
          <Input disabled  style={{ width: _width }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
          <Input disabled  style={{ width: _width }} />
        </Form.Item>
      </Col>

    </Row>
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

      const queryzjkzdList =  async () =>{
        let url="/api/eps/control/main/dak/queryForList";
        const response =await fetch.post(url+"?sfdzwj=Y");
            if (response.status === 200) {
              debugger
              if (response.data.length > 0) {
                let  mbData = response.data.map(o => ({ 'id': o.mbc, 'label':o.bh+"|"+ o.mc, 'value': o.mbc}));
                setZjkzdlist(mbData);
              }
            }
      }
      queryzjkzdList();

  }, []);

  const source: EpsSource[] = [{
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '原文表名称',
      code: 'midfiletbname',
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
    name: '数据库接口配置'
  }


  const searchFrom = () => {
    return (
      <>
      </>
    )
  }

  return (
    <>
     <EpsPanel
          title={title}                            // 组件标题，必填
          ref={ref}
          source={source}                          // 组件元数据，必填
      //    treeService={zjkService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={jkpzService}                 // 右侧表格实现类，必填
          formWidth={1380}
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
          width='1380px'
        >
        <div  style={{ height:'500px'}}>
          <Zddy jkpzid={recrodid} jkpname={jkpname} mbid={mbid} zjkid={zjkid} midtbname={midtbname}/>
        </div>
      </Modal>
    </>
  );
})

export default Jkpz;
