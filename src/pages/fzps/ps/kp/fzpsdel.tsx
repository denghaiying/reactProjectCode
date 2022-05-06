import React, {useRef, useState} from 'react';
import {
  Button,
  Collapse,
  Form,
  InputNumber,
  List,
  message, Modal,
  Row,
  Select, Space, Switch,
  Table,
  Tooltip
} from 'antd';

import {
  BookOutlined, DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import SysStore from "@/stores/system/SysStore";
import moment from "moment";
import {observer, useLocalObservable} from "mobx-react";
import fetch from "@/utils/fetch";

import { showMessage } from '@/eps/components/message';
import {EpsSource} from "@/eps/components/panel/EpsPanel/EpsPanel";
import {EpsTableStore} from "@/eps/components/panel/EpsPanel";
import YhStore from "@/stores/system/YhStore";
import ChanneltypeService from "@/services/selfstreaming/channeltype/ChanneltypeService";
import KpService from "@/pages/fzps/ps/kp/service/KpService";

const { confirm } = Modal;

export interface IProps{
  title: string;
  data: object;
  store: EpsTableStore;
  afterDelete?: (store: EpsTableStore, data?: Record<string, unknown>) => void;

}

const Fzdel = observer((props: IProp) =>{

  console.log("fzpsDelprops",props)

  const ref = useRef();

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD');

  const [tableStore, setTableStore]= useState<EpsTableStore>(new EpsTableStore(KpService));


  // 本地store
  const delstore = useLocalObservable(() => (
    {

      dataSource:[],
      mcdataSource:[],
      logSource:[],
      items:[],
      logCount:0,

      async del(record) {
        const response = await fetch.post(`/api/eps/control/main/fzsp/delete?id=`+record.id);
        debugger
        console.log("resp+ss",response);
        if (response.status === 200) {
          debugger
          if (response.data.success) {
            showMessage('删除成功', 'info');
          } else {
            showMessage('删除失败！\r\n' + response.data.message, 'warn');
          }
        }
      },


    }
  ));

  function showPopconfirm() {
    confirm({
      title: '确定要删除该条数据么?',
      icon: <ExclamationCircleOutlined />,
      content:  '数据删除后将无法恢复，请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: handleOk,
      onCancel: handleCancel,
    });
  }

  // const handleOk = async () => {
  //   if (props.record.status !=="1") {
  //     // message.warning(`此方志无法送审!只有开篇的方志才能送审！`);
  //     showMessage('此方志无法送审!只有开篇的方志才能送审！', 'info');
  //     return;
  //   }
  //   // if(props.record.fjs ===0){
  //   //   showMessage('此方志无法送审!只有上传了方志文件才能送审！', 'info');
  //   // }
  //   debugger
  //   const res=  await ssstore.ss(props.record);
  //   /*if (res && res.status === 200) {
  //       //   openNotification('解除锁定成功', 'warning');
  //   }*/
  //
  //   Modal.destroyAll();
  //
  // };

  const handleOk = async () => {
    // const res=  await delstore.del(props.record);
    // props.store.findByKey(props.store.key);
    // Modal.destroyAll();
    const res = await props.store.delete(props.record).catch(err => {
      message.error(err.message || err)
    });
    debugger
    if (res) {
     // await KpService.findByKey(props.store.key, props.store.page-1, props.store.size, props.store.params);
     // props.store.findByKey(props.store.key, props.store.page, props.store.size, props.store.params);
     //  setTableStore(ref.current?.getTableStore());
     //  let storeTable = ref.current?.getTableStore();
     //  if (storeTable && storeTable.findByKey) {
     //    storeTable.findByKey('', 1, storeTable.size, {});
     //
     //  }
     //  let storeTable = ref.current?.getTableStore();
     //  if (storeTable && storeTable.findByKey) {
     //    storeTable.findByKey(props.store.key, props.store.page-1, props.store.size, props.store.params);
     //  }
      if(props.store){
        props.store.findByKey(props.store.key, props.store.page, props.store.size, props.store.params);
      }
    }
    Modal.destroyAll();
    if (props.afterDelete) {
      props.afterDelete
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
  };


  return (
    <>

      <Tooltip title="删除">
        <Button size="small" danger={true} style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<DeleteOutlined />} onClick={showPopconfirm}/>
      </Tooltip>

    </>
  );
})

export default Fzdel;
