import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import kkdyService from './service/CqbcKkdyService';
import { Form, Input, message, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import jkpzService from '../cqbcJkpz/service/CqbcJkpzService';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const tmztlist = [{value: "1", label: "文件收集"}, {value: "2", label: "文件整理"},{value: "3", label: "档案管理"}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const _width = 500


const tableProp: ITable = {
  disableCopy: true,
  labelColSpan: 7,
  searchCode: 'bmc'
}

const Cqbckkdy = observer((props) => {

  const ref = useRef();

  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(kkdyService));
  const [jklist, setJklist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [dwlist, setDwlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [dakxlist, setDakxlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [mbid,setMbid] = useState('');

  const dwonChange =  async (value) => {
      let url="/api/eps/control/main/dak/queryForList?dw=";
        const response =await fetch.get(url+value+"&mbid="+mbid,{});
         if (response.status === 200) {
            if (response.data.length > 0) {
              let  mbData = response.data.map(o => ({ 'id': o.id,'label': o.bh+"|"+o.mc,'value': o.id }));
              setDakxlist(mbData);
            }else{
              setDakxlist(response.data);
            }

        }
  };



  const customForm = (text, form) => {
    const dakChange =  async (value) => {
        let url="/api/eps/control/main/dak/queryForId";
          const response =await fetch.get(url+"?id="+value,{});
          debugger
          if (response.status === 200) {
                text.setFieldsValue({ 'bmc': response.data.mbc ,'mb':response.data.mbid});
                setMbid(response.data.mbid);
            }

    }

    return (
      <>
        <Form.Item label="所属接口:" name="jkid" required  rules={[{ required: true, message: '请选择所属接口' }]}>
          <Select placeholder="所属接口"   options={jklist} style={{width:  _width}}/>
        </Form.Item>
        <Form.Item label="单位"  name="dwid" required  rules={[{ required: true, message: '请选择单位' }]}>
          <Select   placeholder="单位"   options={dwlist} style={{width:  _width}} onChange={dwonChange}/>
        </Form.Item>
        <Form.Item label="档案库:" name="dakid" required  rules={[{ required: true, message: '请选择档案库' }]}>
          <Select   placeholder="档案库"   options={dakxlist} style={{width:  _width}} onChange={dakChange}/>
        </Form.Item>
        <Form.Item label="表名称:" name="bmc">
          <Input disabled  style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="档案库状态:" name="tmzt" required  rules={[{ required: true, message: '请选择档案库状态' }]}>
          <Select   placeholder="档案库状态"   options={tmztlist} style={{width:  _width}}/>
        </Form.Item>
        <Form.Item label="规则(Sql条件语句):" name="sqlwhere" required  rules={[{ required: true, message: '请输入规则(Sql条件语句)' }]}>
            <Input.TextArea  autoSize={{ minRows: 8, maxRows: 12 }} style={{ width:  _width }} />
        </Form.Item>
        <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
          <Input disabled  style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" initialValue={getDate}>
          <Input disabled  style={{ width: _width }} />
        </Form.Item>
        <Form.Item label="模板ID:" name="mb"  hidden>
          <Input name="mb" disabled style={{ width:  _width }}  />
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
        <>
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
      const queryZjkList =  async () =>{
        if(tableStore){
          let url="/api/eps/lg/cqbcjkpz/findForKey";
          const response =await fetch.post(url,{qyusing:'Y'});
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  zjkData = response.data.map(o => ({ 'id': o.id, 'label': o.name, 'value': o.id }));
              setJklist(zjkData);
            }else{
              setJklist(response.data);
            }
          }
        }
      }
      const querydakList =  async () =>{
        if(tableStore){
          let url="/api/eps/control/main/dak/queryForList";
          const response =await fetch.post(url,{isdzwjzx:'Y'});
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  dakData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
              setDaklist(dakData);
            }else{
              setDaklist(response.data);
            }
          }
        }
      }
      const queryDwList =  async () =>{
        if(tableStore){
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
      }
    queryZjkList();
    querydakList();
    queryDwList();
  }, []);

  const source: EpsSource[] = [{
      title: '所属接口',
      code: 'jkid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlist=jklist;
        let aa = jlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '档案库',
      code: 'dakid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let dalist=daklist;
        let aa = dalist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '单位',
      code: 'dwid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let dwlistx=dwlist;
        let aa = dwlistx.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '表名称',
      code: 'bmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '档案库状态',
      code: 'tmzt',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let tmzttemp=tmztlist;
        let aa = tmzttemp.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '规则(Sql条件语句)',
      code: 'sqlwhere',
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
    name: '库库对应关系'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="所属接口" className="form-item" name="jkid"> <Select placeholder="所属接口" style={{width:  300}}   options={jklist} /></Form.Item >
      </>
    )
  }

  return (
    <>
        <EpsPanel
          title={title}                            // 组件标题，必填
          ref={ref}
          source={source}                          // 组件元数据，必填
          treeService={jkpzService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={kkdyService}                 // 右侧表格实现类，必填
          formWidth={900}
          searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction}
          customAction={customAction}
       >
       </EpsPanel>
    </>
  );
})

export default Cqbckkdy;
