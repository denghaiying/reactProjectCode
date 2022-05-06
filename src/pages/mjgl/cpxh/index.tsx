import { useEffect, useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Select } from 'antd';
import CpxhService from '@/services/mjgl/cpxh/CpxhService';
import {useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";

const FormItem = Form.Item;

function cpxh() {

  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: '产品型号'
  }

  useEffect(() => {
    cpxhStore.querySblx();
  }, []);

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const cpxhStore = useLocalObservable(() => ({
    sblist: [],
    async querySblx() {
      const response = await fetch.get("/eps/control/main/cpxh/queryForCpList");
      if (response && response.status === 200) {
        this.sblist = response.data.map((item: { bh: any; mc: any; }) => ({label: item.mc, value: item.bh}));
      }
    },
  }));

  const searchFrom = () => {
    return (
      <>
        <FormItem label="设备类型" className="form-item" name="cpbh"><Input placeholder="请输入设备类型" /></FormItem >
        <FormItem label="产品型号" className="form-item" name="bh"><Input placeholder="请输入产品型号" /></FormItem >
        <FormItem label="产品名称" className="form-item" name="mc"><Input placeholder="请输入产品名称" /></FormItem >
      </>
    )
  }

  const customForm = (form: any) => {
    return (
      <>
        <Form.Item label="设备类型:" name="cpbh"  required rules={[{ required: true, message: '请选择类型' }]}>
          <Select className="ant-select"  placeholder="选择设备"  options={cpxhStore.sblist}  style={{width:  300}}/>
        </Form.Item>
        <Form.Item label="产品型号:" name="bh">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="产品名称:" name="mc">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="备注:" name="bz">
          <Input.TextArea allowClear  showCount maxLength={400} style={{width:300}}/>
        </Form.Item>
      </>
    )
  }

  const source: EpsSource[] = [
    {
      title: '设备类型编号',
      code: 'cpbh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '设备类型名称',
      code: 'cpmc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '产品型号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '产品名称',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '备注',
      code: 'bz',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]

  return (
    <EpsPanel
      title={title}
      source={source}
      ref={ref}
      tableProp={tableProp}
      tableService={CpxhService}
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
      customForm={customForm}
    >
    </EpsPanel>
  );
}

export default cpxh;
