import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import eepMetaJnService from './service/EepMetaJnService';
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


const EepMetaJn = observer((props) => {
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(eepMetaJnService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {
  const tableStores = ref.current?.getTableStore();
  tableStores.findByKey("",1,50,{'aipid':props.aipid});
}, [props.aipid]);

  const source: EpsSource[] = [ {
      title: '字段名',
      code: 'id',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '中文说明',
      code: 'name',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '字段类型',
      code: 'type',
      align: 'center',
      formType: EpsFormType.Input
    }]
  const title: ITitle = {
    name: '卷内元数据'
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
        tableService={eepMetaJnService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={500}
        tableRowClick={(record) => console.log('abcef', record)}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        initParams={{'aipid':props.aipid}}
      >
      </EpsPanel>
    </>
  );
})

export default EepMetaJn;
