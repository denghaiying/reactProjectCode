import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import fetch from "../../../utils/fetch";
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormRadio, ProFormField, ProFormDependency } from '@ant-design/pro-form';
import {  message, Button } from 'antd';
import zdgxService from './service/Eps9ZdgxService';
import moment from 'moment';
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

type Typelx = {};

const lxData = [{value: "C", label: "文本型"}, {value: "N", label: "数值型"}, {value: "D", label: "日期型"}, {value: "T", label: "日期时间型"}, {value: "B",label: "大文本型"}];



const EditTable = observer((props) => {
const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
const [daklist, setDaklist]= useState<{}>({});
const formRef = useRef<ProFormInstance<any>>();

const [dataSelectedRows, setdataSelectedRowsKeys] = useState<React.Key[]>();
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: []) => {
    setdataSelectedRowsKeys(selectedRows);
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

const submitsj =  async (val) =>{

  if(val.length>0){
   var reposn=zdgxService.saveSj(val);
   debugger
    message.success('数据添加成功');
  }else{
    message.error('操作失败,请至少选择一行数据');
  }

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
  },{
    title: '操作',
    valueType: 'option',
    width: 200,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>
    ],
  },
];

  useEffect(() => {
    if (props.mblzx.length > 0) {
      let  mbData = props.mblzx.map(o => ({ 'id': o.id, 'ms':o.ms, 'zjkzd': o.mc, 'zdlx': o.lx,'dakzd':'', 'zdmc':'', 'zdmrz':'','name':props.jkpname,'jkid':props.jkpzid,'whsj':getDate}));
      setDataSource(mbData);
     // setEditableRowKeys(mbData.map(o => o.id));
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
        querymbzlxList();
    }
  }, []);
  return (
    <>
  <ProForm<{
      table: DataSourceType[];
    }>
      formRef={formRef}
      initialValues={{
        table: {dataSource},
      }}

      submitter={{
        // 配置按钮文本
        searchConfig: {
          submitText: '提交',
        },
        // 配置按钮的属性
        resetButtonProps: {
          style: {
            // 隐藏重置按钮
            display: 'none',
          },
        },
        submitButtonProps: {},

        // 完全自定义整个区域
        render: (props, doms) => {
          console.log(props);
          return [

            <Button  type="primary" key="submit"
            onClick={() => {
              if(dataSelectedRows.length>0){
                 zdgxService.saveSj(dataSelectedRows).then(res => {
                  message.success('数据添加成功');
                }).catch(err => {
                  message.error(err)
                })
               }else{
                 message.error('操作失败,请至少选择一行数据');
               }

            }}>
              导入

            </Button>
          ];
        },
      }}
    >
     <EditableProTable<DataSourceType>
        headerTitle="可编辑表格"
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
          ];
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
    </ProForm>
    </>
  );
})

export default EditTable;
