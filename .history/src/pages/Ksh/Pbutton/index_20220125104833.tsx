import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import pbuttonService from './service/PbuttonService';
import { Form, Input, message,InputNumber, Radio, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import zsmkbjService from '../Zsmkbj/service/ZsmkbjService';

const yhmc = SysStore.getCurrentUser().yhmc;

const fsTypeData =[{value: '0', label: 'js脚本'},{value: '1', label: '跳转链接'}];
const dtTypeData =[{value: '0', label: '普通'},{value: '1', label: '旋转'},{value: '1', label: '闪烁'}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableCopy: true,
  searchCode: 'pbuttonmc'
}

const Pbutton = observer((props) => {

const [bzmklist, setBzmklist]= useState<Array<{id:string;label:string;value:string}>>([]);
const ref = useRef();

const _width=400;
const customForm = () => {
  return (
    <>
      <Form.Item label="名称:" name="pbuttonmc" required rules={[{ required: true, message: '请输入名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="图表名称:" name="pbuttonimg" required rules={[{ required: true, message: '请输入图表名称' }]}>
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="打开方式:" name="pbuttonfs" required rules={[{ required: true, message: '请选择打开方式' }]}>
        <Select   placeholder="打开方式"  options={fsTypeData} style={{width:  _width }}/>
      </Form.Item>
      <Form.Item label="图标效果:" name="pbuttonxg" required rules={[{ required: true, message: '请选择图标效果' }]}>
        <Select   placeholder="图标效果"  options={dtTypeData} style={{width:  _width }}/>
      </Form.Item>
        <Form.Item label="URL:" name="pbuttonurl">
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="脚本:" name="pbuttonjb" >
        <Input.TextArea  autoSize={{ minRows: 8, maxRows: 12 }}
              style={{width: _width }}/>
      </Form.Item>
        <Form.Item label="所属模块:" name="pbuttonzsmkbjid" required rules={[{ required: true, message: '请选择所属模块' }]}>
         <Select   placeholder="所属模块"  options={bzmklist} style={{width:  _width }}/>
      </Form.Item>
        <Form.Item label="序号:" name="pbuttonxh" >
           <InputNumber  type="inline" step={1}  name="zsmkxh"  min={0}  max={2000}  defaultValue={0} style={{ width: _width }} />
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(pbuttonService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }

 useEffect(() => {
    const queryBzmkList =  async () =>{
      if(tableStore){
        let url="/api/eps/ksh/zsmkbj/findList";
        const response =await fetch.post(url,{});
         if (response.status === 200) {
           debugger
          if (response.data?.length > 0) {
            let  SxData = response.data?.map(o => ({ 'id': o.id, 'label': o.zsmkbjmc, 'value': o.id }));
            setBzmklist(SxData);
          }else{
            setBzmklist(response.data);
          }
        }
        }
    }
    queryBzmkList();
  }, []);

  const source: EpsSource[] = [ {
      title: '名称',
      code: 'pbuttonmc',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '图表名称',
      code: 'pbuttonimg',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '打开方式',
      code: 'pbuttonfs',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let fslist=fsTypeData;
        let aa = fslist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },
       {
      title: 'URL',
      code: 'pbuttonurl',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '所属模块',
      code: 'pbuttonzsmkbjid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let xfglist=bzmklist;
        let aa = xfglist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },
     {
      title: '序号',
      code: 'pbuttonxh',
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
    name: '标注按钮'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="名称" className="form-item" name="pbuttonmc"><Input placeholder="请输入名称" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        treeService={zsmkbjService}                  // 左侧树 实现类，必填
        tableService={pbuttonService}             // 右侧表格实现类，必填
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

export default Pbutton;
