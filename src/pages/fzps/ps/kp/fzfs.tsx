import {Modal, Form, message, Button, Upload, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {FileExclamationOutlined, FileMarkdownOutlined, FilePptOutlined, UploadOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import SysStore from "@/stores/system/SysStore";
import {showMessage} from "@/eps/components/message";

interface IProp {
  //   store: EpsTableStore;
  record:{};
}

const Fzfs = observer((props: IProp) =>{


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(500)

  const [form]= Form.useForm()



  useEffect(() => {

    // setIsModalVisible(true);
    // setFormData(props.data)
  }, []);



  function onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
      if(props.store){
        props.store.findByKey(props.store.key, props.store.page, props.store.size, props.store.params);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  }

  function  show(){
    if(props.record.spzt ==='4' || props.record.spzt ==='5'){
      showMessage('只有登记状态和初审状态的志鉴地情资料才能初审', 'info');

    }else{
      setIsModalVisible(true);
    }

  }

  function beforeUpload(file) {

    let isJpgOrPng = true ;
    const fname=file.name;
    const extName=fname.substring(fname.lastIndexOf(".") + 1);
    console.log("extName"+extName);

    // if (extName != 'rgi') {
    //   isJpgOrPng=false;
    //   message.error('只能上传rgi文件!');
    // }

    return isJpgOrPng;
  }


  return (
    <>
      <Tooltip title="复审">
        <Button size="small"  style={{fontSize: '12px'}} type={'primary'} shape="circle" icon={<FilePptOutlined />}
          // onClick={() => {
          //   setIsModalVisible(true);
          // }}
                onClick={show}
        />
      </Tooltip>

      <Modal
        title="复审"
        centered
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={modalWidth}
      >
        <Upload
          name="Fdata"
          action="/api/eps/control/main/fzsp/addFlow"
          beforeUpload={beforeUpload}
          data={{id:props.record.id,status:4,whrid:SysStore.getCurrentUser().id,whr:SysStore.getCurrentUser().yhmc}}
          onChange={onChange}
          /* onSuccess={onSuccess}*/
          //    listType="text"
        >
          <Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>上传</Button>
        </Upload>

      </Modal>
    </>
  );
})
export default Fzfs
