import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import sxjcjgLogService from './service/SxjcjgLogService';
import xysjsxService from '@/services/perfortest/XysjsxService';
import { Form, Input, message, InputNumber, Select, Button} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import { history } from 'umi';
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableEdit: true,         // 是否禁用编辑
  disableDelete: true,        // 是否禁用删除
  disableIndex: true,         // 是否使用索引列
  disableAdd: true,          // 是否使用新增
  disableCopy: true,
  tableSearch: false,
}



const sxjcjgLog = observer((props) => {

const ref = useRef();
const _width = 400;
const [lxlist, setLxlist]= useState<Array<{id:string;label:string;value:string}>>([]);

  // 创建右侧表格Store实例
const [tableStore] = useState<EpsTableStore>(new EpsTableStore(sxjcjgLogService));

useEffect(() => {
    //YhStore.queryForPage();
}, []);

const returnSy = () => {
    history.push("/runRFunc/sxjcsxsz");
};

const customForm = (form) => {
  return (
    <>

      <Form.Item label="检测名称:" name="sxjcjcszname" value={kyxdata}  required rules={[{ required: true, message: '请选择检测名称' }]}>
        <Select   placeholder="请选择检测名称"   options={kyxdata} style={{width: _width}}/>
      </Form.Item>
      <Form.Item label="检测编号:" name="sxjcjcszbh">
        <Input  style={{ width: _width }} />
      </Form.Item>
       <Form.Item label="属性类型:" name="sxjcjcszfl" required rules={[{ required: true, message: '请选择属性类型' }]}>
         <Select   placeholder="请选择属性类型"   options={zsxflData} style={{width:  _width}}/>
      </Form.Item>
      <Form.Item label="属性数值:" name="sxjcjcszz">
        <Input allowClear style={{ width: _width }} />
      </Form.Item>
      <Form.Item label="备注:" name="sxjcjcszbz" >
        <Input.TextArea  autoSize={{ minRows: 3, maxRows: 5 }}
              style={{width: _width }}/>
      </Form.Item>
      <Form.Item label="维护时间:" name="whsj"  initialValue={getDate}>
        <Input disabled style={{ width: _width }} />
      </Form.Item>

     <Form.Item label="类型:" name="sxjcjcszlx"  initialValue='安全性'  hidden>
          <Input name="sxjcjcszlx" disabled style={{ width: _width }}  />
        </Form.Item>
      {/* <Form.Item name="whrid" >
            <Input defaultValue={DwStore.yhid} hidden  style={{width:300}}/>
          </Form.Item> */}
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <>
      </>
    ])
  }


  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }


  const source: EpsSource[] = [{
      title: '真实性检测结果',
      code: 'sxjcjcLogjczsjg',
      align: 'center',
      formType: EpsFormType.Input
    }, 
    {
      title: '完整性检测结果',
      code: 'sxjcjcLogjcwzjg',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '可靠性检测结果',
      code: 'sxjcjcLogjckkjg',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '可用性检测结果',
      code: 'sxjcjcLogjckyjg',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '检测结果',
      code: 'sxjcjcLogjcsjh',
      align: 'center',
      formType: EpsFormType.Input
    }]
  const title: ITitle = {
    name: '检测详情'
  }


  const searchFrom = () => {
    return (
      <>
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={sxjcjgLogService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={700}
        initParams={{'jgmxid':props.jgmxid}}           //默认参数
        tableRowClick={(record) => console.log('abcef', record)}
       // searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default sxjcjgLog;
