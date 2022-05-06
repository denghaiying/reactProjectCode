import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import asipPackageService from './service/AsipPackageService';
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


const AsipPackage = observer((props) => {
const ref = useRef();

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  searchCode: 'tm',
  rowSelection:{
    type:'radio'
  }
 
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(asipPackageService));

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
      title: '单位',
      code: 'dwmc',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '档案库名称',
      code: 'dakmc',
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
      title: '格式描述',
      code: 'gsms',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '版本',
      code: 'bb',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '类型',
      code: 'lx',
      align: 'center',
      formType: EpsFormType.Input
    },
     {
      title: '类型描述',
      code: 'lxms',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '打包时间',
      code: 'dbsj',
      align: 'center',
      formType: EpsFormType.Input
    }]
    
  const title: ITitle = {
    name: 'AIP包管理'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="题名" className="form-item" name="tm"><Input placeholder="请输入题名" /></Form.Item >
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={asipPackageService}             // 右侧表格实现类，必填
        ref={ref}
        setCheckRows={props.checkrow}                                // 获取组件实例，选填
        formWidth={500}
        tableRowClick={(record) => console.log('abcef', record)}
        searchCode="tm"
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
      >
      </EpsPanel>
    </>
  );
})

export default AsipPackage;
