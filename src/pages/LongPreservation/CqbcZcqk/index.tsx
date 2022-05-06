import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import zglService from './service/CqbcZglService';
import { Form, Input, message, Select} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import ztService from '../cqbcZt/service/CqbcZtService';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";

import moment from 'moment';

const yhmc = SysStore.getCurrentUser().yhmc;

/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const _width = 500


const tableProp: ITable = {
  disableCopy: true,
  disableAdd: true,
  disableDelete: true,
  disableEdit: true,
  tableSearch: false,
}

const CqbcZcqk = observer((props) => {

  const ref = useRef();

  const [tableStore] = useState<EpsTableStore>(new EpsTableStore(zglService));
  const [ztlist, setZtlist]= useState<Array<{id:string;label:string;value:string}>>([]);
  const [daklist, setDaklist]= useState<Array<{id:string;label:string;value:string}>>([]);






  const customForm = (text, form) => {

    return (
      <>
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

  // 创建右侧表格Store实例

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
      return (
        <>

        </>
      );
  }
  useEffect(() => {
      const queryZtList =  async () =>{
        if(tableStore){
          let url="/api/eps/lg/cqbczt";
          const response =await fetch.get(url);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  ztData = response.data.map(o => ({ 'id': o.id, 'label': o.ztmc, 'value': o.id }));
              setZtlist(ztData);
            }else{
              setZtlist(response.data);
            }
          }
        }
      }
      const querydakList =  async () =>{
        if(tableStore){
          let url="/api/eps/control/main/dak/queryForList?iscqbc=Y";
          const response =await fetch.post(url);
          if (response.status === 200) {
            if (response.data.length > 0) {
              let  dakData = response.data.map(o => ({ 'id': o.id, 'label': o.mc, 'value': o.id }));
              setDaklist(dakData);
            }else{
              setDaklist(response.data);
            }
          }
        }
      }
      
    queryZtList();
    querydakList();
  }, []);

  const source: EpsSource[] = [{
      title: '所属载体',
      code: 'ztid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let jlist=ztlist;
        let aa = jlist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '档案库',
      code: 'dakid',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        let dalist=daklist;
        let aa = dalist.filter(item => {
          return item.value === text
        })
        return aa[0]?.label
      },
    },{
      title: '组号',
      code: 'bh',
      align: 'center',
      formType: EpsFormType.Input,
    },{
      title: '存储位置',
      code: 'wz',
      align: 'center',
      formType: EpsFormType.Input
    },{
      title: '容量(G)',
      code: 'rl',
      align: 'center',
      formType: EpsFormType.Input
    },
    {
      title: '状态',
      code: 'zt',
      align: 'center',
      formType: EpsFormType.Input,
      render: (text, record, index) => {
        if(text ==='1'){
          return '组盘中';
        }else{
          return '完成';
        }
      },
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
    name: '载体存储详情'
  }


  const searchFrom = () => {
    return (
      <>
        <Form.Item label="所属载体" className="form-item" name="ztid"> <Select placeholder="所属载体" style={{width:  300}}   options={ztlist} /></Form.Item >
      </>
    )
  }

  return (
    <>
        <EpsPanel
          title={title}                            // 组件标题，必填
          ref={ref}
          source={source}                          // 组件元数据，必填
          treeService={ztService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={zglService}                 // 右侧表格实现类，必填
          formWidth={900}
          searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction}
          customAction={customAction}
       >
       </EpsPanel>
    </>
  );
})

export default CqbcZcqk;
