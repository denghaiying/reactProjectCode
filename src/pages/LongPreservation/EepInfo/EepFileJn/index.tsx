import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import eepFileJnService from './service/EepFileJnService';
import { Form, Input, message, InputNumber, Select, Button} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, DownloadOutlined   } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import moment from 'moment';
import fetch from "../../../utils/fetch";

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


const EepFileJn = observer((props) => {
const ref = useRef();

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  tableSearch: false,
  disableCopy: true,
  searchCode: 'name',
 
}

const onDownload = async (value) => {
    var downurl='/api/api/eepinfo/download/'+props.aipid+'/'+value.fileid+'.'+value.ext
    window.location.href=downurl;
};

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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(eepFileJnService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
        <Button type="primary" title="下载" icon={<DownloadOutlined  />} onClick={() => onDownload(record)}/>
      </>
    );
  }
useEffect(() => {
  const tableStores = ref.current?.getTableStore();
  tableStores.findByKey("",1,50,{'aipid':props.aipid,'tmidJn':props.tmidJn});
}, [props]);

  const source: EpsSource[] = [ {
      title: '文件ID',
      code: 'fileid',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '文件名',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '文件后缀',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '文件大小',
      code: 'size',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: 'md5码',
      code: 'md5code',
      align: 'center',
      formType: EpsFormType.Input
    }]
  const title: ITitle = {
    name: '卷内原文附件'
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
        tableService={eepFileService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={500}
        tableRowClick={(record) => console.log('abcef', record)}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        initParams={{'aipid':props.aipid,'tmidJn':props.tmidJn}}
      >
      </EpsPanel>
    </>
  );
})

export default eepFileJnService;
