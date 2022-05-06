import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel3';
import EpsFormType from '@/eps/commons/EpsFormType';
import eepDataService from './service/EepDataService';
import { Form, Input, message, InputNumber, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, UploadOutlined  } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../../utils/fetch";
import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');


const EepData = observer((props) => {
const ref = useRef();
const source: EpsSource[] = [];

const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  tableSearch: false,
 // searchCode: 'tm',
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
  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(eepDataService));
  const [aSource, setSource]= useState<Array<{title:string;label:string;align:string;formType:string}>>([]);

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
    return (
      <>
      </>
    );
  }
useEffect(() => {
  const querymbzlxList =  async (value) =>{
          let url="/api/api/eepinfo/queryEepColumn";
          const response =await fetch.get(url+"/"+value);
          if (response.status === 200) {
             if(response.data && response.data.columModle){
              let  zjkData = response.data.columModle.map(o => ({ 'title':  o.text, 'code':  o.dataIndex, 'align':  'center','formType':  'EpsFormType.Input'}));
              setSource(zjkData);
          }
    }
  }
  querymbzlxList(props.aipid);
  const tableStores = ref.current?.getTableStore();
  tableStores.findByKey("",1,50,{'aipid':props.aipid});
  ref.current?. clearTableRowClick();
}, [props.aipid]);


    
  const title: ITitle = {
    name: '条目信息'
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
        source={aSource}                          // 组件元数据，必填
        tableProp={tableProp}                    // 右侧表格设置属性，选填
        tableService={eepDataService}             // 右侧表格实现类，必填
        ref={ref}
        setCheckRows={props.checkrowtwo}                                // 获取组件实例，选填
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

export default EepData;
