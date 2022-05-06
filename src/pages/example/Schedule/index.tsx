/*
import React from 'react';
import {EpsPanel, EpsTableStore} from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';

import MkService from '@/services/example/gn';

import FuncService from '@/services/example/func'
import { ITable } from '@/eps/components/panel/EpsPanel2/EpsPanel';
import { Button, Form, Input, message, Select, Table } from 'antd';
const { Option } = Select;

//import './index.less'

const tableProp: ITable = {
  tableSearch: true,
  disableAdd: false
}

// 自定义功能按钮
const customAction = (store: EpsTableStore) => {
  return (<><Button style={{marginRight: '10px'}}>打印</Button><Button style={{marginRight: '10px'}}>导出</Button><Button style={{marginRight: '10px'}}>导入</Button></>)
}

// 自定义表格行按钮
const customTableAction = (text, record, index, store:EpsTableStore) => {
  return (<><img src={require('../../../styles/assets/img/hall-regist/icon_shanchu.png')} alt="" style={{width: 22, margin: '0 7px'}} onClick={() => message.info(record.id)}/>
  <img src={require('../../../styles/assets/img/hall-regist/icon_shanchu.png')} alt="" style={{width: 22, margin: '0 7px'}} onClick={() => message.success(record.mc)}/></>)
}

// 自定义表单
const customForm = () => {
  return (
    <>
    <Form.Item label="功能编号" key='mkbh'
            name='mkbh'><Input ></Input>
    </Form.Item>
    <Form.Item label="功能名称" key='mc'
        name='mc'><Input ></Input>
    </Form.Item>
    <Form.Item label="类型" key='lx' name='lx'>
      <Select  style={{ width: 120 }} allowClear>
        <Option value="F">功能</Option>
        <Option value="K">其他</Option>
        <Option value="I">菜单</Option>
      </Select>
    </Form.Item>
    <Form.Item label="url" key='url'
        name='url'><Input ></Input>
    </Form.Item>
    <Form.Item label="维护人" key='whr'
        name='whr'><Input ></Input>
    </Form.Item>
    </>
  )
}

function Schedule() {

  const source = [{
    title: '功能编号',
    code: 'mkbh',
    align: 'center',
    formType: EpsFormType.Input
  },{
    title: '功能名称',
    code: 'mc',
    align: 'center',
    formType: EpsFormType.Input
  },{
    title: '类型',
    align: 'center',
    code: 'lx',
    formType: EpsFormType.Select,
    render: (text, record, index) => {
      return text == 'F' ? '功能' : '其他';
    }
  },{
    title: 'url',
    code: 'url',
    align: 'center',
    formType: EpsFormType.Input
  },{
    title: '维护人',
    code: 'whr',
    align: 'center',
    formType: EpsFormType.Input
  },{
    title: '维护时间',
    code: 'whsj',
    align: 'center',
    formType: EpsFormType.None
  }]

  const title = {
    name: '功能信息'
  }

  const customTableAction = () => {

  }

  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '3',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '4',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '5',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '6',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '19',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '20',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '7',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '8',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '9',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '10',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '11',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '12',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '11',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '12',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '11',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '12',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '13',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '14',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '15',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '16',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
    {
      key: '17',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '18',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];
  
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
      <EpsPanel treeSearch={true} 
                title={title} 
                source={source} 
                treeService={MkService} 
                tableProp={tableProp} 
                tableService={FuncService}
                customForm={customForm}
                customAction={customAction}>
      </EpsPanel>
      // <div className="office-manage">
      //   <div className="main-content">
      //     <div className="left-tree">
      //       <Table dataSource={dataSource} columns={columns} className="collapse-tree"/>
      //     </div>
      //   </div>
      // </div>
  );
}

export default Schedule;
*/
