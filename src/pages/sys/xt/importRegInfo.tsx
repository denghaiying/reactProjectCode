import {Modal, Form, message, Button,Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import { UploadOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";


const ImportRegInfo = observer(() => {


  const [formData,setFormData] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalWidth, SetModalWidth] = useState(500)

  const [form]= Form.useForm()
  const umid='CONTROL0001';



  useEffect(() => {

    setIsModalVisible(true);
    // setFormData(props.data)
  }, []);



  function onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  }

  function beforeUpload(file) {

    let isJpgOrPng = true ;
    const fname=file.name;
    const extName=fname.substring(fname.lastIndexOf(".") + 1);
    console.log("extName"+extName);

    if (extName != 'rgi') {
      isJpgOrPng=false;
      message.error('只能上传rgi文件!');
    }

    return isJpgOrPng;
  }


  return (
    <>

      <Modal
        title="导入注册信息"
        centered
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={modalWidth}
      >
        <Upload
          name="Fdata"
          action="/api/eps/control/main/xt/importRegInfo"
          beforeUpload={beforeUpload}
     //     data={{id:record.id}}
          onChange={onChange}
          /* onSuccess={onSuccess}*/
      //    listType="text"
        >
          <Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>导入</Button>
        </Upload>

      </Modal>
    </>
  );
})
export default ImportRegInfo
