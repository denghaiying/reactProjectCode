import React, { useEffect, useRef, useState } from 'react';
import { EpsPanel, EpsTableStore } from '@/eps/components/panel/EpsPanel2';
import EpsFormType from '@/eps/commons/EpsFormType';
import zjksjService from './service/ZjksjService';
import { Form, Input, message, Select, Button , Modal} from 'antd';
import { observer } from 'mobx-react';
import { EpsSource, ITable } from '@/eps/commons/declare';
import jkpzService from '../jkpz/service/Eps9JkpzService';

import EpsModalButton from '@/eps/components/buttons/EpsModalButton';
import { InteractionTwoTone, ContactsTwoTone, ControlTwoTone, GoldTwoTone, EditOutlined, FileTextOutlined, DeleteRowOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SysStore from '@/stores/system/SysStore';
import fetch from "../../../utils/fetch";
import moment from 'moment';
import File from './File';

const { confirm } = Modal;
const ztData = [{value: 0, label: "未同步",key: 0}, {value: 1, label: "已同步", key:1 }, {value: 2, label: "已下载", key:2 }, {value: 3, label: "已解析到中间库", key:3 }, {value: 13, label: "失败", key:13 }];
const yhmc = SysStore.getCurrentUser().yhmc;
/**
 * 获取当前时间
 */
const getDate = moment().format('YYYY-MM-DD HH:mm:ss');

const _width = 500


const tableProp: ITable = {
  disableAdd: true,
  disableEdit: true,
  disableDelete: true,
  disableCopy: true,
  tableSearch: false,
  rowSelection:{
    type:'checkbox'
  },
  labelColSpan: 7,
}

const Zjksj = observer((props) => {

  const ref = useRef();
  const [visible, setVisibleFile] =useState(false);
  const [jkpzid,setJkpzid] = useState('');
  const [tableStore, setTableStore] = useState();
  const [recrodid, setRecrodid]= useState<string>('');
  const [asource, setSource]= useState<Array<{title:string;label:string;align:string;formType:string}>>([]);
  const [xtableStore] = useState<EpsTableStore>(new EpsTableStore(zjksjService));
  const customForm = (text, form) => {
    return (
      <>
       
      </>
    )
  }

  const showPopconfirm = (val) => {
    confirm({
      title: `确定要删除这${val.length}条数据么?`,
      icon: <ExclamationCircleOutlined />,
      content: '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk:  () => {handleOkbl(val)} ,
      onCancel: handleCancelbl,
    });
  };

  const handleOkbl = async (val) => {
    try{
       let url="/api/eps/tyjk/zjk/batchDeletezjksj?jkpzid="+jkpzid;
       const response =await fetch.post(url,val);
        if (response.status ===200) {
          ref.current?.getTableStore().findByKey(jkpzid,1,50,{});
          Modal.destroyAll();
        }else{
          message.error('数据删除错误，请联系系统管理员')
        }
    } catch( err ){
      console.error(err)
      message.error('数据删除错误，请联系系统管理员')
    }

  };

    const handleCancelbl = () => {
    console.log('Clicked cancel button');
  };
  // 全局功能按钮
  const customAction = (store: EpsTableStore, ids: any[]) => {
      return ([
        <>
             <Button danger={true} style={{fontSize: '12px'}} type={'primary'}  icon={<DeleteRowOutlined />} onClick={() =>showPopconfirm(ids)}>批量删除</Button>
        </>
      ])
  }

  const handleCancel = () => {
    setVisibleFile(false);
  };


  const handleOk = () => {
    setVisibleFile(false);
  };
  
  const onOpenFile = (val)=> {
      setRecrodid(val.ID);
      setVisibleFile(true);
  };


  const onUpdateState =  async (val) => {
      let url="/api/eps/tyjk/zjk/updateZjksj?jkpzid="+jkpzid+"&id="+val.ID;
        const response =await fetch.get(url,{});
         if (response.status === 200) {
            if (response.data.success) {
                message.success('变更成功！');
              //tableStore.findByKey(jkpzid,)
            }
        }else{
            message.error('变更失败！');
        }
      ref.current?.getTableStore().findByKey(jkpzid,1,50,{});
  };

  // 创建右侧表格Store实例

  // 自定义表格行按钮detail
  const customTableAction = (text, record, index, store) => {
      return (
        <>
           <Button type="small" title="变更状态"  style={{fontSize: '12px', color: '#08c'}} shape="circle" icon={<EditOutlined />} onClick={() => onUpdateState(record)}/>
          <Button type="small" title="附件"  style={{fontSize: '12px', color: '#08c'}} shape="circle" icon={<FileTextOutlined  />} onClick={() => onOpenFile(record)}/>
        </>
      );
  }
  useEffect(() => {
    setTableStore(ref.current?.getTableStore())
  }, []);

  useEffect(() => {
    const queryzjkList =  async (value) =>{
      let url="/api/eps/tyjk/zdgx/queryForList";
          const response =await fetch.get(url+"?jkid="+value);
          if (response.status === 200) {
             if(response.data){
              var  zjkData = response.data.map(o => ({ 'title':  o.zdmc, 'code':  o.zjkzd, 'align':  'center','formType':  EpsFormType.Input}));
              zjkData.push({ 'title':  '信息', 'code':  'MESSAGE', 'align':  'center','formType':  EpsFormType.Input})
              zjkData.push({ 'title':  '状态', 
              'code':  'JYZT', 
              'align':  'center',
              'formType': EpsFormType.Input,
              'render': (text, record, index) => {
                let ztlist=ztData;
                let aa = ztlist.filter(item => {
                  return item.value === text 
                }) 
                return aa[0]?.label;
              }
            })
            setSource(zjkData);
          }
      }
    }
    if(tableStore?.key){
      queryzjkList(tableStore?.key);
      setJkpzid(tableStore?.key);
      ref.current?.clearTableRowClick();
    }
  
  }, [tableStore?.key])

  const title: ITitle = {
    name: '中间库数据'
  }


  const searchFrom = () => {
    return (
      <>
      
      </>
    )
  }

  return (
    <>
        <EpsPanel
          title={title}                            // 组件标题，必填
          ref={ref}
          source={asource}                          // 组件元数据，必填
          treeService={jkpzService}                  // 左侧树 实现类，必填
          tableProp={tableProp}                    // 右侧表格设置属性，选填
          tableService={zjksjService}                 // 右侧表格实现类，必填
          formWidth={900}
       //   searchForm={searchFrom}
          customForm={customForm}                  // 自定义通用表格(用于新增和修改，现阶段仅适用于一行一列的布局，一行多列待功能完善)，选填
          customTableAction={customTableAction}
          customAction={customAction}
       >
       </EpsPanel>
        <Modal
          title="附件信息"
          visible={visible}
          onOk={() => handleOk()}
          onCancel={() =>handleCancel()}
          width='1380px'
        >
        <div  style={{ height:'500px'}}>
          <File jkpzid={jkpzid} id={recrodid} />
        </div>
      </Modal>
    </>
  );
})

export default Zjksj;
