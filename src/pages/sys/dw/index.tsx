import React, { useEffect, useState } from 'react';
import { EpsPanel } from '@/eps/components/panel/EpsPanel2';
import DwTableLayout from '@/eps/business/DwTableLayout'
import EpsFormType from '@/eps/commons/EpsFormType';
import DwService  from '@/services/system/DwService';
import { EpsSource, ITable } from '@/eps/commons/declare';
import { Form, Input, Select, TreeSelect } from 'antd';
import DwStore from '../../../stores/system/DwStore';
import { observer } from 'mobx-react';
const Option = Select.Option;
const FormItem = Form.Item;


const tableProp: ITable = {
  tableSearch: false,
  disableCopy: true,
  onEditClick: (form) =>{}
}

const customForm = () => {
  //自定义表单校验
  const dagConfig = {
    rules: [{ required: true, message: '请选择' }],
  };
  return (
    <>
          <Form.Item label="上级单位:" name="fid">
            <TreeSelect style={{ width: 300 }}
              treeData={DwStore.dwTreeData}
              placeholder="请选择上级单位"
              treeDefaultExpandAll
              allowClear
            />
        </Form.Item>
          <Form.Item label="单位编号:"  name="dwbh" required rules={[{ required: true, message: '请输入编号' }, { max: 10, message: '编号长度不能大于10个字符', }]}>
            <Input allowClear  style={{width:300}}/>
          </Form.Item>
          <Form.Item label="单位名称:" name="dwname" required rules={[{ required: true, message: '请输入名称' }]}>
            <Input allowClear style={{width:300}}/>
          </Form.Item>

          <Form.Item label="全宗号:" name="qzh" required rules={[{ required: true, message: '请输入全宗号' }]}>
            <Input allowClear style={{width:300}}/>
          </Form.Item>
          <Form.Item label="档案馆:" name="dag"  initialValue="N">
            <Select style={{ width: 300, height: 30 }} id="dag"  placeholder="请选择">
              <Option value="N">否</Option>
              <Option value="Y">是</Option>
            </Select>
          </Form.Item>

          <Form.Item label="备注:" name="bz" >
            <Input.TextArea allowClear  showCount maxLength={400} style={{width:300}}/>
          </Form.Item>
          <Form.Item label="维护人:" name="whr" >
            <Input disabled defaultValue={DwStore.yhmc} style={{width:300}}/>
          </Form.Item>
          <Form.Item label="维护时间:" name="whsj" >
            <Input defaultValue={DwStore.getDate} disabled style={{width:300}}/>
          </Form.Item>
          <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item>
    </>
  )
}

const Dw = observer((props) => {


  const [initParams, setInitParams] = useState({})

  useEffect(() => {
    console.log("初始化++++")
    DwStore.queryTreeDwList();

  }, []);


  const source: EpsSource[] = [
    {
      title: '单位编号',
      code: 'dwbh',
      align: 'center',
      width: 130,
      formType: EpsFormType.Input
    }, {
      title: '单位名称',
      code: 'dwname',
      align: 'center',
      width: 650,
      formType: EpsFormType.Input
    }, {
      title: '全宗号',
      code: 'qzh',
      align: 'center',
      width: 130,
      formType: EpsFormType.Select
    },
    {
      title: '档案馆',
      code: 'dag',
      align: 'center',
      width: 130,
      formType: EpsFormType.Select,
      render: (text, record, index) => {
        return text == 'N' ? '否' : '是';
      }
    },
    {
      title: '备注',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '维护人',
      code: 'whr',
      align: 'center',
      width: 130,
      formType: EpsFormType.Input
    },
    {
      title: '维护时间',
      code: 'whsj',
      align: 'center',
      width: 130,
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '单位'
  }

  const searchFrom = () => {
    return (
      <>
        <FormItem label="单位编号" className="form-item" name="dwbh"><Input placeholder="请输入单位编号" /></FormItem >
        <FormItem label="单位名称" className="form-item" name="dwmc"><Input placeholder="请输入单位名称" /></FormItem >
      </>
    )
  }


  return (
    <>
      {
        <DwTableLayout
          title={title}                            // 组件标题，必填
          // ref={ref}
          source={source}                          // 组件元数据，必填
         // treeService={DwService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={DwService}                 // 右侧表格实现类，必填
          formWidth={500}
          initParams={initParams}
          tableRowClick={(record) => console.log('abcef', record)}
          searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        >
        </DwTableLayout>




      }
    </>
  );
})

export default Dw;
