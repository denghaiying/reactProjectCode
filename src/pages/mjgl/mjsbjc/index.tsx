import { useState, useRef, useEffect } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import MjsbjcService from '@/services/mjgl/mjsbjc/MjsbjcService';
import { DatePicker, Form, Input, Select, TreeSelect } from 'antd';
import DwStore from '../../../stores/system/DwStore';
import moment from 'moment';
const FormItem = Form.Item;

function mjsbjc() {

  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: '门禁设备进出'
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
       <Form.Item label="单位:" name="dwid">
            <TreeSelect style={{ width: 300 }}
              treeData={DwStore.dwTreeData}
              placeholder="请选择单位"
              treeDefaultExpandAll
              allowClear
            />
        </Form.Item>
        <Form.Item label="进出状态:" name="jcbz" >
          <Select className="ant-select"  placeholder="请选择进出状态" style={{ width: 300 }}>
            <option value="">全部</option>
            <option value="0">进</option>
            <option value="1">出</option>
          </Select>
        </Form.Item>
        <FormItem label="设备编号:" name="mjsbbh" ><Input  placeholder="请输入设备编号" style={{ width: 300 }}/></FormItem>
        <FormItem label="IP:" name="ip" ><Input  placeholder="请输入ip" style={{ width: 300 }}/></FormItem>
        <FormItem label="起始时间:" name="staDate" >
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} style={{ width: 300 }}/>
        </FormItem>
        <FormItem label="结束时间:" name="endDate" >
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} style={{ width: 300 }}/>
        </FormItem>
      </>
    )
  }

  useEffect(() => {
    DwStore.queryTreeDwList();
  }, []);

  const source: EpsSource[] = [
    {
      title: '单位名称',
      code: 'dwmc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '设备编号',
      code: 'mjsbbh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '设备名称',
      code: 'mjsbmc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '进出标志',
      code: 'jcbz',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string) => {
        if (text === "0") {
          return "进";
        } else {
          return "出";
        }
      }
    },
    {
      title: '进出时间',
      code: 'jcsj',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: 'IP地址',
      code: 'ip',
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
      tableService={MjsbjcService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      searchForm={searchFrom}
    >
    </EpsPanel>
  );
}

export default mjsbjc;
