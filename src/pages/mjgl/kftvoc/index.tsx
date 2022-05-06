import { useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import KftvocService from '@/services/mjgl/kftvoc/KftvocService';
import { DatePicker, Form, Input } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

function kftvoc() {

  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: 'TVOC'
  }

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
    disableAdd: true,
    disableDelete: true,
    disableEdit: true,
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="设备编号:" name="sbbh" ><Input  placeholder="请输入设备编号" style={{ width: 300 }}/></FormItem>
        <FormItem label="IP:" name="ip" ><Input  placeholder="请输入ip" style={{ width: 300 }}/></FormItem>
        <FormItem label="TVOC:" name="tvoc" ><Input  placeholder="请输入TVOC数值" style={{ width: 300 }}/></FormItem>
        <FormItem label="起始时间:" name="staDate" >
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} style={{ width: 300 }}/>
        </FormItem>
        <FormItem label="结束时间:" name="endDate" >
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} style={{ width: 300 }}/>
        </FormItem>
      </>
    )
  }

  const source: EpsSource[] = [
    {
      title: '设备编号',
      code: 'sbbh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: 'IP',
      code: 'ip',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '时间',
      code: 'sj',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: 'TVOC',
      code: 'tvoc',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]

  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={KftvocService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
    >
    </EpsPanel>
  );
}

export default kftvoc;