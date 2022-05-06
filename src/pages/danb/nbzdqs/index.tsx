import { useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import NbzdqsService from '@/services/danb/nbzdqs/NbzdqsService';
import SysStore from '@/stores/system/SysStore';
import { Form, Input, Select } from 'antd';
import moment from 'moment';
import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import {ImportOutlined} from "@ant-design/icons";

function nbzdqs() {
  const [initParams] = useState({});
  const ref = useRef();
  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const title = {
    name: '年报自动取数'
  }

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const customForm = (form: any) => {
    return (
      <>
        <Form.Item label="名称:" name="mc">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="年报类型:" name="lx" >
          <Select className="ant-select"  placeholder="请选择年报类型" style={{ width: 300 }}>
              <option value="dj2b">档基2表</option>
              <option value="dj3b">档基3表</option>
          </Select>
        </Form.Item>
        <Form.Item label="维护人:" name="whr" >
          <Input disabled defaultValue={yhmc} style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="维护时间:" name="whsj" >
          <Input disabled defaultValue={getDate} style={{ width: 300 }} />
        </Form.Item>
      </>
    )
  }

  const source: EpsSource[] = [
    {
      title: '名称',
      code: 'mc',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '年报类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string) => {
        if (text=="dj2b"){
            return "档基2表";
        } else if (text=="dj3b"){
            return "档基3表";
        } else {
            return
        }
      }
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

  const customAction = (store: any) => {
    return getCustomAction(store);
  }

  const getCustomAction = (store: any) => {
    let res: Array<any> = []
    res.push(<EpsModalButton name="取数设置" title="取数设置" width={1200} useIframe={true}  url={'/api/eps/control/main/nbzdqs/danbnr'}  icon={<ImportOutlined />}/>);
    return (<>
      {[res]}
    </>)
  }

  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={NbzdqsService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      customForm={customForm}
      tableRowClick={(record) => console.log('abcef', record)}
      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default nbzdqs;