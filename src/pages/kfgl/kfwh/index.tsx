import { useEffect, useState } from 'react';
import DwTableLayout from '@/eps/business/DwTableLayout'
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, TreeSelect } from 'antd';
import SysStore from '@/stores/system/SysStore';
import KfwhService from '@/services/kfgl/kfwh/KfwhService';
import {useLocalObservable } from 'mobx-react';
import fetch from "../../../utils/fetch";
import moment from 'moment';
const FormItem = Form.Item;
import DwStore from '../../../stores/system/DwStore';


function kfwh() {

  const yhmc = SysStore.getCurrentUser().yhmc+"";
  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const [initParams] = useState({});

  const title = {
    name: '库房维护'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="库房编号" className="form-item" name="cx_kfbh"><Input placeholder="请输入库房编号" /></FormItem >
        <FormItem label="库房名称" className="form-item" name="cx_kfmc"><Input placeholder="请输入库房名称" /></FormItem >
      </>
    )
  }

  useEffect(() => {
    kfwhStore.queryDwList();
    DwStore.queryTreeDwList();
  }, []);

  const tableProp: ITable = {
    tableSearch: false,
    disableCopy: true,
  }

  const kfwhStore = useLocalObservable(() => ({

    dwlist: [],

    async queryDwList() {
      const response = await fetch.get("/eps/control/main/dw/queryForListByYhid");
      if (response && response.status === 200) {
        this.dwlist = response.data;
      }
    },
  }));

  const customForm = (form: any) => {

    return (
      <>
        <Form.Item label="单位:" name="dwid" required rules={[{ required: true, message: '请选择单位' }]}>
            <TreeSelect style={{ width: 300 }}
              treeData={DwStore.dwTreeData}
              placeholder="请选择单位"
              treeDefaultExpandAll
              allowClear
            />
        </Form.Item>
        <Form.Item label="库房编号:" name="kfbh" required rules={[{ required: true, message: '请输入库房编号' }]}>
          <Input placeholder="请输入库房编号" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="库房名称:" name="kfmc" required rules={[{ required: true, message: '请输入库房名称' }]}>
          <Input placeholder="请输入库房名称" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="库房长:" name="kfc">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="库房宽:" name="kfk">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="库房高:" name="kfg">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="楼层号:" name="lch">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="序号:" name="xh">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="建筑面积:" name="jzmj">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="贴图类型:" name="ttlx">
          <Input  style={{ width: 300 }} />
        </Form.Item>
        <Form.Item label="备注:" name="bz">
          <Input.TextArea allowClear  showCount maxLength={400} style={{width:300}}/>
        </Form.Item>
        <Form.Item label="功能OPT:" name="gnopt">
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
      title: '库房编号',
      code: 'kfbh',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '库房名称',
      code: 'kfmc',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input
    }, {
      title: '库房长',
      code: 'kfc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '库房宽',
      code: 'kfk',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '库房高',
      code: 'kfg',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '楼层高',
      code: 'lch',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '序号',
      code: 'xh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '建筑面积',
      code: 'jzmj',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '贴图类型',
      code: 'ttlx',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '备注',
      code: 'bz',
      align: 'center',
      width: 200,
      formType: EpsFormType.Input
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      width: 100,
      formType: EpsFormType.Input
    }
  ]

  return (
    <DwTableLayout
      title={title}                            // 组件标题，必填
      source={source}                          // 组件元数据，必填
      tableProp={tableProp}                    // 右侧表格设置属性，选填
      tableService={KfwhService}                 // 右侧表格实现类，必填
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

export default kfwh;
