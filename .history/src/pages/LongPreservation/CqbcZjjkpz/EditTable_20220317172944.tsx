import React, { useEffect, useRef, useState } from 'react';
import type { ActionType,ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import fetch from "../../../utils/fetch";
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormRadio, ProFormField, ProFormDependency } from '@ant-design/pro-form';
import { message, Button, Form} from 'antd';
import zdgxService from './service/CqbcZjZdgxService';
import moment from 'moment';
import { observer, useLocalObservable } from 'mobx-react';
import { makeAutoObservable, runInAction } from 'mobx';
import Map from '../../dashboard/monitor/components/Map/index';
import e from '@umijs/deps/compiled/express';

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

const lxData = [{ value: "C", label: "文本型" }, { value: "N", label: "数值型" }, { value: "D", label: "日期型" }, { value: "T", label: "日期时间型" }, { value: "B", label: "大文本型" }];



const EditTable = observer((props) => {
  const [form] = Form.useForm();
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [daklist, setDaklist] = useState<{}>({});
  const formRef = useRef<ProFormInstance<any>>();
  const actionRef = useRef<ActionType>();
  const [dataSelectedRowskeys, setdataSelectedRowsKeys] = useState<[]>([]);
  //const [dataSelectedRows, setdataSelectedRows] = useState<[]>([]);

  const EditStore = useLocalObservable(() => (
    {
      rowsData:[],
      keysData:[],
      selectRowKeys:[],
      dataSelectedRowskeys: [],
      constructor() {
        makeAutoObservable(this);
      },
      changezd(val) {
        runInAction(() => {
          if (val.dakzd == undefined) {
            for (var i = this.rowsData.length - 1; i > -1; i--) {
              if (this.rowsData[i].id == val.id) {
                this.rowsData.splice(i, 1);
              }
            }
            for (var i = this.keysData.length - 1; i > -1; i--) {
              if (this.keysData[i] == val.id) {
                this.keysData.splice(i, 1);
              }
            }
          } else {
            if(this.rowsData.length>0){
              var aa=this.rowsData;
              console.log("111"+this.rowsData);
              for (var i = this.rowsData.length - 1; i > -1; i--) {
                if (this.rowsData[i].id == val.id) {
                  this.rowsData.splice(i, 1);
                }
              }
              this.rowsData.push(val);
            }else{
              this.rowsData.push(val);
            }
            if(this.keysData.length>0){
            var aa=this.keysData;
            console.log("22"+this.keysData);
            for (var i = this.keysData.length - 1; i > -1; i--) {
              var a=this.keysData[i];
              if (this.keysData[i]== val.id) {
                this.keysData.splice(i, 1);
              }
            }
            this.keysData.push(val.id);
          }else{
            this.keysData.push(val.id);
          }
          }
          var sjdat=[];
          for (var i = 0; i < this.keysData.length; i++) {
            var a = this.keysData[i];
            sjdat.push(a);
          }
       this.selectRowKeys=sjdat;

      })
    }
  }))
  const rowSelection = {
    selectedRowKeys: EditStore.keysData,
    // onclick: (selectedRowKeys, selectedRows) => {
    //   debugger
    //           // selectedRowKeys = rowKeys;
    //           console.log(selectedRowKeys);
    //           console.log(selectedRows);
    //           EditStore.dataSelectedRowskeys=selectedRowKeys;
    //          // setdataSelectedRowsKeys(selectedRowKeys);
    // //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //  }
  };

  const submitsj = async (val) => {
    if (val.length > 0) {
      var cwsj = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val[i];
        if (a.dakzd == "") {
          cwsj = 1;
        } else {
          cwsj = 0;
        }
        if (a.zdlx != "") {
          for (var j = 0; j < lxData.length; j++) {
            var b = lxData[j];
            if (a.zdlx == b.label) {
              a.zdlx = b.value;
            }
          }
        }
      }
      if (cwsj == 1) {
        message.error("对应档案库字段不能为空！")
      } else {
        zdgxService.saveSj(val).then(res => {
          message.success('数据添加成功');
        }).catch(err => {
          message.error(err)
        })
      }
    } else {
      message.error('操作失败,请至少选择一行数据');
    }

  }


  const columns: ProColumns<DataSourceType>[] = [
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
    const queryzjkzdList = async () => {
      const zjkzdresponse = await fetch.post("/api/eps/lg/zjzdgx/findAllMbzlx", { bmc: props.midtbname });
      if (zjkzdresponse.status === 200) {
        if (zjkzdresponse.data.length > 0) {
          var listdata=[];
          for(var i=0;i<zjkzdresponse.data.length;i++){
            var a=zjkzdresponse.data[i];
            for (var j = 0; j < lxData.length; j++) {
              var b = lxData[j];
              if (a.lx == b.value) {
                a.lx = b.label;
              }
            }
            listdata.push(a);
          }

          let mbData = listdata?.map(o => (
          {'key': o.id, 'id': o.id, 'ms': o.ms, 'zjkzd': o.mc, 'zdlx':o.lx , 'dakzd': '', 'zdmc': '', 'zdmrz': '', 'name': props.jkpname, 'jkid': props.jkpzid, 'whsj': getDate }));
          setDataSource(mbData);
          setEditableRowKeys(mbData.map(o => o.id));
        }
      }
    }

    const querymbzlxList = async () => {
      const kkdyponse = await fetch.post("/api/eps9/tyjk/kkdy/findForKeyMb", { jkid: props.jkpzid });
      if (kkdyponse.data.length == 1) {
        let url = "/api/eps/control/main/mbzlx/queryForList";
        const response = await fetch.post(url + "?mbid=" + kkdyponse.data[0].mb);
        if (response.status === 200) {
          if (response.data.length > 0) {
            let json = {};
            for (var i = 0; i < response.data.length; i++) {
              var a = response.data[i];
              json[a.mc] = { 'text': a.mc + "|" + a.ms, 'status': 'Success','ms': a.ms}
            }
            setDaklist(json);
          } else {
            setDaklist({});
          }
        }
      }
    }
    EditStore.rowsData = [];
    EditStore.keysData = [];
    EditStore.selectRowKeys=[];
    if (props.jkpzid) {
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
          selectedRowKeys: EditStore.selectRowKeys
        }}
        toolBarRender={() => {
          return [
            <Button type="primary" key="submit"
              onClick={() => submitsj(EditStore.rowsData)}>
              导入
            </Button>
          ];
        }}
        editable={{
          form:form,
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            if (record.dakzd){
             var a= daklist[record.dakzd];
             record.zdmc=a.ms;
             for (var i =recordList.length - 1; i > -1; i--) {
               var sj=recordList[i];
                if(sj.id==record.id){
                  recordList.splice(i, 1,record);
                }
              }
            }
            setDataSource(recordList);
            EditStore.changezd(record);
            form.resetFields();
          },
          onChange: setEditableRowKeys,
        }}
      />
    </>
  );
})

export default EditTable;
