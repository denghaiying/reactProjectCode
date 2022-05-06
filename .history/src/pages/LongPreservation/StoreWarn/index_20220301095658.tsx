import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import storeWarnService from './service/StoreWarnService';
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


const StoreWarn = observer((props) => {
const ref = useRef();

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',

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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(storeWarnService));

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
      title: '名称',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '盘符',
      code: 'driver',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '磁盘总容量(G)',
      code: 'capacity',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: 'IP',
      code: 'ip',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '容量占比(%)',
      code: 'capacityraito',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '告警信息',
      code: 'message',
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
    name: '存储预警'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="名称" className="form-item" name="name"><Input placeholder="请输入名称" /></Form.Item >
        <Form.Item label="名称" hidden className="form-item" name="driver"><Input placeholder="请输入名称" /></Form.Item >

      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={storeWarnService}             // 右侧表格实现类，必填
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

export default StoreWarn;
