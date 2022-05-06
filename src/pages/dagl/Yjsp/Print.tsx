import {Modal, Tooltip, Form, message, Button,Upload} from 'antd';
import React, { useState } from 'react';
import { EpsTableStore } from '../../panel/EpsPanel';
import ApplyStore from "@/pages/dagl/Yjsp/ApplyStore";
import {PrinterOutlined, SettingOutlined} from "@ant-design/icons";
import EpsReportStore from "@/eps/components/buttons/EpsReportButton/store/EpsReportStore";
import YhStore from "@/stores/system/YhStore";



function Print(text, record, index, store: EpsTableStore) {


    const [modalWidth, SetModalWidth] = useState(500)

    const [prinstvisible, setPrinstvisible] = useState(false);


    /* function beforeUpload(info) {
         console.log('beforeUpload callback : ', info);
     }*/



    const showModal = () => {
        setPrinstvisible(true);

    }


    let bsreporturl=ApplyStore.yprintUrl;
    return (
        <>
            <Tooltip title="打印">
                <Button size="small" style={{fontSize: '12px'}} type="primary" shape="circle" icon={<PrinterOutlined /> }
                        onClick={() => { ApplyStore.reportPrint(record.id);setPrinstvisible(true)}}
                />

                {/*
                <img src={require('../../../../styles/assets/img/leftNav/icon_canshu.png')} alt="" style={{width: 22, margin: '0 2px'}} onClick={showModal}/>
*/}
            </Tooltip>
            <Modal
                title="报表打印"
                centered
                visible={prinstvisible}
                footer={null}
                width={1200}
                bodyStyle={{height:700}}
                onCancel={() => setPrinstvisible(false)}
            >

                <iframe name="bsframe" frameBorder="false" width="100%" scrolling="auto" height="100%"
                        src={bsreporturl}/>

            </Modal>
        </>
    );
}
export default Print