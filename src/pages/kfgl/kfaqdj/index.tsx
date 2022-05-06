import { useEffect, useState, useRef } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { DatePicker, Form, Input, Select } from 'antd';
import SysStore from '@/stores/system/SysStore';
import KfaqdjService from '@/services/kfgl/kfaqdj/KfaqdjService';
import {useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
import moment from 'moment';


function kfaqdj() {

  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [initParams] = useState({});
  const ref = useRef();

  const title = {
    name: '库房安全登记'
  }

  useEffect(() => {
    kfaqdjStore.querySjzdmxCLCS();
  }, []);

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const kfaqdjStore = useLocalObservable(() => ({

    clcslist: [],

    async querySjzdmxCLCS() {
      const response = await fetch.get("/eps/control/main/sjzdmx/querySjzdmxBySjzd?bh=CLCS");
      if (response && response.status === 200) {
        this.clcslist = response.data.map((item: { mc: any; }) => ({label: item.mc, value: item.mc}));
      }
    },
  }));

  const customForm = (form: any) => {

    const options = [
      { label: "遗失", value: "遗失"}, 
      { label: "找回", value: "找回"},
      { label: "修复", value: "修复"}, 
      { label: "脆黄", value: "脆黄"}, 
      { label: "损坏", value: "损坏"},
      { label: "虫蛀", value: "虫蛀"}, 
      { label: "霉变", value: "霉变"}, 
      { label: "其它", value: "其它"}
    ];

    return (
      <>
        <Form.Item label="检查日期:" name="jcrqValue">
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} style={{ width: 300 }}/>
        </Form.Item>
        <Form.Item label="检查人:" name="jcr">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="档号:" name="dh">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="状态:" name="zt">
          <Select className="ant-select"  placeholder="请选择" options={options}  style={{width:  300}}/>
        </Form.Item>
        <Form.Item label="处理措施:" name="cs" >
          <Select className="ant-select"  placeholder="请选择" options={kfaqdjStore.clcslist}  style={{width:  300}}/>
        </Form.Item>
        <Form.Item label="备注:" name="bz">
          <Input.TextArea allowClear  showCount maxLength={400} style={{width:300}}/>
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
      title: '检查日期',
      code: 'jcrq',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '检查人',
      code: 'jcr',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '档号',
      code: 'dh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '状态',
      code: 'zt',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '处理措施',
      code: 'cs',
      align: 'center',
      formType: EpsFormType.Input
    }, {
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

  return (
    <EpsPanel
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      ref={ref}
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={KfaqdjService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
}

export default kfaqdj;