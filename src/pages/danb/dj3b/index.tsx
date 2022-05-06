import { useState, useRef, useEffect } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import Dj3bService from '@/services/danb/dj3b/Dj3bService';
import SysStore from '@/stores/system/SysStore';
import { Form, Input, Select, TreeSelect } from 'antd';
import moment from 'moment';
import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import {ImportOutlined} from "@ant-design/icons";
import {useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
import DwStore from '../../../stores/system/DwStore';

function dj3b() {
  debugger
  const [initParams] = useState({});
  const ref = useRef();
  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const title = {
    name: '档基3表'
  }

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const dj3bStore = useLocalObservable(() => ({

    dwlist: [],

    async queryDwList() {
      const response = await fetch.get("/eps/control/main/dw/queryForListByYhid");
      if (response && response.status === 200) {
        this.dwlist = response.data;
      }
    },
  }));

  useEffect(() => {
    dj3bStore.queryDwList();
  }, []);

  const customForm = (form: any) => {
    return (
      <>
        <Form.Item label="年度:" name="nd">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="单位:" name="dwid" required rules={[{ required: true, message: '请选择单位' }]}> 
            <TreeSelect style={{ width: 300 }}
              treeData={DwStore.dwTreeData}
              placeholder="请选择单位"
              treeDefaultExpandAll
              allowClear
            />
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
      title: '年度',
      code: 'nd',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '单位',
      code: 'dwid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text: string) => {
        const dwlist = dj3bStore.dwlist;
        for (var i = 0, l = dwlist.length; i < l; i++) {
          const dw:any = dwlist[i];
          if (dw.id == text) {
            return dw.mc;
          }
        }
      }
    },
    {
      title: '待处理人',
      code: 'wfawaiter',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '已处理人',
      code: 'wfhandler',
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

  const customAction = (store: any) => {
    return getCustomAction(store);
  }

  const getCustomAction = (store: any) => {
    let res: Array<any> = []
    res.push(<EpsModalButton name="填写年报" title="填写年报" width={1200} useIframe={true}  url={'/api/eps/control/main/danb/danbnr'} 
    params={{ hasEditQx: true, sr: "选择的一条记录"}} icon={<ImportOutlined />}/>);
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
      tableService={Dj3bService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      customForm={customForm}
      tableRowClick={(record) => console.log('abcef', record)}
      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default dj3b;