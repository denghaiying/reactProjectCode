import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import EpsRecordPanel from '@/eps/components/panel/EpsRecordPanel';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITitle } from '@/eps/commons/declare';
import YhService from '@/services/system/yh/YhService';
import DwService from "@/services/system/DwService";
import { Table } from 'antd';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';

const columns = [
  {
    title: '登录号',
    dataIndex: 'bh',
    key: 'bh',
  },
  {
    title: '单位',
    dataIndex: 'dwmc',
    key: 'dwmc',
  },
  {
    title: '用户名称',
    dataIndex: 'yhmc',
    key: 'yhmc',
  },
]

const dwSource = [{
  title: '单位',
  code: 'dwmc',
  align: 'center',
  ellipsis: true,         // 字段过长自动东隐藏
  fixed: 'left',
  width: 200,
  formType: EpsFormType.Input
}, {
  title: '登录号',
  code: 'bh',
  align: 'center',
  width: 120,
  formType: EpsFormType.Input
}, {
  title: '用户名称',
  align: 'yhmc',
  code: 'yhmc',
  width: 120,
  ellipsis: true,
  formType: EpsFormType.Select,

}, {
  title: '性别',
  code: 'xb',
  align: 'center',
  width: 60,
  formType: EpsFormType.Input,
  render: (text, record, index) => {
      if(text) {
          return text == '1' ? '男' : '女';
      }else{
          return text = "未知";
      }

  }

}, {
  title: '任职部门',
  code: 'orgmc',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input
}, {
  title: "用户类型",
  code: 'lx',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input,

}, {
  title: "用户密级",
  code: "yhmj",
  align: 'center',
  width: 100,
  formType: EpsFormType.Input,
}, {
  title: "岗位",
  code: 'gw',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input
}, {
  title: "电子邮件",
  code: 'mail',
  align: 'center',
  formType: EpsFormType.Input,
  
  width: 140,
  /* defaultSortOrder: 'descend',
   sorter: (a, b) => a.bz - b.bz,*/
}, {
  title: "QQ",
  code: 'qq',
  align: 'center',
  
  width: 100,
  formType: EpsFormType.Input,
  /*  defaultSortOrder: 'descend',
    sorter: (a, b) => a.mc - b.mc,*/
}]

const source: EpsSource[] = [{
  title: '单位',
  code: 'dwmc',
  align: 'center',
  ellipsis: true,         // 字段过长自动东隐藏
  fixed: 'left',
  width: 200,
  formType: EpsFormType.Input
}, {
  title: '登录号',
  code: 'bh',
  align: 'center',
  width: 120,
  formType: EpsFormType.Input
}, {
  title: '用户名称',
  align: 'center',
  code: 'yhmc',
  width: 120,
  ellipsis: true,
  formType: EpsFormType.Select,

}, {
  title: '性别',
  code: 'xb',
  align: 'center',
  width: 60,
  formType: EpsFormType.Input,
  render: (text, record, index) => {
      if(text) {
          return text == '1' ? '男' : '女';
      }else{
          return text = "未知";
      }

  }

}, {
  title: '任职部门',
  code: 'orgmc',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input
}, {
  title: "用户类型",
  code: 'lx',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input

}, {
  title: "用户密级",
  code: "yhmj",
  align: 'center',
  width: 100,
  formType: EpsFormType.Input
}, {
  title: "岗位",
  code: 'gw',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input
}, {
  title: "电子邮件",
  code: 'mail',
  align: 'center',
  formType: EpsFormType.Input,
  width: 140,
  /* defaultSortOrder: 'descend',
   sorter: (a, b) => a.bz - b.bz,*/
}, {
  title: "QQ",
  code: 'qq',
  align: 'center',
  width: 100,
  formType: EpsFormType.Input,
  /*  defaultSortOrder: 'descend',
    sorter: (a, b) => a.mc - b.mc,*/
}, {
      title: "手机号码",
      code: "sjh",
      align: 'center',
      
      width: 100,
      formType: EpsFormType.Input,
      /*defaultSortOrder: 'descend',
      sorter: (a, b) => a.lx - b.lx,*/
}, {
      title: "固定电话",
      code: 'dh',
      align: 'center',
      
      width: 100,
      formType: EpsFormType.Input,
      /*defaultSortOrder: 'descend',
      sorter: (a, b) => a.url - b.url,*/
}, {
      title: "部职别",
      code: 'bzb',
      width: 100,
      align: 'center',
      formType: EpsFormType.Input,
      /* defaultSortOrder: 'descend',
       sorter: (a, b) => a.bz - b.bz,*/
}, {
      title: "启用日期",
      code: 'qyrq',
      align: 'center',
      width: 160,
      formType: EpsFormType.Input,
  //   format:"YYYY-MM-DD"
}, {
      title: "停用",
      code: "tymc",
      width: 60,
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
          return text == 'N' ? '启用' : '停用';
      }
}, {
      title: "停用日期",
      code: 'tyrq',
      width: 160,
      align: 'center',
      formType: EpsFormType.Input,
      /*defaultSortOrder: 'descend',
      sorter: (a, b) => a.url - b.url,*/
}, {
      title: "维护人",
      code: 'whr',
      width: 100,
      align: 'center',
      formType: EpsFormType.Input,
      /* defaultSortOrder: 'descend',
       sorter: (a, b) => a.whr - b.whr,*/
},{
  title: '维护时间',
  code: 'whsj',
  width: 160,
  align: 'center',
  formType: EpsFormType.None
}]

const title:ITitle = {
  name: '用户'
}

const tabs = [{
  name: '用户管理',
  key: 'yh',
  comp: (props) => {
    console.log('tab store :', props?.store)
    return (
      <Table columns={columns} dataSource={props.store?.tableList} bordered scroll={{ x: 1600 }} pagination={{
        showQuickJumper: true, 
        showSizeChanger: true, 
        defaultCurrent: props.store?.page, 
        defaultPageSize: props.store?.size, 
        pageSize: props.store?.size, 
        current: props.store?.page, 
        showTotal: (total, range) => `共 ${total} 条数据`,
        total: props.store?.total}}
        loading={props.store?.loading} 
        className="record-table"
        style={{height: '100%'}}
        onRow={record => {
          record = Object.assign({}, props.initParams || {}, record)
          return {
            onClick: event => {
              props.tableRowClick && props.tableRowClick(record)
            }, // 点击行
          };
        }}/>
      // <EpsPanel title={{name: '单位管理'}} tableService={DwService} source={dwSource}/>
    )
  }
}, {
  name: '测试',
  key: 'test',
  comp: (props) => (
    <div>Hello World</div>
  )
}]


const Dj3B= observer( (props) => {

  return (
    <EpsRecordPanel title={title} source={source} tableService={YhService} tabs={tabs} onTabChange={(value, store) => console.log('++++++++++++++++++', value, store.page)}/>
  );
})

export default Dj3B;
