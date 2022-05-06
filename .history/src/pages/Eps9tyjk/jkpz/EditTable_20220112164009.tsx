import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import fetch from "../../../utils/fetch";
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormRadio, ProFormField, ProFormDependency } from '@ant-design/pro-form';
import {  message, Button } from 'antd';
import zdgxService from './service/Eps9ZdgxService';
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';

const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

type DataSourceType = {
  id: string;
  ms?: string;
  mc?: string;
  lx?: string;
  dakzd?: string;
  zdmc?: string;
  zdmrz?: string;
};

const lxData = [{value: "C", label: "文本型"}, {value: "N", label: "数值型"}, {value: "D", label: "日期型"}, {value: "T", label: "日期时间型"}, {value: "B",label: "大文本型"}];



const EditTable = observer((props) => {
const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
const [daklist, setDaklist]= useState<{}>({});
const formRef = useRef<ProFormInstance<any>>();

const [dataSelectedRows, setdataSelectedRowsKeys] = useState<[]>([]);

const EditStore = useLocalObservable(() => (
  {
      dData: [],
  }
));

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: []) => {
    debugger
    setdataSelectedRowsKeys(selectedRows);
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};

const submitsj =  async (val) =>{
  debugger
  if(val.length>0){
    var cwsj=0;
    for(var i=0;i<val.length;i++){
      var a=val[i];
      if(a.dakzd==""){
        cwsj=1;
      }else{
        cwsj=0;
      }
    }
    if(cwsj==1){
      message.error("对应档案库字段不能为空！")
    }else{
      zdgxService.saveSj(val).then(res => {
        message.success('数据添加成功');
      }).catch(err => {
        message.error(err)
      })
    }
   }else{
     message.error('操作失败,请至少选择一行数据');
   }

}

const changezd =  async (val) =>{
  debugger
  if(val.dakzd==undefined){
    EditStore.dData.splice(val);
  }else{
    EditStore.dData.push(val);
  }
  setdataSelectedRowsKeys(EditStore.dData);
}
const columns : ProColumns<DataSourceType>[]= [
  {
    title: '接口库字段名称',
    dataIndex: 'ms',
    width: '25%',
  },
  {
    title: '接口库字段名',
    dataIndex: 'zjkzd',
    width: '15%',
  },
  {
    title: '类型',
    dataIndex: 'zdlx',
    width: '15%',
  },
  {
    title: '对应档案库字段',
    dataIndex: 'dakzd',
    width: '15%',
    valueType: 'select',
    valueEnum: daklist,
  },
  {
    title: '字段名称',
    dataIndex: 'zdmc',
    width: '15%',
  },
  {
    title: '默认值',
    dataIndex: 'zdmrz',
    width: '15%',
  }
];

  useEffect(() => {
    const queryzjkzdList =  async () =>{
      const zjkzdresponse =await fetch.post("/api/eps9/tyjk/zdgx/findAllMbzlx",{bmc:props.midtbname});
      if (zjkzdresponse.status === 200) {
      if (zjkzdresponse.data.length > 0) {
        let  mbData =zjkzdresponse.data.map(o => ({  'key': o.id,'id': o.id, 'ms':o.ms, 'zjkzd': o.mc, 'zdlx': o.lx,'dakzd':'', 'zdmc':'', 'zdmrz':'','name':props.jkpname,'jkid':props.jkpzid,'whsj':getDate}));
        setDataSource(mbData);
        setEditableRowKeys(mbData.map(o => o.id));
      }
     }
    }

    const querymbzlxList =  async () =>{
        const kkdyponse =await fetch.post("/api/eps9/tyjk/kkdy/findForKeyMb",{jkid:props.jkpzid});
        if(kkdyponse.data.length ==1){
          let url="/api/eps/control/main/mbzlx/queryForList";
          const response =await fetch.post(url+"?mbid="+kkdyponse.data[0].mb);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let json={};
              for(var i=0;i<response.data.length;i++){
                var a=response.data[i];
                json[a.mc]={'text':a.mc+"|"+a.ms ,'status': 'Success'}
              }
              setDaklist(json);
              console.log("json:"+json);
            }else{
              setDaklist({});
            }
          }
        }
    }
  if(props.jkpzid){
    EditStore.dData=[];
    queryzjkzdList();
    querymbzlxList();
    }
  }, []);
  return (
    <>
     <EditableProTable<DataSourceType>
        headerTitle="字段对应"
        columns={columns}
        rowKey="id"
        value={dataSource}
        onChange={setDataSource}
        recordCreatorProps={false}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        toolBarRender={() => {
          return [
            <Button  type="primary" key="submit"
            onClick={() => submitsj(dataSelectedRows)}>
            导入
          </Button>,
            <Button
              type="primary"
              key="save"
              onClick={() => {
                // dataSource 就是当前数据，可以调用 api 将其保存
                console.log(dataSource);
                setDataSource(dataSource);
                message.success('数据修改成功');
              }}
            >
              保存修改数据
            </Button>
          ];
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            changezd(record);
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
})

export default EditTable;
