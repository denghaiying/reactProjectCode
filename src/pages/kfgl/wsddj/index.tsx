import { useEffect, useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { DatePicker, Form, Input, Select } from 'antd';
import SysStore from '@/stores/system/SysStore';
import WsddjService from '@/services/kfgl/wsddj/WsddjService';
import {useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
import moment from 'moment';

import EpsModalButton from "@/eps/components/buttons/EpsModalButton";
import {ImportOutlined} from "@ant-design/icons";


function wsddj() {

  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const dwid = SysStore.getCurrentUser().dwid;
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: '温湿度登记'
  }

  useEffect(() => {
    wsddjStore.queryKfmc();
  }, []);

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const wsddjStore = useLocalObservable(() => ({

    kfmclist: [],

    async queryKfmc() {
      const response = await fetch.get("/eps/control/main/mjjz/kf?dwid=" + dwid);
      if (response && response.status === 200) {
        this.kfmclist = response.data.map((item: { kfmc: any; id: any; }) => ({label: item.kfmc, value: item.id}));
      }
    },
  }));

  const customForm = (form: any) => {

    const onBlurWd = () => {
      const valueWd = form.getFieldValue('wd');
      if (Number.parseInt(valueWd) >= 14 && Number.parseInt(valueWd) <= 24) {
        form.setFieldsValue({ 'wdbhsfhl': "合理" });
      } else {
        form.setFieldsValue({ 'wdbhsfhl': "不合理" });
      }
    };

    const onBlurSd = () => {
      const valueSd = form.getFieldValue('sd');
      if (Number.parseInt(valueSd) >= 45 && Number.parseInt(valueSd) <= 60) {
        form.setFieldsValue({ 'sdbhsfhl': "合理" });
      } else {
        form.setFieldsValue({ 'sdbhsfhl': "不合理" });
      }
    };

    form.setFieldsValue({ 'wdbhfw': "14～24℃%" });
    form.setFieldsValue({ 'sdbhfw': "45～60%" });

    const selectKf = async () => {
      const value = form.getFieldValue('kfid');
      const response = await fetch.post("/eps/control/main/kfwh/queryForId?id=" + value);
      if (response && response.status === 200) {
        form.setFieldsValue({ 'kfmc': response.data.kfmc });
      }
    }

    return (
      <>
        <Form.Item label="天气:" name="tq">
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="检查日期:" name="jcrqValue">
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} style={{ width: 300 }}/>
        </Form.Item>
        <Form.Item label="温度:" name="wd" required rules={[{ required: true, message: '请输入温度' }]}>
          <Input onBlur={onBlurWd} style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="温度变化范围:" name="wdbhfw">
          <Input disabled defaultValue={"14～24℃"}  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="温度变化是否合理:" name="wdbhsfhl">
          <Input disabled style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="湿度:" name="sd" required rules={[{ required: true, message: '请输入湿度' }]}>
          <Input onBlur={onBlurSd} style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="湿度变化范围:" name="sdbhfw">
          <Input disabled defaultValue={"45～60%"}  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="湿度变化是否合理:" name="sdbhsfhl">
          <Input disabled style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="库房管理员:" name="kfgly">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="措施:" name="cs">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="库房名称:" name="kfid" >
          <Select className="ant-select"  placeholder="选择库房" onChange={selectKf}  options={wsddjStore.kfmclist}  style={{width:  300}}/>
        </Form.Item>
        <Form.Item label="库房ID:" name="kfmc" hidden >
          <Input style={{ width: 300 }} />
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
      title: '天气',
      code: 'tq',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '检查日期',
      code: 'jcrq',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '温度',
      code: 'wd',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '温度变化范围',
      code: 'wdbhfw',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '温度变化是否合理',
      code: 'wdbhsfhl',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '湿度',
      code: 'sd',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '湿度变化范围',
      code: 'sdbhfw',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '湿度变化是否合理',
      code: 'sdbhsfhl',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '库房管理员',
      code: 'kfgly',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '处理措施',
      code: 'cs',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '库房名称',
      code: 'kfmc',
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
    debugger
    // let res: Array<any> = []
    // //res.push(<EpsReportButton store={store} umid={umid} reportDataSetNames ={["GRID_MASTER","GRID_SLAVE"]} baseQueryMethod={"/api/eps/control/main/yh/queryForPage"} datilQueryMethod={"/api/eps/control/main/yh/queryForPage"} queryparams ={""} fields={getColumsetslist()} datilfields={getColumsetslist()}/>);
    // res.push(<EpsModalButton name="导入" title="导入" width={1200} useIframe={true}  url={''}  icon={<ImportOutlined />}/>);
    // return (<>
    //   {[res]}
    // </>)
  }

  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={WsddjService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default wsddj;
