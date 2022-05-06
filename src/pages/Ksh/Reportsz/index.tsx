import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import reportszService from './service/ReportszService';
import { Form, Input, message,InputNumber, Radio, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'zsmkmc',
  onAddClick:(form) =>{
    form.setFieldsValue({ zsmkxh: 1 });
  },
}

const Reportsz = observer((props) => {

const [fglist, setFglist]= useState<Array<{id:string;label:string;value:string}>>([]);
const ref = useRef();

const _width=400;
const customForm = () => {
  return (
    <>
      <Form.Item label="编号:" name="reportszbh" required rules={[{ required: true, message: '请输入菜单编号' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="名称:" name="reportszmc" required rules={[{ required: true, message: '请输入菜单名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
        <Form.Item label="URL:" name="reportszurl" required rules={[{ required: true, message: '请输入URL' }]}>
         <Input allowClear style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="维护人:" name="whr" initialValue={yhmc}>
        <Input disabled  style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: _width }} />
      </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
    return ([
      <>
      </>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(reportszService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
 useEffect(() => {

    //YhStore.queryForPage();
  }, []);

  const source: EpsSource[] = [ {
      title: '编号',
      code: 'reportszbh',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '名称',
      code: 'reportszmc',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: 'URL',
      code: 'reportszurl',
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
    }]
  const title: ITitle = {
    name: '报表设置'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="编号" className="form-item" name="zsmkbh"><Input placeholder="请输入编号" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="zsmkmc"><Input placeholder="请输入名称" /></Form.Item >
        
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={reportszService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={640}
        tableRowClick={(record) => console.log('abcef', record)}
        searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default Reportsz;
