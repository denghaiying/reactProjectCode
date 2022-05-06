import  {useEffect, useState} from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import { EpsSource, ITable } from "@/eps/commons/declare";
import {Col, Form, Input, Row} from 'antd';
import { observer } from 'mobx-react';
import opionService from './OpinionService';
import moment from "moment";
import Docnr from './Docnr';
const FormItem = Form.Item;

const tableProp: ITable = {
  tableSearch: true,
  disableEdit: true,
  disableDelete:true,
  disableAdd:true,
  disableCopy:true,
  searchCode: 'mc'
}

const Opinion = observer((props) =>{

  const [umid, setUmid] = useState('');

  const getDate = moment().format('YYYY-MM-DD HH:mm:ss');



  // 创建右侧表格Store实例
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(opionService));


  useEffect(() => {
    // SearchStore.queryDw();
    setUmid('SELF005');
  }, []);


  const span = 24;
  const _width = 240


// 自定义表单

  const customForm = () => {
    //自定义表单校验

    return (
      <>
      </>
    )
  }

  const customTableAction = (text, record, index, store) => {

    return (<>
      <Docnr text={text} record={record} index={index} store={store} />
    </>)
    }

  const source: EpsSource[] = [{
    title: '标题',
    code: 'mc',
    align: 'center',
    formType: EpsFormType.Input
  },
    {
      title: '内容',
      code: 'nrxx',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '意见时间',
      code: 'tjsj',
      align: 'center',
      formType: EpsFormType.Input
    }
  ]
  const title = {
    name: '意见管理'
  }

  return (
    <EpsPanel
      title={title}
      source={source}
      tableProp={tableProp}
      formWidth={500}
      customTableAction={customTableAction}                  // 高级搜索组件，选填
      tableService={opionService}
      customForm={customForm}
      //customAction={customAction}              // 自定义全局按钮（如新增、导入、全局打印等），选填
    >
    </EpsPanel>
  );
})

export default Opinion;
