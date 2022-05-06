import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import inspectionService from './service/InspectionService';
import { Form, Input, message, InputNumber, Select} from 'antd';
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


const Inspection = observer((props) => {
const ref = useRef();

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  tableSearch: true,
  disableCopy: true,
  searchCode: 'taskName',
 
}

const customForm = () => {
  return (
    <>
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(inspectionService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {

}, []);

  const source: EpsSource[] = [ {
      title: '所属任务',
      code: 'taskName',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '批次号',
      code: 'batch',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '题名',
      code: 'tm',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '年度',
      code: 'nd',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '保管期限',
      code: 'bgqx',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '上传日期',
      code: 'uploaddate',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '状态',
      code: 'status',
      align: 'center',
      formType: EpsFormType.Input,   
      render: (text, record, index) => {
        switch (text) {
          case 0:
            return "未检测" ;
          case 1:
            return "检测完成";
          case 2:
              return "检测失败";
          case 3:
            return "检测中";
          default:
            return '未检测';
        }
        },
    },{
      title: '结果',
      code: 'result',
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
    name: '巡检结果'
  }


  const searchFrom = () => {
    return (
      <>
       <Form.Item label="提名" className="form-item" name="tm"><Input placeholder="请输入提名" /></Form.Item >
       <Form.Item label="提名" hidden className="form-item" name="nd"><Input placeholder="请输入提名" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={inspectionService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={500}
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

export default Inspection;
