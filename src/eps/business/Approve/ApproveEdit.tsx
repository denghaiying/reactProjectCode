import React, {useEffect, useRef, useState} from 'react';

import { EpsSource, ITable } from "@/eps/commons/declare";
import {
  Button,
  Form,
  message, Modal,
  Upload
} from 'antd';
import EpsReportButton from "@/eps/components/buttons/EpsReportButton/index";
import Detail from "@/pages/sys/Mk/Detail";
import {observer, useLocalObservable} from 'mobx-react';
import {
  ClearOutlined, ExportOutlined, ImportOutlined,
  LoginOutlined,
  LogoutOutlined, SaveOutlined,
  ToolOutlined, UploadOutlined
} from "@ant-design/icons";
import SysStore from "@/stores/system/SysStore";
import fetch from '@/utils/fetch';
import HttpRequest from '@/eps/commons/v2/HttpRequest';
const FormItem = Form.Item;




const ImportSIP= observer((props) =>{

    console.log('props:',props);


  const [cjvisible, setCjVisible] = useState(false);
  const [bsvisible, setBsVisible] = useState(false);
  const [jspvisible, setJspVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(500)
  const [source, setSource] = useState<Array<EpsSource>>([])
  const [formData, setFormData] = useState({})
  const [title, setTitle] = useState("设计");


   /**
   * 获取当前用户
   */
    const yhmc = SysStore.getCurrentUser().yhmc;


  function onChange(info) {
      console.log('fileuploadstatus==',info.file.status);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
     // console.log('fileuploadstatusDONE==',info.file.response);
      const res = info.file.response;
      if(!res.success){
        message.error(`${res.message} `)
        return;
      }
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  }

  function beforeUpload(file) {

    let isJpgOrPng = true;
    const fname = file.name;
    const extName = fname.substring(fname.lastIndexOf(".") + 1);
    console.log("extName" + extName);

    if (extName !== 'eep') {
      isJpgOrPng = false;
      message.error('只能上传eep文件!');
    }
    return isJpgOrPng;
  }



  return (
    <>

        <Upload
            name="Fdata"
           action='/api/eps/control/main/dagl/importEepInfo'
           beforeUpload={beforeUpload}
          data={{dakid: props.store.dakid,
            tmzt: props.store.tmzt,
            whrid: SysStore.getCurrentUser().id,
            whr: SysStore.getCurrentUser().yhmc,
            yhbh: SysStore.getCurrentUser().bh,
            cjdw: SysStore.getCurrentUser().dwid,
            eepjc: props.store.eepjc,
        }}
          onChange={onChange}
          listType="text">
          
          <Button icon={<UploadOutlined/>} type="primary" style={{margin: '0 0 10px'}}>请选择EEP包</Button>
        </Upload>

    </>
  );
})

export default ImportSIP;
