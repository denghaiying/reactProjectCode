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
  BookOutlined,
  ExclamationCircleOutlined,
  FileExclamationOutlined
} from "@ant-design/icons";
import SysStore from "@/stores/system/SysStore";
import moment from "moment";
import {observer, useLocalObservable} from "mobx-react";
import fetch from "@/utils/fetch";

import { showMessage } from '@/eps/components/message';

const { confirm } = Modal;

interface IProp {
 //   store: EpsTableStore;
    record:{};
}

const Fzys_bak = observer((props: IProp) =>{


  const ref = useRef();

  /**
   * 获取当前用户
   */
  const yhmc = SysStore.getCurrentUser().yhmc;
  /**
   * 获取当前时间
   */
  const getDate = moment().format('YYYY-MM-DD');

  // 本地store
  const fzssstore = useLocalObservable(() => (
    {

      dataSource:[],
      mcdataSource:[],
      logSource:[],
      items:[],
      logCount:0,

      async ss(record) {
        const response = await fetch.post(`/api/eps/control/main/fzsp/addFlow?status=3&id=`
        +record.id+`&whrid=`+SysStore.getCurrentUser().id+`&whr=`+yhmc);
        debugger
        console.log("resp+ss",response);
            if (response.status === 200) {
              debugger
                if (response.data.success) {
                   showMessage('方志进行初审成功', 'info');
                  } else {
                    showMessage('方志进行初审失败！\r\n' + response.data.message, 'warn');
                  }
        }
    },


    }
  ));

  function showPopconfirm() {
    confirm({
        title: '确定要进行志鉴地情资料评审初审申请吗?',
        icon: <ExclamationCircleOutlined />,
        content: '志鉴地情资料评审初审申请！',
        okText: '初审',
      //  okType: 'danger',
        cancelText: '取消',
        onOk: handleOk,
        onCancel: handleCancel,
    });
}

const handleOk = async () => {

    // if(props.record.fjs ===0){
    //   showMessage('此方志无法送审!只有上传了方志文件才能送审！', 'info');
    // }
      debugger
      if (props.record.status !=="1") {
        showMessage('此志鉴地情资料评审无法进行初审!只有登记通过的志鉴地情资料评审才能进行初审！', 'info');
         return;
     }else{
      const res=  await fzssstore.ss(props.record);
     }
    /*if (res && res.status === 200) {
        //   openNotification('解除锁定成功', 'warning');
    }*/

    Modal.destroyAll();

};

const handleCancel = () => {
    console.log('Clicked cancel button');
};


  return (
        <>
           <Tooltip title="初审">
                <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<FileExclamationOutlined />} onClick={showPopconfirm}/>
            </Tooltip>
            </>
  );
})

export default Fzys_bak;
