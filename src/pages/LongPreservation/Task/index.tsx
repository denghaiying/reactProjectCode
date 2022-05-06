import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import taskService from './service/TaskService';
import { Form, Input, message, InputNumber, Select, DatePicker, Button} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


const Task = observer((props) => {
const ref = useRef();

const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',
  rowSelection:{
    type:'radio'
  },
  onEditClick: async (form, data) => {
    moment.locale('zh-cn');
    data.taskBegindate = moment(data.taskBegindate).format('L')
    data.taskBegindate = moment(data.taskBegindate, 'YYYY-MM-DD');
    data.taskEnddate = moment(data.taskEnddate).format('L')
    data.taskEnddate = moment(data.taskEnddate, 'YYYY-MM-DD');
    const response =await fetch.get("/api/api/arch/dak/"+data.taskDwid,{});
    if (response.status === 200) {
      if (response.data.length > 0) {
        let  daData = response.data.map(o => ({ 'id': o.id,'label':o.mc,'value': o.id }));
        setDakdata(daData);
      }
    }
  }

}
  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(taskService));
  const [dwlist, setDwlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [dakData, setDakdata]= useState<Array<{id:string;label:string;value:string}>>([]);

const dwonChange =  async (value) => {
  let url="/api/api/arch/dak";
    const response =await fetch.get(url+"/"+value,{});
    if (response.status === 200) {
      if (response.data.length > 0) {
        let  daData = response.data.map(o => ({ 'id': o.id,'label':o.mc,'value': o.id }));
        setDakdata(daData);
      }else{
        setDakdata(response.data);
      }

  }
}

const onButtonClick =async (ids) => {
    if (ids.length != 1) {
      message.warning({ type: 'warning', content: '请选择一行数据' })
    } else {
      let repeson=await taskService.rule(ids[0]);
      message.success(repeson);
    }
};

const onResetClick =async (ids) => {
  if (ids.length != 1) {
    message.warning({ type: 'warning', content: '请选择一行数据' })
  } else {
    let repeson=await taskService.reset(ids[0]);
    message.success(repeson);
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{});
  }
};


const customForm = () => {
  return (
    <>
     <Form.Item label="调度中心调用规则:" name="taskExpr" required rules={[{ required: true, message: '请输入调度中心调用规则' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="名称:" name="taskName" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="抽检百分比:" name="taskPercentage" required initialValue={50}>
        <InputNumber  type="inline" step={10} name="taskPercentage"  min={1} max={100} style={{ width: 300 }}/>
      </Form.Item>
      <Form.Item label="开始时间:" name="taskBegindate" required rules={[{ required: true, message: '请请选择开始时间' }]}>
        <DatePicker   size="small"   name="taskBegindate"  style={{ width: 300 }}/>
      </Form.Item>
      <Form.Item label="结束时间:" name="taskEnddate" required rules={[{ required: true, message: '请选择结束时间' }]}>
        <DatePicker   size="small"   name="taskEnddate"  style={{ width: 300 }}/>
      </Form.Item>
      <Form.Item label="单位:" name="taskDwid"  required rules={[{ required: true, message: '请选择单位' }]}>
      <Select  placeholder="单位"  options={dwlist} style={{width:  300}} onChange={dwonChange}/>
      </Form.Item>
      <Form.Item label="档案库:" name="taskDakid" required rules={[{ required: true, message: '请选择档案库' }]}>
        <Select   placeholder="档案库"   options={dakData} style={{width:  300}}/>
      </Form.Item>
      <Form.Item label="年度:" name="taskNd">
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="保管期限:" name="taskBgqx" >
        <Input allowClear style={{ width: 300 }} />
      </Form.Item>
       <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: 300 }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
    </>
  )
}
  // 全局功能按钮
const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
        <Button type="primary" onClick={() => onButtonClick(ids)}>校验规则</Button>
        <Button type="primary" onClick={() => onResetClick(ids)}>生成巡检数据</Button>
      </>
    ])
}



  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {
  const queryDwList =  async (params) =>{
    let url="/api/api/arch/dw";
    const response =await fetch.get(url,params);
    if (response.status === 200) {
      if (response.data.length > 0) {
        let  mbData = response.data.map(item => ({ 'id': item.dwid, 'label': item.dwmc, 'value': item.dwid }));
        setDwlist(mbData);
      }else{
        setDwlist(response.data);
      }
    }
  }
  queryDwList({});
}, []);

  const source: EpsSource[] = [ {
      title: '任务号',
      code: 'id',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '名称',
      code: 'taskName',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '规则',
      code: 'taskExpr',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '开始时间',
      code: 'taskBegindate',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        moment.locale('zh-cn');
        return moment(text).format('L')
      }
    },{
      title: '结束时间',
      code: 'taskEnddate',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text) => {
        moment.locale('zh-cn');
        return moment(text).format('L')
      }
    }, {
      title: '执行状态',
      code: 'running',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '状态',
      code: 'taskStatus',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        switch (text) {
          case 0:
            return "未检测" ;
          case 1:
            return "检测完成";
          case 2:
            return "检测中";
          default:
            return '未检测';
        }
      }
    }]
  const title: ITitle = {
    name: '调度管理'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="名称" className="form-item" name="taskName" style={{ width: 200 }}><Input placeholder="请输入名称"  style={{ width: 200 }} /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={taskService}             // 右侧表格实现类，必填
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

export default Task;
