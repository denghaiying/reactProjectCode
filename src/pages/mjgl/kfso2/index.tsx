import { useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import Kfso2Service from '@/services/mjgl/kfso2/Kfso2Service';
import { DatePicker, Form, Input } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

function kfso2() {

  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: 'SO2'
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
        <FormItem label="SO2:" name="so2" ><Input  placeholder="请输入SO2数值" style={{ width: 300 }}/></FormItem>
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
      title: 'SO2',
      code: 'so2',
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
      tableService={Kfso2Service}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
    >
    </EpsPanel>
  );
}

export default kfso2;
