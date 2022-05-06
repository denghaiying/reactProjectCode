import React, { useEffect } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import IpAddressesService from '@/services/system/IpAddressesService';
import { EpsSource, ITable } from '@/eps/components/panel/EpsPanel2/EpsPanel3';
import { Form, Input, Select } from 'antd';
import IpAddressesStore from '../../../stores/system/IpAddressesStore';
const FormItem = Form.Item;


const tableProp: ITable = {
  tableSearch: false,
}



// 自定义表单

const customForm = () => {
  //自定义表单校验

  return (
    <>
      <Form.Item label="IP地址:" name="ipaddresses" required rules={[{ required: true, message: '请输入IP地址' }]}>
        <Input allowClear />
      </Form.Item>

      <Form.Item label="备注:" name="bz" >
        <Input.TextArea allowClear />
      </Form.Item>


      <Form.Item label="维护人:" name="whr" >
        <Input disabled defaultValue={IpAddressesStore.yhmc} />
      </Form.Item>

      <Form.Item label="维护时间:" name="whsj" >
        <Input defaultValue={IpAddressesStore.getDate} disabled />
      </Form.Item>

      <Form.Item name="whrid" >
        <Input defaultValue={IpAddressesStore.yhid} hidden />
      </Form.Item>
    </>
  )
}

function IpAddresses() {

  useEffect(() => {
    // SearchStore.queryDw();
    IpAddressesStore.queryForPage();
  }, []);

  const source: EpsSource[] = [{
    title: 'IP地址',
    code: 'ipaddresses',
    align: 'center',
    formType: EpsFormType.Input
  },
  {
    title: '备注',
    code: 'bz',
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
  }
  ]
  const title = {
    name: 'IP地址管理'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="IP地址" className="form-item" name="ipaddresses"><Input placeholder="请输入IP地址" /></FormItem >
      </>
    )
  }


  return (
    <div>
      <EpsPanel
        title={title}
        source={source}
       // treeService={IpAddressesService}
        tableProp={tableProp}
        searchForm={searchFrom}                  // 高级搜索组件，选填
        tableService={IpAddressesService}
        customForm={customForm}
      >
      </EpsPanel>
    </div>
  );
}

export default IpAddresses;
