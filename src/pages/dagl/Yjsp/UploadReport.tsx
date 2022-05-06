import {Modal, Tooltip, Form, message, Button,Upload} from 'antd';
import React, { useState } from 'react';
import { EpsTableStore } from '../../panel/EpsPanel';
import { UploadOutlined} from "@ant-design/icons";
import YjspStore from "@/stores/dagl/YjspStore";
import ApplyStore from "@/pages/dagl/Yjsp/ApplyStore";
import {observer} from "mobx-react";



const UploadReport = observer(() => {
    const [uploadVisible, setUploadVisible] = useState(false);

    const [modalWidth, SetModalWidth] = useState(500)

   // const bsfile=record.reportname?record.reportname+".jasper":"";


    /* function beforeUpload(info) {
         console.log('beforeUpload callback : ', info);
     }*/


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

        if (extName != 'jasper') {
            isJpgOrPng=false;
            message.error('只能上传JASPER文件!');
        }
        /* const isLt2M = file.size / 1024 / 1024 < 2;
         if (!isLt2M) {
             message.error('Image must smaller than 2MB!');
         }
         return isJpgOrPng && isLt2M;*/
        return isJpgOrPng;
    }



    return (
        <>
          {/*  <Tooltip title="报表">
                <Button size="small" style={{fontSize: '12px'}} type="primary" shape="circle" icon={<SettingOutlined /> } onClick={showModal}/>


                <img src={require('../../../../styles/assets/img/leftNav/icon_canshu.png')} alt="" style={{width: 22, margin: '0 2px'}} onClick={showModal}/>

            </Tooltip>*/}
            <Button type="primary" style={{marginRight: 10}} onClick={() => {

                setUploadVisible(true)
            }}>
                报表
            </Button>
            <Modal
                title="报表文件上传"
                centered
                visible={uploadVisible}
                footer={null}
                onCancel={() => setUploadVisible(false)}
                width={modalWidth}
            >
                <Upload
                    action="/api/eps/control/main/yjsp/upload"
                    beforeUpload={beforeUpload}
                    data={{umid:ApplyStore.Umid}}
                    onChange={onChange}
                    /* onSuccess={onSuccess}*/
                    listType="text">
                   {/* <label>{bsfile}</label>*/}
                    <br/>
                    <Button icon={<UploadOutlined />} type="primary" style={{margin: '0 0 10px'}}>报表文件上传</Button>
                </Upload>

            </Modal>
        </>
    );
})
export default UploadReport
