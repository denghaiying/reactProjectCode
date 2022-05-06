import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import zjksjfileService from './service/ZjksjFileService';
import { Form, Input, message, Select, Checkbox } from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';

import fetch from "../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

const lxData = [{value: "C", label: "文本型"}, {value: "N", label: "数值型"}, {value: "D", label: "日期型"}, {value: "T", label: "日期时间型"}, {value: "B",label: "大文本型"}];
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  tableSearch: false,
  searchCode: 'name'
}



const File = observer((props) => {

const ref = useRef();
const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [zjklist, setZjkzdlist]= useState<Array<{id:string;label:string;value:string}>>([]);
const [jkpzlist, setJkpzlist]= useState<Array<{id:string;label:string;value:string}>>([]);


const _width = 360


const customForm = () => {

  return (
    <>
    </>
  )
}
  // 全局功能按钮
  const customAction = (store: EpsTableStore) => {
    return ([
      <></>
    ])
  }

  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zjksjfileService));

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>

      </>
    );
  }


  useEffect(() => {
    const tableStores = ref.current?.getTableStore();
    tableStores.findByKey("",1,50,{'jkpzid':props.jkpzid,'id':props.id});
  }, [props.jkpzid]);



  const source: EpsSource[] = [{
      title: '附件原ID',
      code: 'fileid',
      align: 'center',
      formType: EpsFormType.Input,
    }, {
      title: '附件名称',
      code: 'filename',
      align: 'center',
      formType: EpsFormType.Input
    }, {
      title: '附件路径',
      code: 'filepath',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '类型',
      code: 'type',
      align: 'center',
      formType: EpsFormType.Input,
    },{
      title: '文件大小',
      code: 'size',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '文件后缀名',
      code: 'ext',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '文件MD5码',
      code: 'md5code',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '文件相关包ID',
      code: 'PID',
      align: 'center',
      formType: EpsFormType.Input,
    }]
  const title: ITitle = {
    name: '文件信息'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="接口名称" className="form-item" name="name"><Input placeholder="请输入接口名称" /></Form.Item >
        <Form.Item label="名称" className="form-item" name="xysjlxmc"><Input placeholder="请输入名称" /></Form.Item >
  
      </>
    )
  }

  return (
    <>
      <EpsPanel title={title}                    // 组件标题，必填
        source={source}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={zjksjfileService}             // 右侧表格实现类，必填
        ref={ref}                                // 获取组件实例，选填
        formWidth={900}
       // searchForm={searchFrom}
        customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
        customTableAction={customTableAction}    // 自定义表格区按钮(以图片+ToolTip组合方式进行使用)，选填
        customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
        initParams={{'jkpzid':props.jkpzid,'id':props.id}}
      >
      </EpsPanel>
    </>
  );
})

export default File;
