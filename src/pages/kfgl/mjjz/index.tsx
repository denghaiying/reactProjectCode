import { useEffect, useState } from 'react';
import DwTableLayout from '@/eps/business/DwTableLayout'
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Select, TreeSelect } from 'antd';
import SysStore from '@/stores/system/SysStore';
import MjjzService from '@/services/kfgl/mjjz/MjjzService';
import {useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import DwStore from '../../../stores/system/DwStore';
const FormItem = Form.Item;


function mjjz() {

  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [initParams] = useState({});

  const title = {
    name: '密集架组'
  }

  const searchFrom = () => {
    return (
      <>
        <Form.Item label="所属库房:" name="kfid" >
            <Select className="ant-select" placeholder="请选择"  options={kfwhStore.kflist}  style={{ width: 300 }} />
        </Form.Item>
      </>
    )
  }

  useEffect(() => {
    kfwhStore.queryDwList();
    kfwhStore.querKfList();
    DwStore.queryTreeDwList();
  }, []);

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const kfwhStore = useLocalObservable(() => ({

    dwlist: [],
    kflist: [],

    async queryDwList() {
      const response = await fetch.get("/eps/control/main/dw/queryForListByYhid");
      if (response && response.status === 200) {
        this.dwlist = response.data;
      }
    },

    async querKfList() {
      const response = await fetch.get("/eps/control/main/mjjz/kf");
      if (response && response.status === 200) {
        this.kflist = response.data.map((item: { kfmc: any; id: any; }) => ({label: item.kfmc, value: item.id}));
      }
    },
  }));

  const customForm = (form: any) => {

    return (
      <>
        <Form.Item label="所属单位:" name="dwid" required rules={[{ required: true, message: '请选择单位' }]}>
            <TreeSelect style={{ width: 300 }}
              treeData={DwStore.dwTreeData}
              placeholder="请选择单位"
              treeDefaultExpandAll
              allowClear
            />
        </Form.Item>
        <Form.Item label="所属库房:" name="kfid" >
            <Select className="ant-select" placeholder="请选择库房"  options={kfwhStore.kflist}  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="组编号:" name="zh" required rules={[{ required: true, message: '请输入组编号' }]}>
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="组名称:" name="zname" required rules={[{ required: true, message: '请输入组名称' }]}>
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="序号:" name="xh" required rules={[{ required: true, message: '请输入序号' }]}>
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="x轴起始位置:" name="zx">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="y轴起始位置:" name="zy">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="z轴起始位置:" name="zr">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="x轴旋转角度:" name="dx">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="y轴旋转角度:" name="dy">
        <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="z轴旋转角度:" name="dz">
          <Input  style={{ width: 300 }} />
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
      title: '所属库房',
      code: 'kfid',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input,
      render: (text: string) => {
        const kflist = kfwhStore.kflist;
        for (var i = 0, l = kflist.length; i < l; i++) {
          const kf:any = kflist[i];
          if (kf.value == text) {
            return kf.label;
          }
        }
      }
    },
    {
      title: '单位',
      code: 'dwid',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input,
      render: (text: string) => {
        const dwlist = kfwhStore.dwlist;
        for (var i = 0, l = dwlist.length; i < l; i++) {
          const dw:any = dwlist[i];
          if (dw.id == text) {
            return dw.mc;
          }
        }
      }
    },
    {
      title: '组编号',
      code: 'zh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '组名称',
      code: 'zname',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '序号',
      code: 'xh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: 'z轴起始位置',
      code: 'zr',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: 'x轴起始位置',
      code: 'zx',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: 'y轴起始位置',
      code: 'zy',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: 'x轴旋转角度',
      code: 'dx',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: 'y轴旋转角度',
      code: 'dy',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: 'z轴旋转角度',
      code: 'dz',
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
    <DwTableLayout
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={MjjzService}                 // 右侧表格实现类，必填
      formWidth={500}
      initParams={initParams}
      tableRowClick={(record) => console.log('abcef', record)}
      customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
      searchForm={searchFrom}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </DwTableLayout>
  );
}

export default mjjz;
